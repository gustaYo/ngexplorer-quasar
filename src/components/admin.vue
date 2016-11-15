<template>
  <div class="layout-view">
    <div style="width: 100%;">
      <quasar-tabs class="primary" slot="navigation">
      <quasar-tab icon="mail" :target="target1" v-link="{path: '/admin/proveedores', exact: true}">
      Proveedores
    </quasar-tab>
    <quasar-tab icon="mail" :target="target2" v-link="{path: '/admin/proxy', exact: true}">
    Configuracion del proxy
  </quasar-tab> 
</quasar-tabs>
<div id="tab-1" class="tab">
<div class="row group">
  <quasar-search :model.sync="search" class="primary"></quasar-search>
  <button class="primary" style="float:right" @click="editUser(user)">Usuario</button>
   <button class="primary" style="float:right" @click="userLogout()">salir</button>
</div>
 
  <table  style="width: 100%;" class="quasar-table highlight bordered compact full-width"> 
    <thead> 
      <tr>
        <th>Nombre</th>
        <th>dirscan</th>
        <th style="width: 5%;">Type </th> 
        <th style="width: 10%;">Update</th>
        <th style="width: 10%;">Creado</th>
        <th style="width: 10%;">Actions</th>
      </tr>
    </thead>
    <tr v-for="prov in proveedoresList | filterBy search"> 
     <td class="text-left"> 
      <label>{{ prov.name }}</label> 
    </td>
    <td class="text-left"> 
      <label>{{ prov.dirscan }}</label> 
    </td class="text-left">
    <td> 
      <label>{{ prov.type }}</label> 
    </td>
    <td class="text-right" > {{prov.update}} </td>
    <td class="text-right"> {{prov.create}} </td>
    <td >
      <quasar-popover v-ref:pov[$index] position="bottom right">
      <button slot="target"><i class="on-left">edit</i>Configurar</button>
      <div class="list">
        <div class="item item-link">
          <div class="item-content" @click="addEditProv(prov)">Editar</div>
        </div>
        <div class="item item-link">
          <div class="item-content" @click="deleteProve(prov)" >Eliminar</div>
        </div>
        <div class="item item-link">
          <div class="item-content" @click="sincronizeProv(prov)">Sincronizar</div>
        </div>
        <div class="item item-link">
          <div class="item-content" @click="escannerProve(prov)">Scannear</div>
        </div>                
      </div>
    </quasar-popover> 
  </td>
</tr>
</table>
<quasar-fab class="absolute-bottom-right" type="primary" direction="up">
<quasar-small-fab label="first" class="tertiary" @click="addEditProv()">folder_open</quasar-small-fab>
</quasar-fab>
</div>
<div id="tab-2" class="tab">
  <div class="row gutter sm-column wrap">   
    <div class="width-4of4">
      <div class="row group">
        <div class="item two-lines">
          <i class="item-primary">folder_shared</i>
          <div class="item-content row items-center">
            <div style="margin-right: 10px;">Usar proxy:</div>
            <quasar-radio :model.sync="proxy.enable" value="useproxy"></quasar-radio>
          </div>
        </div>
        <div class="item two-lines">
          <i class="item-primary">cloud</i>
          <div class="item-content row items-center">
            <div style="margin-right: 10px;">No usar proxy:</div>
            <quasar-radio :model.sync="proxy.enable" value="noproxy"></quasar-radio>
          </div>
        </div>
      </div>   
    </div>    
    <div class="width-2of4" v-if="proxy.enable==='useproxy'">
      <div class="list inner-delimiter bordered">
        <div class="item two-lines">
          <i class="item-primary">folder_open</i>
          <div class="item-content row items-center">
            <div style="margin-right: 10px;">Url:</div>
            <input class="auto" required v-model="proxy.url">
          </div>
        </div>
      </div>
    </div>
    <div class="width-2of4" v-if="proxy.enable==='useproxy'">
      <div class="list inner-delimiter bordered">
        <div class="item two-lines">
          <i class="item-primary">folder_open</i>
          <div class="item-content row items-center">
            <div style="margin-right: 10px;">Port:</div>
            <input class="auto" required v-model="proxy.port">
          </div>
        </div>
      </div>
    </div>
    <button class="primary auto" @click="saveProxy">Guardar</button>
  </div>
</div>
</div>
</div>
</template>

<script>
import UserService from '../services/user'
import { setFtpsList } from '../vuex/actions'
import { getFtpsList } from '../vuex/getters'
import { Modal, Dialog, Loading } from 'quasar'
import ProvForm from './provForm.vue'
import Sincronize from './sincronizar.vue'
import FtpFile from '../services/ftpfiles'
import Store from '../services/lstorage'
import registerForm from './users/register.vue'
export default {
  route: {
    canActivate: function (transition) {
      return UserService.user_acces('Admin') ? true : transition.redirect('/login')
    }
  },
  vuex: {
    actions: {
      setFtpsList
    },
    getters: {
      proveedoresList: getFtpsList
    }
  },
  data () {
    return {
      user: UserService.getUser(),
      search: '',
      target1: '#tab-1',
      target2: '#tab-2',
      proxy: Store.get('proxy', {
        enable: 'noproxy',
        url: 'http://127.0.0.1',
        port: 3128
      })
    }
  },
  methods: {
    editUser (some) {
      window.user = some
      Modal.create(registerForm)
       .css({
         maxWidth: '60vw',
         minHeight: '80vh'
       })
       .onShow(() => {
         // Toast.create('Opened a simple modal')
       })
       .onClose(() => {
         window.user = {}
       })
       .show()
    },
    saveProxy () {
      Store.set('proxy', this.proxy)
    },
    userLogout () {
      UserService.logout()
    },
    addEditProv (some) {
      if (some) {
        window.prov = some
      }
      else {
        window.prov = null
      }
      Modal.create(ProvForm)
        .css({
          minWidth: '50vw',
          minHeight: '60vh'
        })
       .onShow(() => {
         // Toast.create('Opened a simple modal')
       })
       .onClose(() => {
         this.getFtpProve()
       })
       .show()
    },
    getFtpProve () {
      FtpFile.get(this).then(function (response) {
        this.setFtpsList(response.data)
      }, function (response) {
        console.log('error', response)
      })
    },
    deleteProve (some) {
      var somethis = this
      Dialog.create({
        title: 'Desea eliminar realmente el proveedor' + some.name,
        message: 'Todos los recursos asociados se perderán',
        buttons: [
          {
            label: 'No',
            handler () {
              console.log('cancelo')
            }
          },
          {
            label: 'Si',
            handler () {
              somethis.deleteProveConfirm([some._id])
            }
          }
        ]
      }).show()
    },
    closeLoading () {
      setTimeout(Loading.hide, 600)
    },
    deleteProveConfirm (ides) {
      Loading.show()
      FtpFile.deleteprov(this, JSON.stringify(ides)).then(function (response) {
        this.closeLoading()
        this.getFtpProve()
      }, function (response) {
        console.log('error', response)
      })
    },
    escannerProve (some) {
      Loading.show()
      let parms = {_idServer: some._id, proxy: {}, complete: 'yes'}
      FtpFile.scannerFtp(this, parms).then(function (response) {
        this.closeLoading()
        Dialog.create({
          title: 'Escaneando el ftp',
          message: 'Se esta escaneado, esto puede demorar un poco'
        }).show()
      }, function (response) {
        this.closeLoading()
        console.log('error', response)
        Dialog.create({
          title: 'Error al escanear',
          message: response.data
        }).show()
      })
    },
    sincronizeProv (some) {
      window.prov = some
      Modal.create(Sincronize)
        .css({
          minWidth: '50vw',
          minHeight: '60vh'
        })
       .onShow(() => {
         // Toast.create('Opened a simple modal')
       })
       .onClose(() => {
         // dissmin modal
       })
       .show()
    }
  },
  created () {
  }
}
</script>

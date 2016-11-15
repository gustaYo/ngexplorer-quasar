<template>
  <div>
    <quasar-layout>
    <div slot="header" class="toolbar">
      <button class="left-drawer-opener"><i>menu</i></button>
      <quasar-toolbar-title :padding="1" v-link="'/'">
      NGEXPLORER
    </quasar-toolbar-title>
    <div> 
      <quasar-popover v-ref:leng position="bottom left">
      <button slot="target"><i class="on-left">language</i>{{ lenguajeName }}</button>
      <div class="list">
        <div class="item item-link {{ [len.value === lenguaje ? 'active' : ''] }}" v-for="len in selectOptions">
          <div class="item-content" @click="changeLenguaje(len.value)">{{ len.label }}</div>
        </div>               
      </div>
    </quasar-popover>       
  </div>
  <button class="right-drawer-opener"><i>menu</i></button>                  
</div>
<quasar-drawer v-show="$route.name!=='admin'">
<div style="text-align: center">
  <img style="height: 120px;" src="../statics/ngexplorer.png">
</div>
<div class="list">
  <div class="item item-link drawer-closer {{ isTabActive(prove._id) }}" v-for="prove in proveedoresList" @click="OpenFtpTab(prove)">
    <i class="item-primary">alarm</i>
    <div class="item-content">{{ prove.name }}</div>
  </div>
</div>
</quasar-drawer>    
<quasar-drawer right-side swipe-only>
<div class="toolbar light border-bottom">
  <quasar-toolbar-title :padding="1">
  Admin
</quasar-toolbar-title>
</div>
<div class="list">
  <div class="item item-link drawer-closer" v-link="{path: '/admin/proveedores'}">
    <i class="item-primary">schedule</i>
    <div class="item-content">Administar</div>
  </div>
  <div class="item item-link drawer-closer" v-link="{path: '/stadist'}">
    <i class="item-primary">schedule</i>
    <div class="item-content">Estadisticas</div>
  </div>  
</div>
<div class="list">
  <div class="item three-lines">
    <i class="item-primary">faces</i>
    <div class="item-content">
      <div class="floating-label">
        <input v-model="serverDir" required class="full-width">
        <label>Url server</label>
      </div>
    </div>
  </div>
</div>
</quasar-drawer>
<quasar-modal :set="{minimized: true}" :css="{minWidth: '30vw', minHeight: '30vh'}" v-ref:stadistmodal>
<quasar-layout>
<div slot="header" class="toolbar">
  <button @click="$refs.stadist.close()"><i>arrow_back</i></button>
  <div class="toolbar-content">
    <div class="toolbar-title padding-2">
      <div>Estadisticas</div>
    </div>
  </div>
</div>
<div class="layout-view">
  <h1>pepepe</h1>
</div>
<quasar-layout>
</quasar-modal>
<router-view class="layout-view"></router-view>
<div slot="footer" class="toolbar light" v-show="$route.name==='home'">
  <div class="row group" style="text-align: center;width: 100%;">
    <label><a href="https://github.com/gustayo">Gustavo Crespo Sánchez </a>©2016</label>
  </div>  
</div>
</quasar-layout>
</div>
</template>

<script>
import FtpFile from '../services/ftpfiles'
import UserAgent from 'express-useragent'
import Store from '../services/lstorage'
import User from '../services/user'
import { userView, ftpFilters, ftpSelect, setModeFilter, addFtpToFilter, deleteFtpToFilter, setFtpsList } from '../vuex/actions'
import { getUserView, getFtpsFilters, getFtpSelect, getModeFilter, getFtpsList } from '../vuex/getters'
export default {
  data () {
    return {
      serverDir: Store.get('serverDir'),
      lenguaje: Store.get('lenguaje'),
      lenguajeName: 'Español',
      counter: {},
      selectOptions: [
        {
          label: 'Español',
          value: 'es'
        },
        {
          label: 'Ingles',
          value: 'en'
        }
      ],
      proveedoresList: [
        {
          name: 'Prove1',
          _id: 'Prove1'
        },
        {
          name: 'Prove2',
          _id: 'Prove2'
        },
        {
          name: 'Prove3',
          _id: 'Prove3'
        }
      ]
    }
  },
  vuex: {
    actions: {
      userView,
      ftpFilters,
      ftpSelect,
      setModeFilter,
      addFtpToFilter,
      deleteFtpToFilter,
      setFtpsList
    },
    getters: {
      user: getUserView,
      modefilter: getModeFilter,
      tabActive: getFtpSelect,
      ftpsselect: getFtpsFilters,
      proveedoresList: getFtpsList
    }
  },
  methods: {
    getLenguajeName () {
      for (var i in this.selectOptions) {
        if (this.selectOptions[i].value === this.lenguaje) {
          this.lenguajeName = this.selectOptions[i].label
        }
      }
    },
    OpenFtpTab (ftp) {
      var parms = ''
      if (this.modefilter) {
        var post = this.ftpsselect.indexOf(ftp._id)
        if (post !== -1) {
          this.deleteFtpToFilter(post)
        }
        else {
          this.addFtpToFilter(ftp._id)
        }
        parms = JSON.parse(this.$route.params.dir)
        parms.ftps = this.ftpsselect
        parms = JSON.stringify(parms)
        this.$route.router.go('/' + this.$route.params.idProve + '/filter/' + parms)
      }
      else {
        window.reloadTab = true
        var someFtp = this.isTabOpen(ftp._id)
        if (someFtp) {
          if (someFtp.filter.active) {
            parms = JSON.parse(someFtp.filter.parms)
            parms.ftps = this.ftpsselect
            parms = JSON.stringify(parms)
            this.setModeFilter(true)
          }
          this.$route.router.go('/' + someFtp._id + '/' + (someFtp.filter.active ? 'filter' : 'explorer') + '/' + (someFtp.filter.active ? parms : (someFtp.dirscan === '/' ? 'home' : someFtp.dirscan)))
        }
        else {
          this.$route.router.go('/' + ftp._id + '/explorer/' + (ftp.dirscan === '/' ? 'home' : ftp.dirscan))
        }
      }
    },
    isTabOpen (idFtp) {
      var tabs = Store.get('tabsNav', [])
      for (var i in tabs) {
        if (tabs[i]._id === idFtp) {
          return tabs[i]
        }
      }
      return false
    },
    isTabActive (idFtp) {
      return this.modefilter ? (this.ftpsselect.indexOf(idFtp) !== -1 ? 'active' : '') : (this.tabActive === idFtp ? 'active' : '')
    },
    getFtpProve () {
      FtpFile.get(this).then(function (response) {
        this.setFtpsList(response.data)
        this.proveedoresList = response.data
        this.ftpsSelectsDefault()
      }, function (response) {
        console.log('error', response)
      })
    },
    ftpsSelectsDefault () {
      var selects = Store.get('ftpsSelect', false)
      if (!selects) {
        selects = []
        for (var i in this.proveedoresList) {
          selects.push(this.proveedoresList[i]._id)
        }
        Store.set('ftpsSelect', selects)
      }
      this.ftpFilters(selects)
    },
    changeLenguaje (len) {
      if (this.lenguaje !== len) {
        Store.set('lenguaje', len)
        window.location.reload()
      }
    },
    userVisitCount () {
      var userAgent = UserAgent.parse(navigator.userAgent)
      var data = {
        browser: userAgent.browser,
        browser_version: userAgent.version,
        device: 'vue-quazar',
        os: userAgent.platform,
        os_version: userAgent.os,
        type: 'v'
      }
      console.log(data)
      User.userVisit(this, data).then(function (response) {
        this.counter = response.data
      }, function (response) {
        console.log('error', response)
      })
    },
    viewModalStadist () {
      this.$refs.stadistmodal.show()
    }
  },
  created () {
    this.getLenguajeName()
    this.getFtpProve()
    this.userVisitCount()
  }
}
</script>

<style scoped>
.item.active, .item.v-link-active {
    background: rgb(140, 170, 195) !important;
}
</style>
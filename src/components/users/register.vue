<template>
  <quasar-layout>
  <div slot="header" class="toolbar">
    <button @click="closeModal()"><i>arrow_back</i></button>
    <div class="toolbar-content">
      <div class="toolbar-title padding-2">
        <div>{{ titleForm }}</div>
      </div>
    </div>
  </div>
  <div class="layout-view">
    <form v-on:submit.prevent="usersignin()">
      <div class="list">
        <div class="item three-lines">
          <i class="item-primary">faces</i>
          <div class="item-content">
            <div class="floating-label">
              <input v-model="user.username" required class="full-width">
              <label>Usuario</label>
            </div>
          </div>
        </div>
        <div class="item three-lines">
          <i class="item-primary">faces</i>
          <div class="item-content">
            <div class="floating-label">
              <input v-model="user.name" required class="full-width">
              <label>Nombre completo</label>
            </div>
          </div>
        </div>    
        <div class="item three-lines">
          <i class="item-primary">mail</i>
          <div class="item-content">
            <div class="floating-label">
              <input v-model="user.email" required class="full-width">
              <label>Correo</label>
            </div>
          </div>
        </div> 
        <div class="item three-lines">
          <i class="item-primary">security</i>
          <div class="item-content">
            <div class="floating-label">
              <input v-model="user.password" required class="full-width" type="password">
              <label>Password</label>
            </div>
          </div>
        </div>   
        <div class="item three-lines">
          <i class="item-primary">security</i>
          <div class="item-content">
            <div class="floating-label">
              <input v-model="passwordrepit" required class="full-width" type="password">
              <label>Repit password</label>
            </div>
          </div>
        </div>
      </div>
      <div style="text-align: center" >
        <button class="primary" type="submit" style="width: 100%;">
          {{titleForm}}
        </button>
        {{error|json}}   
      </div>
    </form>
  </div>
</div>
</quasar-layout>
</template>

<script>
import { Toast } from 'quasar'
import UserService from '../../services/user'
export default {
  data () {
    return {
      titleForm: 'Registrar usuario',
      user: {
        username: '',
        password: '',
        email: '',
        name: ''
      },
      error: '',
      passwordrepit: ''
    }
  },
  methods: {
    usersignin () {
      UserService.signin(this, this.user).then(function (response) {
        if (window.user._id) {
          Toast.create('Usuario editado correctamente')
        }
        else {
          Toast.create('Usuario adicionado correctamente')
        }
        this.close()
      }, function (response) {
        this.error = response.data
      })
    },
    closeModal () {
      window.user = {}
      this.close()
    }
  },
  created () {
    this.user = window.user
    if (this.user._id) {
      this.user.password = ''
      this.titleForm = 'Modificar usuario'
    }
  }
}
</script>

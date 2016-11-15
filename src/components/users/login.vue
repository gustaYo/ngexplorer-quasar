<template>
  <div class="layout-view">
    <div class="card" style="padding-left: 30%;padding-right: 30%;">
    <div style="text-align: center">
      <h4>{{ $t("login.title") }}</h4>
    </div>
      <div class="card-content">
        <div >
          <form v-on:submit.prevent="userloguin()">
      <div class="list">
        <div class="item three-lines">
          <i class="item-primary">faces</i>
          <div class="item-content">
            <div class="floating-label">
              <input v-model="user.username" required class="full-width">
              <label>{{ $t("login.username") }}</label>
            </div>
          </div>
        </div>
        <div class="item three-lines">
          <i class="item-primary">security</i>
          <div class="item-content">
            <div class="floating-label">
              <input v-model="user.password" required class="full-width" type="password">
              <label>{{ $t("login.password") }}</label>
            </div>
          </div>
        </div>
            </div>
            <div style="text-align: center" >
              <button class="primary" type="submit" style="width: 100%;">
                {{ $t("login.authenticate") }}
              </button>
            </div>
          </form>  
        </div>
      </div>
    </div>
  </div>
</div>
</template>

<script>
import Vue from 'vue'
import UserService from '../../services/user'
import Storage from '../../services/lstorage'
import { Modal, Toast, Loading } from 'quasar'
import registerForm from './register.vue'
export default {
  data () {
    return {
      user: {
        username: '',
        password: ''
      }
    }
  },
  methods: {
    closeLoading () {
      setTimeout(Loading.hide, 600)
    },
    userloguin () {
      Loading.show()
      UserService.authenticate(this, this.user).then(function (response) {
        Storage.set('token', response.data.token)
        UserService.setUser(response.data.data)
        this.$route.router.go('/admin/proveedores')
        this.closeLoading()
      }, function (response) {
        this.closeLoading()
        var key = 'login.errors.' + response.data
        Toast.create(Vue.t(key))
      })
    },
    CreateAccount () {
      Modal.create(registerForm)
      .css({
        maxWidth: '60vw',
        minHeight: '80vh'
      })
      .onShow(() => {
        // Toast.create('Opened a simple modal')
      })
      .onClose(() => {
        // Toast.create(Vue.t('login.errors.success'))
      })
      .show()
    }
  }
}
</script>

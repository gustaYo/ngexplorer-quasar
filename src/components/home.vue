<template>
  <div class="layout-view">
    <div>
    <div class="">
      <quasar-parallax v-bind:src="'statics/ngexplorer.png'" :height="360">
      <div slot="loading">Loading...</div>
      <h1>Ngexplorer</h1>
    </quasar-parallax>
  </div>
  <div class="container">
    <div class="section">
      <!--   Icon Section   -->
      <div class="row gutter sm-column wrap" style="text-align: center;">
        <div class="width-1of3" >
          <div class="icon-block">
            <h2 class="center brown-text"><i class="material-icons">filter_center_focus</i></h2>
            <h5 class="center">1. Seleccionar</h5>
            <p class="light">
            Selecciona uno de los proveedores registrados
            </p>
          </div>
        </div>
        <div class="width-1of3">
          <div class="icon-block">
            <h2 class="center brown-text"><i class="material-icons">folder</i></h2>
            <h5 class="center">2. Explorar</h5>
            <p class="light">Mediante la interfaz comun explora los directorios indexados</p>
          </div>
        </div>
        <div class="width-1of3">
          <div class="icon-block">
            <h2 class="center brown-text"><i class="material-icons">search</i></h2>
            <h5 class="center">3. Buscar</h5>
            <p class="light">Al seleccionar este modo puedes realizar busquedas personalizadas en uno o varios proveedores, de forma rápida y eficiente</p>
          </div>
        </div>

        <div class="width-3of3">
  <div class="card">
    <div class="card-title">
      Clientes Ngexplorer
    </div>
    <div class="card-content">
       <div class="row group">
    <button class="primary auto" @click="openClient('angular')">Angular</button>
    <button class="tertiary auto" @click="openClient('vue')">Vuejs bootstrap</button>
    <button class="indigo auto" @click="openClient('vueq')">Vuejs quasar</button>
  </div>
    </div>
  </div>
        </div>        
      </div>
    </div>
  </div>
</div>
</template>

<script>
import { setModeFilter, ftpSelect } from '../vuex/actions'
import { Toast } from 'quasar'
export default {
  data () {
    return {
      user: {
        username: '',
        password: ''
      }
    }
  },
  vuex: {
    actions: {
      setModeFilter,
      ftpSelect
    }
  },
  methods: {
    openClient (some) {
      if (some === 'vueq') {
        Toast.create('Estoy aquí')
      }
      else {
        var win = window.open(window.location.origin + '/' + some, '_blank')
        win.focus()
      }
    }
  },
  created () {
    this.setModeFilter(false)
    this.ftpSelect('none')
  }
}
</script>

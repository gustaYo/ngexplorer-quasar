<template>
  <div class="layout-view">
    <h1>Estadisticas</h1>
    <div v-if="$loadingRouteData" style="text-align: center"><h1>Loading ...</h1></div>
    <div class="panel panel-default" v-if="!$loadingRouteData">
      {{datachart|json}}
    </div>

  </div>
</template>

<script>
import Store from '../services/lstorage'
export default {
  route: {
    data (transition) {
      return Promise.all([
        this.$http.put(Store.get('serverDir') + '/ftp/filescount', {numdays: 1})
      ]).then(function (data) {
        const charstData = data[0].data
        return {
          datachart: charstData
        }
      })
    }
  },
  data () {
    return {
      datachart: []
    }
  },
  methods: {
  }
}
</script>

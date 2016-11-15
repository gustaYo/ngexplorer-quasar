<template>
	<quasar-layout>
	<div slot="header" class="toolbar">
		<button @click="close()"><i>arrow_back</i></button>
		<div class="toolbar-content">
			<div class="toolbar-title padding-2">
				<div>Sincronizar proveedor</div>
			</div>
		</div>
	</div>
	<div class="layout-view">
		<div class="row gutter sm-column wrap">			 
			<div class="width-4of4">
				<div class="list inner-delimiter bordered">
					<div class="item two-lines">
						<i class="item-primary">folder_open</i>
						<div class="item-content row items-center">
							<div style="margin-right: 10px;">Remote Uri:</div>
							<input class="auto" required v-model="remoteUri">
						</div>
					</div>
					</div>
				</div>
				<div class="width-4of4">
					<div class="row group" >
						<button class="primary auto" v-show="!state" @click="TestSinronize">Establecer conexión</button>
						<button class="tertiary auto" v-show="state" @click="startSincronice">Sincronizar</button>
					</div>
				</div>       
			</div>

			<quasar-progress :model="progress" class="stripe animate"></quasar-progress>	                        <div v-show="count !== 0">
                            <label>{{ count}}</label>/<b>{{ remote.numFiles}}</b>
                        </div>
			{{remote|json}}
		</div>
	</div>
</quasar-layout>
</template>
<script>
import FtpFile from '../services/ftpfiles'
export default {
  data () {
    return {
      remoteUri: 'http://127.0.0.1:3010',
      progress: 0,
      paso: 1000,
      total: 0,
      count: 0,
      remote: {},
      local: {},
      state: false,
      page: 0
    }
  },
  methods: {
    TestSinronize () {
      var dta = {
        'action': 'found',
        'uri': this.local.uri,
        'dirscan': this.local.dirscan
      }
      FtpFile.sincronizeServerProve(this, this.remoteUri, dta).then(function (response) {
        this.state = true
        this.remote = response.data
      }, function (response) {
        console.log('Host remoto desconocido', response)
      })
    },
    startSincronice () {
      this.sincro()
    },
    sincro () {
      var dta = {
        'action': 'getfiles',
        'idprove': this.remote.ftp._id,
        page: this.page,
        perPage: 15000
      }
      FtpFile.sincronizeServerProve(this, this.remoteUri, dta).then(function (response) {
        this.count += response.data.length
        FtpFile.addFileToServerProve(this, {action: 'insert', files: response.data}).then(function (response) {
        // calculo de %
          this.progress = (100 * this.count) / this.remote.numFiles
          if (this.count < this.remote.numFiles) {
            this.page += 1
            this.sincro()
          }
          else {
            console.log('termino la sincronizacion')
            FtpFile.addFileToServerProve(this, {action: 'finish', idOld: this.remote.ftp._id, idNew: this.local._id}).then(function (response) {
              window.alert('terminado')
            }, function (response) {
              console.log('error', response)
            })
          }
        }, function (response) {
          console.log('error', response)
        })
      }, function (response) {
        console.log('Host remoto desconocido', response)
      })
    }
  },
  created () {
    if (window.prov) {
      this.local = JSON.parse(JSON.stringify(window.prov))
    }
  }
}

</script>

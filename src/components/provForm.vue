<template>
	<quasar-layout>
	<div slot="header" class="toolbar">
		<button @click="close()"><i>arrow_back</i></button>
		<div class="toolbar-content">
			<div class="toolbar-title padding-2">
				<div>Proveedor</div>
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
							<div style="margin-right: 10px;">Nombre:</div>
							<input class="auto" required v-model="prov.name">
						</div>
					</div>
					<div class="item two-lines">
						<i class="item-primary">folder_open</i>
						<div class="item-content row items-center">
							<div style="margin-right: 10px;">Uri:</div>
							<input class="auto" required v-model="prov.uri">
						</div>
					</div>					
					<div class="row group">
						<div class="item three-lines">
							<i class="item-primary">import_contacts</i>
							<div class="item-content">
								<div class="floating-label">
									<input v-model="prov.dirscan" required class="full-width">
									<label>Directorio Escanner</label>
								</div>
							</div>
						</div>
						<div class="item two-lines">
							<i class="item-primary">folder_shared</i>
							<div class="item-content row items-center">
								<div style="margin-right: 10px;">FTP:</div>
								<quasar-radio :model.sync="prov.type" value="ftp"></quasar-radio>
							</div>
						</div>
						<div class="item two-lines">
							<i class="item-primary">cloud</i>
							<div class="item-content row items-center">
								<div style="margin-right: 10px;">HTTP:</div>
								<quasar-radio :model.sync="prov.type" value="http"></quasar-radio>
							</div>
						</div>
					</div>			
					<div class="row group" v-if="prov.type === 'ftp'">
						<div class="item three-lines">
							<i class="item-primary">face</i>
							<div class="item-content">
								<div class="floating-label">
									<input v-model="prov.user" required  class="full-width">
									<label>user</label>
								</div>
							</div>
						</div>				
						<div class="item three-lines">
							<i class="item-primary">security</i>
							<div class="item-content">
								<div class="floating-label">
									<input v-model="prov.password" required  class="full-width" type="password">
									<label>password</label>
								</div>
							</div>
						</div>	
					</div>
					<div class="row group">
						<div class="item three-lines">
							<i class="item-primary">low_priority</i>
							<div class="item-content">
								<div class="floating-label">
									<input v-model="prov.query" required class="full-width">
									<label>query Name</label>
								</div>
							</div>
						</div>				
						<div class="item three-lines">
							<i class="item-primary">unarchive</i>
							<div class="item-content">
								<div class="floating-label">
									<input v-model="prov.querySize" required class="full-width">
									<label>query Size</label>
								</div>
							</div>
						</div>	
						<div class="item three-lines">
							<i class="item-primary">attachment</i>
							<div class="item-content">
								<div class="floating-label">
									<input v-model="prov.queryDate" required class="full-width">
									<label>query Date</label>
								</div>
							</div>
						</div>	
					</div>
				</div>
				<div>
					<div class="row group">
						<button class="primary auto" @click="saveEdit()">Guardar</button>
						<button class="tertiary auto" @click="close()">Cancelar</button>
					</div>
				</div>       
			</div>
		</div>
	</div>
</quasar-layout>
</template>
<script>
import FtpFile from '../services/ftpfiles'
export default {
  data () {
    return {
      prov: {
        name: '',
        dirscan: '',
        uri: '',
        thread: 2,
        type: 'ftp',
        port: 21,
        query: '',
        queryDate: '',
        querySize: '',
        ignore: '',
        password: '',
        user: ''
      }
    }
  },
  methods: {
    saveEdit () {
      FtpFile.addFtp(this, this.prov).then(function (response) {
        window.prov = null
        this.close()
      }, function (response) {
        console.log('error', response)
      })
    }
  },
  created () {
    if (window.prov) {
      this.prov = JSON.parse(JSON.stringify(window.prov))
    }
  }
}

</script>

<template>
  <div>
    <div class="section">
      <div class="row group">
        <div class="auto">
         <ul class="breadcrumb" v-if="!modefilter">     
          <li @click="MoveTo(-1)">
            <a>
              <i>subdirectory_arrow_left</i>
            </a>
          </li>
          <li v-for="dir in breadcrumb">
            <a>
              <quasar-popover v-ref:pov position="bottom right" v-if="$index < breadcrumb.length - 1" @click="OpenSubFolders($index)">
              <i slot="target">
                flag
              </i>
              <div class="list">
                <div class="item item-link" v-for="subf in subfloders" @click="linkFolder(subf)">
                  <div class="item-content">{{ subf.name | decodeURIComponent}}</div>
                </div>
              </div>
            </quasar-popover> <label @click="MoveTo($index)">{{dir|decodeURIComponent}}{{[$index===0?'home':'']}}</label>
          </a>
        </li>
      </ul>
      <div class="row group" v-if="modefilter">
       <quasar-search :placeholder="'nombre'" :model.sync="filter.name" class="primary" : @keyup="linkFilter() | debounce 300"></quasar-search>
       <quasar-search  :icon="'sim_card'" :placeholder="'extname'" :model.sync="filter.extname" class="secundary" @keyup="linkFilter() | debounce 300"></quasar-search>
     </div>
   </div>
   <button class="tertiary circular" @click="filterActive()">
     <a>
      <i>{{ [modefilter?'folder_shared':'search'] }}</i>
    </a>
  </button>
</div>  
</div>
<quasar-tabs class="inverted primary">
<quasar-tab icon="mail" v-for="tab in tabs"  :target="targetTab($index)" v-link="{path: '/'+ tab._id+'/'+(tab.filter.active?'filter':'explorer')+'/'+(tab.filter.active?tab.filter.parms:tab.dirscan)}">
{{tab.name}}
</quasar-tab>
</quasar-tabs>
<div v-for="tab in tabs" id="{{ 'tab-' + $index }}" class="tab">
  <div class="tab-pane">
    <div v-if="viewMode==='view_module'" style="overflow: auto;height: 67vh;">
      <table class="quasar-table highlight bordered row-delimiter" style="width: 100%;">
        <thead>
          <tr>
            <th @click="sortedFiles('name', tab)">Name <i class="on-right" style="float: right;" v-show="tab.sortKey==='name'">{{ [tab.sort.name === 1 ? 'arrow_upward' : 'arrow_downward'] }}</i> </th>
            <th style="width: 10%;" @click="sortedFiles('size', tab)">Size <i class="on-right" style="float: right;" v-show="tab.sortKey==='size'">{{ [tab.sort.size === 1 ? 'arrow_upward' : 'arrow_downward'] }}</i> </th>
            <th style="width: 20%;" @click="sortedFiles('time', tab)">Time <i class="on-right" style="float: right;" v-show="tab.sortKey==='time'">{{ [tab.sort.time === 1 ? 'arrow_upward' : 'arrow_downward'] }}</i> </th></th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="file in tab.files | orderBy tab.sortKey tab.sort[tab.sortKey]" @click="linkFolder(file)">
            <td class="text-left"><div class="row group"><h5><i class="on-right">{{ typeFileIcon(file) }}</i></h5><label >{{ file.name | decodeURIComponent}}</label></div></td>
            <td class="text-right">{{ file.size | fileSizeConvert}}</td>
            <td class="text-right">{{ file.time | dateform 'MMMM Do YYYY, h:mm:ss a'}}</td>
          </tr>
        </tbody>
      </table>
    </div>
    <div class="row group wrap justify-stretch content-center text-center" v-else>
        <div v-for="file in tab.files" class="card ngfolder" style="max-width: 10%;text-align:center" @click="linkFolder(file)">
          <h4><i>{{ typeFileIcon(file) }}</i></h4>
          <div class="card-actions">
            <div class="item-content inset has-secondary">
              <div>{{ file.name | decodeURIComponent}}</div>
            </div>
          </div>
        </div>
    </div>
  </div>
</div>
<quasar-fab class="absolute-bottom-right" type="primary" direction="up">
<quasar-small-fab label="first" class="tertiary" @click="deleteTab">close</quasar-small-fab>
<quasar-small-fab label="second" class="secondary" @click="changeViewMode()">{{ viewMode }}</quasar-small-fab>
</quasar-fab>
</template>

<script>
import FtpFile from '../services/ftpfiles'
import Moment from 'moment'
import Store from '../services/lstorage'
import { userView, ftpFilters, ftpSelect, setModeFilter } from '../vuex/actions'
import { getUserView, getFtpsFilters, getFtpSelect, getModeFilter, getFtpsList } from '../vuex/getters'
window.reloadTab = false
export default {
  route: {
    data (transition) {
      var mode = this.$route.params.mode === 'explorer'
      this.setModeFilter(!mode)
      this.addTab(this.$route.params)
    }
  },
  data () {
    return {
      viewMode: Store.get('modeView', 'view_module'),
      tabs: [],
      postTab: 0,
      modeTable: true,
      breadcrumb: [],
      subfloders: [],
      popovers: [],
      filter: {
        name: '',
        extname: ''
      }
    }
  },
  vuex: {
    actions: {
      userView,
      ftpFilters,
      ftpSelect,
      setModeFilter
    },
    getters: {
      user: getUserView,
      modefilter: getModeFilter,
      tabActive: getFtpSelect,
      ftpsselect: getFtpsFilters,
      ftpsList: getFtpsList
    }
  },
  filters: {
    decodeURIComponent (some) {
      var name = some
      try {
        name = decodeURIComponent(name)
      }
      catch (e) {
        console.log(e)
      }
      return name
    },
    fileSizeConvert (size) {
      var retorn = parseFloat(size / 1024 / 1024).toFixed(2)
      var s = ' MB'
      if (retorn >= 1024) {
      // convertir a gigas
        retorn = parseFloat(retorn / 1024).toFixed(2)
        s = 'GB'
      }
      return retorn === 'NaN' ? 'none' : retorn + s
    },
    dateform (date, format) {
      return Moment(parseInt(date)).format(format)
    }
  },
  methods: {
    changeViewMode () {
      this.viewMode = this.viewMode === 'view_module' ? 'view_column' : 'view_module'
      Store.set('modeView', this.viewMode)
    },
    getSizeFolder (node) {
      FtpFile.getSizeFolder(this, node).then(function (response) {
        console.log(response.data)
      }, function (response) {
        console.log('error', response)
      })
    },
    deleteTab () {
      var post = this.foundTab(this.tabActive)
      this.removeTab(post)
      if (this.tabs.length === 0) {
        this.$route.router.go('/')
      }
      else {
        window.reloadTab = true
        var parms = ''
        if (this.tabs[this.tabs.length - 1].filter.active) {
          parms = JSON.parse(this.tabs[this.tabs.length - 1].filter.parms)
          parms.ftps = this.ftpsselect
          parms = JSON.stringify(parms)
        }
        this.$route.router.go('/' + this.tabs[this.tabs.length - 1]._id + '/' + (this.tabs[this.tabs.length - 1].filter.active ? 'filter' : 'explorer') + '/' + (this.tabs[this.tabs.length - 1].filter.active ? parms : (this.tabs[this.tabs.length - 1].dirscan === '/' ? 'home' : this.tabs[this.tabs.length - 1].dirscan)))
      }
    },
    sortedFiles (key, tab) {
      tab.sortKey = key
      tab.sort[key] = tab.sort[key] * -1
    },
    targetTab (some) {
      return '#tab-' + some
    },
    foundTab (tab) {
      for (var i in this.tabs) {
        if (this.tabs[i]._id === tab) {
          return i
        }
      }
      return false
    },
    removeTab (index) {
      this.tabs.splice(index, 1)
    },
    getFtp (id) {
      return new Promise(function (resolve, reject) {
        var findFTP = (array) => {
          for (var i in array) {
            if (array[i]._id === id) {
              resolve(array[i])
            }
          }
          resolve(false)
        }
        if (this.ftpsList.length === 0) {
          FtpFile.get(this).then(function (response) {
            findFTP(response.data)
          }, function (response) {
            console.log('error', response)
            reject(response)
          })
        }
        else {
          findFTP(this.ftpsList)
        }
      }.bind(this))
    },
    addTab (params) {
      this.ftpSelect(params.idProve)
      var post = this.foundTab(params.idProve)
      if (!post) {
        this.getFtp(params.idProve).then(function (ftp) {
          if (ftp) {
            var newtab = {
              _id: ftp._id,
              name: ftp.name,
              uri: ftp.uri,
              dirscan: ftp.dirscan === '/' ? 'home' : ftp.dirscan,
              files: [],
              type: ftp.type,
              filter: {
                active: params.mode === 'filter',
                parms: params.mode === 'filter' ? params.dir : ''
              },
              sort: {
                name: 1,
                size: 1,
                time: 1
              },
              sortKey: 'name'
            }
            this.tabs.push(newtab)
            this.postTab = this.tabs.length - 1
            if (params.mode === 'explorer') {
              this.findFolder(newtab)
            }
            else {
              this.filterFileFolder(JSON.parse(params.dir))
            }
          }
        }.bind(this))
      }
      else {
        this.postTab = post
        if (params.mode === 'explorer') {
          if (this.tabs[post].dirscan !== params.dir) {
            this.tabs[post].dirscan = params.dir
            window.reloadTab = true
          }
          if (window.reloadTab) {
            this.findFolder(this.tabs[post])
            window.reloadTab = false
          }
        }
        else {
          var parms = JSON.parse(params.dir)
          this.filterFileFolder(parms)
        }
      }
    },
    linkFolder (node) {
      if (this.isFile(node)) {
        this.OpenInNewTab(node)
        return
      }
      var dir = node.directory
      var join = '/'
      if (dir === '/') {
        join = ''
      }
      this.getSizeFolder(node)
      dir = dir + join + node.name
      this.$route.router.go('/' + node.ftp + '/explorer' + dir)
    },
    findFolder (node) {
      var dir = '/'
      if (node.dirscan) {
        dir += node.dirscan
        if (dir === '/home') {
          dir = '/'
        }
      }
      // este tab se cogio para buscar
      var parms = {'directory': dir, 'ftp': this.tabActive}
      this.loadFolder(parms)
    },
    loadFolder (parms) {
      FtpFile.loadFolder(this, parms).then(function (response) {
        this.tabs[this.postTab].files = response.data
        this.tabs[this.postTab].directory = parms.directory
        Store.set('tabsNav', this.tabs)
        this.UpdatePath(parms.directory)
      }, function (response) {
        console.log('error', response)
      })
    },
    MoveTo (index) {
      if (index !== -1) {
        if ((index !== this.breadcrumb.length - 1)) {
          index = index + 1 - this.breadcrumb.length
          this.breadcrumb = this.breadcrumb.slice(0, index)
        }
      }
      else {
        this.breadcrumb = this.breadcrumb.slice(0, index)
      }
      var dir = this.breadcrumb.join('/')
      if (dir === '') {
        dir = '/home'
      }
      this.$route.router.go('/' + this.tabActive + '/' + (this.modefilter ? 'filter' : 'explorer') + dir)
    },
    OpenSubFolders (index) {
      var dir = ''
      if (index !== this.breadcrumb.length - 1) {
        var post = index + 1 - this.breadcrumb.length
        dir = this.breadcrumb.slice(0, post)
      }
      dir = dir.join('/')
      if (dir === '') {
        dir = '/'
      }
      var parms = {'directory': dir, 'ftp': this.tabActive}
      FtpFile.loadFolder(this, parms).then(function (response) {
        this.subfloders = []
        for (var i in response.data) {
          if (!this.isFile(response.data[i])) {
            this.subfloders.push(response.data[i])
          }
        }
      }, function (response) {
        console.log('error', response)
      })
    },
    isFile (node) {
      return node.extname
    },
    typeFileIcon (file) {
      var images = ['.jpg', '.jpej', '.gif', '.png']
      var media = ['.mp4', '.mpg', '.avi', '.webm', '.wmv', '.mkv', 'mov', 'vob']
      if (!file.extname) {
        return 'folder'
      }
      if (images.indexOf(file.extname.toLowerCase()) !== -1) {
        return 'photo'
      }
      if (media.indexOf(file.extname.toLowerCase()) !== -1) {
        return 'movie'
      }
      return 'attachment'
    },
    OpenInNewTab (node) {
      this.getFtp(node.ftp).then(function (ftp) {
        var url = ftp.type === 'ftp' ? 'ftp://' : ''
        var win = window.open(url + ftp.uri + node.directory + '/' + node.name, '_blank')
        win.focus()
      })
    },
    UpdatePath (dir) {
      if (dir === '/') {
        dir = ['']
      }
      else {
        if (dir.split) {
          dir = dir.split('/')
        }
      }
      this.$set('breadcrumb', dir)
    },
    filterActive () {
      this.setModeFilter(!this.modefilter)
      // poner tab actual en modo de busqueda
      this.tabs[this.postTab].filter.active = this.modefilter
      if (this.modefilter) {
        this.linkFilter(this.postTab)
      }
      else {
        window.reloadTab = true
        this.$route.router.go('/' + this.tabActive + '/explorer/' + (this.tabs[this.postTab].dirscan === '/' ? 'home' : this.tabs[this.postTab].dirscan))
      }
    },
    linkFilter (postTab) {
      var parms = {
        type: 'file',
        ftps: this.ftpsselect,
        name: this.filter.name,
        extname: this.filter.extname
      }
      parms = JSON.stringify(parms)
      this.tabs[postTab || this.postTab].filter.parms = parms
      this.$route.router.go('/' + this.tabActive + '/filter/' + parms)
    },
    filterFileFolder (parms) {
      FtpFile.loadFolder(this, parms).then(function (response) {
        this.tabs[this.postTab].files = response.data
      }, function (response) {
        console.log('error', response)
      })
    }
  },
  watch: {
    'tabs' (newVal, oldVal) {
      Store.set('tabsNav', newVal)
    },
    'modefilter' (newVal, oldVal) {
      // var parms = JSON.parse(this.$route.params.dir)
      // this.filter.name = parms.name
      // this.filter.extname = parms.extname
    }
  },
  created () {
    // cargar tab por defecto por url
    this.tabs = Store.get('tabsNav', [])
    window.reloadTab = true
    if (this.$route.params.mode === 'filter') {
      console.log('cargando en modo filterrrrrrrrr')
      var parms = JSON.parse(this.$route.params.dir)
      this.filter.name = parms.name
      this.filter.extname = parms.extname
    }
  }
}
</script>

<style scoped>
div.tab {
  margin-top: 20px;
}
.ngfolder:hover{
      background: #8CAAC3;
}
</style>
import {} from '../mutation-types'
const state = {
  ftpsselect: [],
  ftpselect: '',
  modefilter: false,
  ftpslist: []
}
const mutations = {
  FTPSLIST (state, newState) {
    state.ftpslist = newState
  },
  SELECTFTPFILTER (state, newState) {
    state.ftpsselect = newState
  },
  SELECTFTP (state, newState) {
    state.ftpselect = newState
  },
  SETMODEFILTER (state, newState) {
    state.modefilter = newState
  },
  ADDFILTERFTP (state, newFTP) {
    state.ftpsselect.push(newFTP)
  },
  DELETEFILTERFTP (state, post) {
    state.ftpsselect.splice(post, 1)
  }
}

export default {
  state,
  mutations
}

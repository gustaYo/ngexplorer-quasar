import {} from '../mutation-types'
const state = {
  user: {}
}
const mutations = {
  CHANGEUSER (state, newState) {
    state.user = newState
  }
}

export default {
  state,
  mutations
}

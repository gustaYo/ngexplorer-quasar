import Storage from './lstorage'
export default {
  authenticate (ctx, data) {
    return ctx.$http.post(Storage.get('serverDir') + '/user/authenticate', data)
  },
  signin (ctx, data) {
    if (data._id) {
      return ctx.$http.put(Storage.get('serverDir') + '/user/signin', data)
    }
    return ctx.$http.post(Storage.get('serverDir') + '/user/signin', data)
  },
  get (ctx, data) {
    return ctx.$http.get(Storage.get('serverDir') + '/user', data)
  },
  userVisit (ctx, data) {
    return ctx.$http.post(Storage.get('serverDir') + '/user/counter', data)
  },
  user: null,
  getUser () {
    return Storage.get('user')
  },
  setUser (newUser) {
    this.user = Storage.set('user', newUser)
  },
  logout () {
    Storage.clearLocal(true)
    this.user = null
  },
  init () {
    this.user = Storage.get('user')
  },
  user_acces (perm = 'authenticate') {
    var user = this.getUser()
    if (user && perm !== 'authenticate') {
      if (user.role) {
        return user.role === perm
      }
    }
    if (perm === 'authenticate') {
      if (user) {
        return true
      }
    }
    return false
  }
}

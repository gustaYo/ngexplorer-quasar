import Storage from './lstorage'
export default {
  add (ctx, data) {
    if (data._id) {
      return ctx.$http.put(Storage.get('serverDir') + '/reserva', data)
    }
    return ctx.$http.post(Storage.get('serverDir') + '/reserva', data)
  },
  get (ctx, data) {
    return ctx.$http.get(Storage.get('serverDir') + '/reserva', data)
  },
  del (ctx, data) {
    return ctx.$http.delete(Storage.get('serverDir') + '/reserva/api/' + data)
  }
}

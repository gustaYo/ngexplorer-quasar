import Storage from './lstorage'
export default {
  urlGetParms (data) {
    var parms = '?'
    for (var key in data) {
      parms += (parms === '?' ? '' : '&') + key + '=' + data[key]
    }
    return parms
  },
  get (ctx) {
    return ctx.$http.get(Storage.get('serverDir') + '/ftp/api/list')
  },
  deleteprov (ctx, data) {
    return ctx.$http.delete(Storage.get('serverDir') + '/ftp/api/' + data)
  },
  loadFolder (ctx, data) {
    return ctx.$http.post(Storage.get('serverDir') + '/ftp/files', data)
  },
  addFtp (ctx, data) {
    return ctx.$http.post(Storage.get('serverDir') + '/ftp/api', data)
  },
  scannerFtp (ctx, data) {
    return ctx.$http.put(Storage.get('serverDir') + '/ftp/api', data)
  },
  countFtpsFiles (ctx, data) {
    return ctx.$http.post(Storage.get('serverDir') + '/ftp/filescount', data)
  },
  sincronizeServerProve (ctx, dirRemote, data) {
    var dir = dirRemote + '/ftp/files' + this.urlGetParms(data)
    return ctx.$http.get(dir)
  },
  getSizeFolder (ctx, data) {
    return ctx.$http.get(Storage.get('serverDir') + '/ftp/filescount' + this.urlGetParms(data))
  },
  addFileToServerProve (ctx, data) {
    return ctx.$http.put(Storage.get('serverDir') + '/ftp/filescount', data)
  }
}

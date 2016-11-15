export const userView = makeAction('CHANGEUSER')
export const ftpFilters = makeAction('SELECTFTPFILTER')
export const ftpSelect = makeAction('SELECTFTP')
export const setModeFilter = makeAction('SETMODEFILTER')
export const addFtpToFilter = makeAction('ADDFILTERFTP')
export const deleteFtpToFilter = makeAction('DELETEFILTERFTP')
export const setFtpsList = makeAction('FTPSLIST')
function makeAction (type) {
  return ({ dispatch }, ...args) => dispatch(type, ...args)
}

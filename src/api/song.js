import { axiosRequest } from 'common/js/axiosRequest'
import { ERR_OK } from '@/api/config'

export function getSongUrl (mids) {
  let url = '/singer'
  let songmid = parseMids(mids)
  const module = 'vkey.GetVkeyServer'
  const method = 'CgiGetVkey'
  const param = {
    guid: (Math.random() + '').replace('0.', '').substring(0, 9),
    songmid: `["${songmid}"]`,
    songtype: '[0]',
    uin: 0,
    loginflag: 1,
    platfrom: '20'
  }

  return axiosRequest('get', url, module, method, param).then((res) => {
    if (res.code === ERR_OK) {
      let request = res.request
      if (request.code === ERR_OK) {
        let midurlinfo = request.data.midurlinfo
        return Promise.resolve(midurlinfo)
      }
    }
  })
}

function parseMids (mids) {
  let ret = ''
  for (let k in mids) {
    ret += `"${mids[k]}",`
  }
  return ret.substr(1, ret.length - 3)
}

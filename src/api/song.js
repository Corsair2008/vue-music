import { axiosRequest } from 'common/js/axiosRequest'
import axios from 'axios'
import { ERR_OK, commonParams } from '@/api/config'

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

export function getJayLyric (id) {
  const url = '/miguWeb/lyric'
  const params = {
    copyrightId: id
  }
  return axios.get(url, {
    params
  }).then((res) => {
    if (res.status === 200) {
      return Promise.resolve(res.data)
    } else {
      return Promise.reject(new Error('http status err.'))
    }
  })
}

export function getLyric (mid) {
  let url = '/recommend/getLyric'
  let params = Object.assign({}, commonParams, {
    songmid: mid
  })

  return axios.get(url, {
    params: params
  }).then((res) => {
    if (res.status === 200) {
      var data = res.data
      var reg = /^\w+\(({[^()]+})\)$/
      var matches = data.match(reg)
      if (matches) {
        data = matches[1]
        return Promise.resolve(JSON.parse(data))
      }
    }
    return Promise.reject(new Error('responding status err'))
  })
}

function parseMids (mids) {
  let ret = ''
  for (let k in mids) {
    ret += `"${mids[k]}",`
  }
  return ret.substr(1, ret.length - 3)
}

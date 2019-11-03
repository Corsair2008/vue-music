import { axiosRequest } from 'common/js/axiosRequest'
import axios from 'axios'
import { ERR_OK, commonParams } from './config'

export function getHotkey () {
  const url = '/singer'
  const module = 'tencent_musicsoso_hotkey.HotkeyService'
  const method = 'GetHotkeyForQQMusicMobile'
  const param = {
    remoteplace: 'txt.mqq.all',
    searchid: '0'
  }

  return axiosRequest('get', url, module, method, param).then((res) => {
    if (res.code === ERR_OK && res.request && res.request.code === ERR_OK) {
      return Promise.resolve(res.request.data)
    }
  })
}

export function getSuggest (query, page) {
  const url = '/recommend/getSuggest'
  const params = Object.assign({}, commonParams, {
    w: query,
    zhidaqu: 1,
    catZhida: 1,
    t: 0,
    flag: 1,
    ie: 'utf-8',
    sem: 1,
    aggr: 0,
    perpage: 20,
    n: 20 * page,
    p: page,
    remoteplace: 'txt.mqq.all'
  })

  return axios.get(url, { params }).then((res) => {
    if (res.status === 200) {
      const data = res.data
      if (data && data.code === ERR_OK && data.data) {
        return Promise.resolve(data.data)
      } else {
        return Promise.reject(new Error('request data format err'))
      }
    } else {
      return Promise.reject(new Error('http server err.'))
    }
  })
}

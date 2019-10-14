import jsonp from 'common/js/jsonp'
import { commonParams, opt, ERR_OK } from './config'
import { axiosRequest } from 'common/js/axiosRequest'

export function getSingerList () {
  const url = 'https://c.y.qq.com/v8/fcg-bin/v8.fcg'

  const data = Object.assign({}, commonParams, {
    channel: 'singer',
    page: 'list',
    key: 'all_all_all',
    pagesize: 100,
    pagenum: 1,
    hostUin: 0,
    needNewCode: 0,
    platform: 'yqq'
  })

  return jsonp(url, data, opt)
}

export function getSongList (singermid) {
  const url = '/singer'
  const module = 'musichall.song_list_server'
  const method = 'GetSingerSongList'
  const param = {
    singermid: singermid,
    begin: 0,
    num: 15,
    order: 1
  }

  return axiosRequest('post', url, module, method, param).then((res) => {
    if (res.code === ERR_OK && res.request && res.request.code === ERR_OK) {
      return Promise.resolve(res.request.data)
    }
  })
}

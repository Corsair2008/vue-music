import jsonp from 'common/js/jsonp'
import { commonParams, opt, ERR_OK } from './config'
import axios from 'axios'

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

export function getSongList (singerMid) {
  const url = '/singer/songList'

  const data = {
    singerSongList: {
      method: 'GetSingerSongList',
      param: {
        singerMid: singerMid,
        begin: 0,
        num: 15,
        order: 1
      },
      module: 'musichall.song_list_server'
    }
  }

  return axios.post(url, data).then((res) => {
    let data = res.data
    if (data.code === ERR_OK && data.singerSongList) {
      return Promise.resolve(data.singerSongList)
    }
  })
}

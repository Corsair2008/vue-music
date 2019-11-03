import jsonp from 'common/js/jsonp'
import { commonParams, opt, ERR_OK } from './config'
import { createSong } from 'common/js/song'
import { getSongUrl } from '@/api/song'
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
    num: 120,
    order: 1
  }

  return axiosRequest('post', url, module, method, param).then((res) => {
    if (res.code === ERR_OK && res.request && res.request.code === ERR_OK) {
      return Promise.resolve(res.request.data)
    }
  })
}

export function normalizeSonglist (id) {
  return getSongList(id).then((res) => {
    let mids = []
    let originSongList = res.songList
    originSongList.forEach((song) => {
      let mid = song.songInfo.mid
      mids.push(mid)
    })
    return Promise.resolve({ mids, originSongList })
  }).then(({ mids, originSongList }) => {
    return getSongUrl(mids).then((urls) => {
      let ret = []
      for (let i = 0; i < originSongList.length; i++) {
        let url = urls[i]
        if (url && url.purl) {
          let songUrl = `http://ws.stream.qqmusic.qq.com/${url.purl}`
          ret.push(createSong(originSongList[i].songInfo, songUrl))
        }
      }
      return Promise.resolve(ret)
    })
  })
}

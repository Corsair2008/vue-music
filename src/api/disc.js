
import axios from 'axios'
import { getSongUrl } from '@/api/song'
import { createDiscSong } from 'common/js/song'
import { commonParams, ERR_OK } from '@/api/config'

function getDiscSongs (disstid) {
  const url = '/recommend/getSongList'

  const data = Object.assign({}, commonParams, {
    disstid,
    type: 1,
    json: 1,
    utf8: 1,
    onlysong: 1,
    platform: 'yqq.json'
  })

  return axios.get(url, {
    params: data
  }).then((res) => {
    if (res.status === 200) {
      return Promise.resolve(res.data)
    } else {
      return Promise.reject(new Error('http status err'))
    }
  })
}

export function normalizeDisclist (id) {
  return getDiscSongs(id).then((res) => {
    let originSonglist = []
    let mids = []
    if (res.code === ERR_OK) {
      originSonglist = res.songlist
      originSonglist.forEach((song) => {
        let mid = song.songmid
        mids.push(mid)
      })
      return Promise.resolve({ mids, originSonglist })
    }
    return Promise.reject(new Error('unable to get qqmusic data'))
  }).then(({ mids, originSonglist }) => {
    return getSongUrl(mids).then((urls) => {
      let ret = []
      for (let i = 0; i < originSonglist.length; i++) {
        let url = urls[i]
        if (url && url.purl) {
          let songUrl = `http://ws.stream.qqmusic.qq.com/${url.purl}`
          ret.push(createDiscSong(originSonglist[i], songUrl))
        }
      }
      return Promise.resolve(ret)
    })
  })
}

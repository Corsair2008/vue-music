
import axios from 'axios'
import { getSongUrl } from '@/api/song'
import { createDiscSong } from 'common/js/song'
import { commonParams, ERR_OK } from '@/api/config'

function getDiscSongs (disstid, onlysong) {
  const url = '/recommend/getSongList'

  const data = Object.assign({}, commonParams, {
    disstid,
    onlysong,
    type: 1,
    json: 1,
    utf8: 1,
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
  return getDiscSongs(id, 0).then((res) => {
    if (res.code === ERR_OK && res.cdlist && res.cdlist.length > 0) {
      const cdData = res.cdlist[0]
      const bgImage = cdData.logo
      const dissname = cdData.dissname
      let originSonglist = []
      let mids = []
      originSonglist = cdData.songlist
      originSonglist.forEach((song) => {
        let mid = song.songmid
        mids.push(mid)
      })
      return Promise.resolve({ mids, originSonglist, bgImage, dissname })
    } else {
      return Promise(new Error('cd not exist.'))
    }
  }).then(({ mids, originSonglist, bgImage, dissname }) => {
    return getSongUrl(mids).then((urls) => {
      let ret = {
        dissname,
        bgImage,
        songlist: []
      }
      for (let i = 0; i < originSonglist.length; i++) {
        let url = urls[i]
        if (url && url.purl) {
          let songUrl = `http://ws.stream.qqmusic.qq.com/${url.purl}`
          ret.songlist.push(createDiscSong(originSonglist[i], songUrl))
        }
      }
      return Promise.resolve(ret)
    })
  })
}

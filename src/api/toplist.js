import { axiosRequest } from 'common/js/axiosRequest'
import { ERR_OK } from '@/api/config'
import { getSongUrl } from '@/api/song'
import { createSong } from '@/common/js/song'

export function getToplist (topId, period) {
  const url = '/singer'
  const module = 'musicToplist.ToplistInfoServer'
  const method = topId ? 'GetDetail' : 'GetAll'
  let param = {}

  if (topId) {
    param = {
      topId,
      offset: 0,
      num: 100,
      period
    }
  }

  return axiosRequest('post', url, module, method, param).then((res) => {
    if (res.code === ERR_OK) {
      const data = res.request
      if (data && data.code === ERR_OK) {
        return Promise.resolve(data.data)
      }
    }
    return Promise.reject(new Error('http status err.'))
  })
}

export function normalizeToplist (topId, period) {
  return getToplist(topId, period).then((res) => {
    let mids = []
    let originSongList = []
    if (res.songInfoList) {
      originSongList = res.songInfoList
      originSongList.forEach((song) => {
        let mid = song.mid
        mids.push(mid)
      })
      return Promise.resolve({mids, originSongList})
    }
    return Promise.reject(new Error('have no songList'))
  }).then(({mids, originSongList}) => {
    return getSongUrl(mids).then((urls) => {
      let ret = []
      for (let i = 0; i < originSongList.length; i++) {
        let url = urls[i]
        if (url && url.purl) {
          let songUrl = `http://ws.stream.qqmusic.qq.com/${url.purl}`
          ret.push(createSong(originSongList[i], songUrl))
        }
      }
      return Promise.resolve(ret)
    })
  })
}

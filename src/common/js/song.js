import { axiosRequest } from 'common/js/axiosRequest'
import { ERR_OK } from '@/api/config'

export default class Song {
  constructor ({id, mid, singer, name, album, duration, image, url}) {
    this.id = id
    this.mid = mid
    this.singer = singer
    this.name = name
    this.album = album
    this.duration = duration
    this.image = image
    this.url = url
  }
}

export function createSong (songInfo) {
  return new Song({
    id: songInfo.id,
    mid: songInfo.mid,
    singer: filterSinger(songInfo.singer),
    name: songInfo.name,
    album: songInfo.album.name,
    duration: songInfo.interval,
    image: `http://y.gtimg.cn/music/photo_new/T002R300x300M000${songInfo.album.mid}.jpg?max_age=2592000`
  })
}

function filterSinger (singer) {
  if (!singer) {
    return ''
  }
  let ret = []
  singer.forEach(s => {
    ret.push(s.name)
  })
  return ret.join('/')
}

export function filterSongUrl (songmid) {
  getSongUrl(songmid).then((res) => {
    if (res.code === ERR_OK) {
      let midurlinfo = res.data.midurlinfo[0]
      if (midurlinfo && midurlinfo.purl) {
        let url = `http://ws.stream.qqmusic.qq.com/${midurlinfo.purl}`
        return Promise.resolve(url)
      }
    }
  })
}

function getSongUrl (songmid) {
  let url = '/singer'
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
      return Promise.resolve(res.request)
    }
  })
}

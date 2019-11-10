import jsonp from 'common/js/jsonp'
import axios from 'axios'
import { commonParams, opt, ERR_OK } from './config'
import { createSong, createJaySong } from 'common/js/song'
import { getSongUrl } from '@/api/song'
import { getJaySonglist, JAY } from '@/api/jay'
import { axiosRequest } from 'common/js/axiosRequest'

export function getSingerList (page) {
  const url = 'https://c.y.qq.com/v8/fcg-bin/v8.fcg'

  const data = Object.assign({}, commonParams, {
    channel: 'singer',
    page: 'list',
    key: 'all_all_all',
    pagesize: 100,
    pagenum: page || 1,
    hostUin: 0,
    needNewCode: 0,
    platform: 'yqq'
  })

  return jsonp(url, data, opt)
}

export function getHotSingers () {
  const url = '/singer'
  const params = {
    data: {
      singerList: {
        module: 'Music.SingerListServer',
        method: 'get_singer_list',
        param: {
          area: -100,
          sex: -100,
          genre: -100,
          index: -100,
          sin: 0,
          cur_page: 1
        }
      }
    }
  }
  return axios.get(url, {
    params
  }).then((res) => {
    if (res.status === 200 && res.data.code === ERR_OK) {
      const data = res.data.singerList
      if (data.code === ERR_OK && data.data) {
        const singers = data.data.singerlist
        return Promise.resolve(singers)
      } else {
        return Promise.reject(new Error('require params err.'))
      }
    } else {
      return Promise.reject(new Error('http status err.'))
    }
  })
}

export function getSongList (singermid, page) {
  const url = '/singer'
  const module = 'musichall.song_list_server'
  const method = 'GetSingerSongList'
  const param = {
    singermid: singermid,
    begin: 20 * (page - 1),
    num: 20,
    order: 1
  }

  return axiosRequest('post', url, module, method, param).then((res) => {
    if (res.code === ERR_OK && res.request && res.request.code === ERR_OK) {
      return Promise.resolve(res.request.data)
    } else {
      return Promise.reject(new Error('http status err.'))
    }
  })
}

export function getSingerDetail (singermid) {
  const url = '/singer'
  const module = 'musichall.singer_info_server'
  const method = 'GetSingerDetail'
  const param = {
    singer_mids: [singermid],
    wiki_singer: 1
  }

  return axiosRequest('post', url, module, method, param).then((res) => {
    if (res.code === ERR_OK && res.request && res.request.code === ERR_OK) {
      return Promise.resolve(res.request.data)
    } else {
      return Promise.reject(new Error('http status err.'))
    }
  })
}

export function normalizeSonglist (id, page) {
  if (id === JAY.qqId) {
    return getJaySonglist(JAY.name, page).then((res) => {
      let ret = []
      let songlist = res.musics
      songlist.forEach((song) => {
        ret.push(createJaySong(song))
      })
      return Promise.resolve(ret)
    })
  } else {
    return getSongList(id, page).then((res) => {
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
}

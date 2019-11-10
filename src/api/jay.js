/* for JAY */
import axios from 'axios'

export const JAY = {
  qqId: '0025NhlN2yWrP4',
  name: '周杰伦'
}

export function getJaySongDetail (id) {
  const url = '/miguWeb/songs'
  const params = {
    type: 1,
    copyrightId: id
  }
  return axios.get(url, {
    params
  }).then((res) => {
    if (res.status === 200) {
      return Promise.resolve(res.data)
    } else {
      return Promise.reject(new Error('http status err'))
    }
  })
}

export function getJaySonglist (singer, page) {
  const url = '/miguMobile/songs'
  const params = {
    rows: 20,
    type: 2,
    keyword: encodeURIComponent(singer),
    pgc: page || 1
  }
  return axios.get(url, {
    params
  }).then((res) => {
    if (res.status === 200) {
      return Promise.resolve(res.data)
    } else {
      return Promise.reject(new Error('http status err'))
    }
  })
}

import axios from 'axios'
import { commonParams, ERR_OK } from './config'

export function getSingerList () {
  const url = '/getSingerList'

  const data = Object.assign({}, commonParams, {
    '-': 'getUCGI' + (Math.random() + '').replace('0.', ''),
    loginUin: 0,
    hostUin: 0,
    platform: 'yqq.json',
    needNewCode: 0,
    data: { 'comm': { 'ct': 24, 'cv': 0 }, 'singerList': { 'module': 'Music.SingerListServer', 'method': 'get_singer_list', 'param': { 'area': -100, 'sex': -100, 'genre': -100, 'index': -100, 'sin': 0, 'cur_page': 1 } } }
  })

  return axios.get(url, {
    params: data
  }).then((res) => {
    console.log(res)
    return new Promise((resolve, reject) => {
      if (res.data && res.data.code === ERR_OK && res.data.singerList && res.data.singerList.code === ERR_OK) {
        resolve(res.data.singerList.data)
      } else {
        reject(res)
      }
    })
  }).catch((res) => {
    console.log(res)
  })
}

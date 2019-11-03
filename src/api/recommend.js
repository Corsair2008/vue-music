import jsonp from '@/common/js/jsonp'
import { commonParams, opt } from '@/api/config'
import axios from 'axios'

export function getRecommend () {
  const url = 'https://c.y.qq.com/musichall/fcgi-bin/fcg_yqqhomepagerecommend.fcg'

  const data = Object.assign({}, commonParams, {
    platform: 'h5',
    uin: 0,
    needNewCode: 1
  })

  return jsonp(url, data, opt)
}

export function getDiscList () {
  const url = '/recommend/getDiscList'

  const data = Object.assign({}, commonParams, {
    picmid: 1,
    rnd: Math.random(),
    loginUin: 0,
    hostUin: 0,
    platform: 'yqq.json',
    needNewCode: 0,
    categoryId: 10000000,
    sortId: 5,
    sin: 0,
    ein: 49
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

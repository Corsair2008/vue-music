import axios from 'axios'
import { commonParams, obj2String } from '@/api/config'

export function axiosRequest (reqFunc, url, module, method, param) {
  const request = {
    module: module,
    method: method,
    param: param
  }
  const data = {
    request: request,
    comm: {
      uin: 0,
      format: 'json',
      ct: 24,
      cv: 0
    }
  }

  if (reqFunc === 'get') {
    const params = Object.assign({}, commonParams, {
      data: obj2String(data)
    })

    return axios.get(url, {
      params: params
    }).then((res) => {
      if (res.status === 200) {
        return Promise.resolve(res.data)
      }
    })
  } else if (reqFunc === 'post') {
    const params = Object.assign({}, commonParams, data)
    return axios.post(url, params).then((res) => {
      if (res.status === 200) {
        return Promise.resolve(res.data)
      }
    })
  }
}

import { axiosRequest } from 'common/js/axiosRequest'
import { ERR_OK } from '@/api/config'

export function getRank (topId, period) {
  const url = '/singer'
  const module = 'musicToplist.ToplistInfoServer'
  const method = topId ? 'GetDetail' : 'GetAll'
  let param = {}

  if (topId) {
    param = {
      topId,
      offset: 0,
      num: 50,
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

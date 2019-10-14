export const commonParams = {
  g_tk: 5381,
  inCharset: 'utf-8',
  outCharset: 'utf-8',
  notice: 0,
  format: 'json'
}

export const opt = {
  param: 'jsonpCallback'
}

export const ERR_OK = 0

export function obj2String (obj) {
  let ret = '{'
  for (let k in obj) {
    if (obj[k] instanceof Object) {
      let sub = obj2String(obj[k])
      if (sub) {
        ret += `"${k}":${sub},`
      }
    } else {
      let val = obj[k] + ''
      if (val.indexOf('[') !== -1 && val.indexOf(']') !== -1) {
        ret += `"${k}":${val},`
      } else {
        ret += `"${k}":"${val}",`
      }
    }
  }
  ret = ret.substring(0, ret.length - 1) + '}'
  return ret
}

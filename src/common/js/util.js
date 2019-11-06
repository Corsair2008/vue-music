function getRandom (min, max) {
  return Math.floor(Math.random() * (max - min + 1) + min)
}

export function shuffle (array) {
  let _arr = array.slice()
  for (let i = 0; i < _arr.length; i++) {
    let j = getRandom(0, i)
    let tmp = _arr[i]
    _arr[i] = _arr[j]
    _arr[j] = tmp
  }
  return _arr
}

export function padding (val, n = 2) {
  let len = val.toString().length
  while (len < n) {
    val = '0' + val
    len++
  }
  return val
}

export function debounce (func, delay) {
  let timer

  return function (...args) {
    if (timer) {
      clearTimeout(timer)
    }
    timer = setTimeout(() => {
      func.apply(this, args)
    }, delay)
  }
}

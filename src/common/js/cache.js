import store from 'common/js/store'

const SEARCH_KEY = '__search__'
const SEARCH_KEY_LEN = 15

const PLAY_KEY = '__play__'
const PLAY_KEY_LEN = 200

function insertArry (arr, val, compare, maxLen) {
  const index = arr.findIndex(compare)
  if (index === 0) {
    return
  }
  if (index > 0) {
    arr.splice(index, 1)
  }
  arr.unshift(val)
  if (maxLen && arr.length > maxLen) {
    arr.pop()
  }
}

function deleteFromArray (arr, compare) {
  const index = arr.findIndex(compare)
  if (index > -1) {
    arr.splice(index, 1)
  }
}

export function saveSearch (key) {
  let ret = store.get(SEARCH_KEY, [])
  insertArry(ret, key, (item) => {
    return key === item
  }, SEARCH_KEY_LEN)
  store.set(SEARCH_KEY, ret)
  return ret
}

export function loadSearch () {
  return store.get(SEARCH_KEY, [])
}

export function deleteSearch (key) {
  let ret = store.get(SEARCH_KEY, [])
  deleteFromArray(ret, (item) => {
    return item === key
  })
  store.set(SEARCH_KEY, ret)
  return ret
}

export function clearSearch () {
  store.clear()
  return []
}

export function loadPlay () {
  store.get(PLAY_KEY, [])
}

export function savePlay (song) {
  let songlist = store.get(PLAY_KEY, [])
  insertArry(songlist, song, (item) => {
    return song.id === item.id
  }, PLAY_KEY_LEN)
  store.set(PLAY_KEY, songlist)
  return songlist
}

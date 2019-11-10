import * as types from './mutation-types'
import { playMode } from 'common/js/config'
import { saveSearch, deleteSearch, clearSearch } from 'common/js/cache'
import { shuffle } from 'common/js/util'

function findIndex (list, song) {
  return list.findIndex((item) => {
    return item.id === song.id
  })
}

export const selectPlay = function ({commit, state}, {list, index}) {
  commit(types.SET_PLAYLIST, list)
  commit(types.SET_SEQUENCE_LIST, list)
  if (state.mode === playMode.random) {
    let randomList = shuffle(list)
    commit(types.SET_PLAYLIST, randomList)
    index = findIndex(randomList, list[index])
  } else {
    commit(types.SET_PLAYLIST, list)
  }
  commit(types.SET_CURRENT_INDEX, index)
  commit(types.SET_PLAYING_STATE, true)
  commit(types.SET_FULLSCREEN, true)
}

export const randomPlay = function ({commit}, {list}) {
  let randomList = shuffle(list)
  commit(types.SET_PLAYLIST, randomList)
  commit(types.SET_PLAYING_STATE, true)
  commit(types.SET_FULLSCREEN, true)
  commit(types.SET_CURRENT_INDEX, 0)
  commit(types.SET_MODE, playMode.random)
  commit(types.SET_SEQUENCE_LIST, list)
}

export const insertSong = function ({commit, state}, song) {
  let playlist = state.playlist.slice()
  let sequenceList = state.sequenceList.slice()
  let currentIndex = state.currentIndex
  let fpIndex = findIndex(playlist, song)
  if (fpIndex > -1) {
    if (fpIndex > currentIndex) {
      playlist.splice(fpIndex, 1)
      playlist.splice(currentIndex, 0, song)
    } else {
      playlist.splice(currentIndex + 1, 0, song)
      playlist.splice(fpIndex, 1)
    }
  } else {
    playlist.splice(++currentIndex, 0, song)
    sequenceList.splice(sequenceList.length, 0, song)
  }

  commit(types.SET_FULLSCREEN, true)
  commit(types.SET_PLAYING_STATE, true)
  commit(types.SET_CURRENT_INDEX, currentIndex)
  commit(types.SET_SEQUENCE_LIST, sequenceList)
  commit(types.SET_PLAYLIST, playlist)
}

export const saveSearchHistory = function ({commit}, query) {
  commit(types.SET_SEARCH_HISTORY, saveSearch(query))
}

export const deleteSearchHistory = function ({commit}, query) {
  commit(types.SET_SEARCH_HISTORY, deleteSearch(query))
}

export const clearSearchHistory = function ({ commit }, query) {
  commit(types.SET_SEARCH_HISTORY, clearSearch())
}

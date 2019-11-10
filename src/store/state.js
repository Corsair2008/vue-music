import { playMode } from 'common/js/config'
import { loadSearch } from 'common/js/cache'

const state = {
  fullscreen: false,
  playing: false,
  playlist: [],
  sequenceList: [],
  mode: playMode.sequence,
  currentIndex: -1,
  searchHistory: loadSearch()
}

export default state

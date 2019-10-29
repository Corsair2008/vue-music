import { playMode } from 'common/js/config'

const state = {
  singer: {},
  fullscreen: false,
  playing: false,
  playlist: [],
  sequenceList: [],
  mode: playMode.sequence,
  currentIndex: -1,
  disc: {}
}

export default state

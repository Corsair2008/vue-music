import { mapActions, mapGetters, mapMutations } from 'vuex'
import {playMode} from 'common/js/config'
import {shuffle} from 'common/js/util'

export const handleScrollMixin = {
  data () {
    return {
      scrollTop: -1,
      scrollHeight: 0,
      clientHeight: 0,
      scrollToEnd: false
    }
  },
  mounted () {
    window.addEventListener('scroll', this.getScrollTop)
  },
  activated () {
    window.addEventListener('scroll', this.getScrollTop)
  },
  deactivated () {
    window.removeEventListener('scroll', this.getScrollTop)
  },
  beforeDestroy () {
    window.removeEventListener('scroll', this.getScrollTop)
  },
  methods: {
    handleScroll () {
      // implement by client
    },
    handleScrollToEnd () {
      // implement by client
    },
    getScrollTop () {
      if (this.scrollTopTimer) {
        clearTimeout(this.scrollTopTimer)
      }
      this.scrollTopTimer = setTimeout(() => {
        let doc = document.documentElement
        let top
        let height
        let clientHeight
        if (doc) {
          top = doc.scrollTop
          height = doc.scrollHeight
          clientHeight = doc.clientHeight
        } else {
          top = document.body.scrollTop
          height = document.body.scrollHeight
          clientHeight = document.body.clientHeight
        }
        this.scrollTop = top
        this.scrollHeight = height
        this.clientHeight = clientHeight
      }, 5)
    },
    _scrollToEnd () {
      if (!this.scrollToEnd) {
        const curHeight = Math.ceil(this.scrollTop + this.clientHeight)
        if (curHeight >= Math.ceil(this.scrollHeight * 0.9)) {
          this.handleScrollToEnd()
          this.scrollToEnd = true
        }
      }
    }
  },
  watch: {
    scrollTop (newVal) {
      this.handleScroll(newVal)
      this._scrollToEnd()
    },
    scrollHeight () {
      this.scrollToEnd = false
    }
  }
}

export const searchMixin = {
  data () {
    return {
      query: ''
    }
  },
  methods: {
    getQuery (query) {
      this.query = query
    },
    saveQuery () {
      this.saveSearchHistory(this.query)
    },
    selectQuery (query) {
      this.$refs.searchBox.setQuery(query)
    },
    ...mapActions([
      'saveSearchHistory',
      'deleteSearchHistory',
      'clearSearchHistory'
    ])
  },
  computed: {
    ...mapGetters([
      'searchHistory'
    ])
  }
}

export const playerMixin = {
  computed: {
    iconMode () {
      return this.mode === playMode.sequence ? 'icon-sequence' : this.mode === playMode.loop ? 'icon-loop' : 'icon-random'
    },
    ...mapGetters([
      'sequenceList',
      'playlist',
      'currentSong',
      'mode',
      'currentIndex'
    ])
  },
  methods: {
    changeMode () {
      const mode = (this.mode + 1) % 3
      this.setPlayMode(mode)
      let list = []
      if (mode === playMode.random) {
        list = shuffle(this.sequenceList)
      } else {
        list = this.sequenceList
      }
      this.resetCurrentIndex(list)
      this.setPlaylist(list)
    },
    resetCurrentIndex (list) {
      let index = list.findIndex((item) => {
        return item.id === this.currentSong.id
      })
      this.setCurrentIndex(index)
    },
    ...mapMutations({
      setPlayMode: 'SET_MODE',
      setCurrentIndex: 'SET_CURRENT_INDEX',
      setPlaylist: 'SET_PLAYLIST',
      setPlayingState: 'SET_PLAYING_STATE'
    })
  }
}

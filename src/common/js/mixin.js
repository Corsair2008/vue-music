const CACHE_HEIGHT = 150

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
        if (curHeight >= this.scrollHeight - CACHE_HEIGHT) {
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

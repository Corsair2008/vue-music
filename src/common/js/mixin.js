export const handleScrollMixin = {
  data () {
    return {
      scrollTop: 0
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
      throw new Error('implement handleScroll function first.')
    },
    getScrollTop () {
      if (this.scrollTopTimer) {
        clearTimeout(this.scrollTopTimer)
      }
      this.scrollTopTimer = setTimeout(() => {
        let doc = document.documentElement
        let top
        if (doc && doc.scrollTop) {
          top = doc.scrollTop
        } else {
          top = document.body.scrollTop
        }
        this.scrollTop = top
      }, 5)
    }
  },
  watch: {
    scrollTop (newVal) {
      this.handleScroll(newVal)
    }
  }
}

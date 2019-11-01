<template>
<div class="m-header" ref="wrapper">
    <div class="title">
      <h1 class="text">Vue Music</h1>
    </div>
    <div class="tab">
      <router-link tag="div" class="tab-item" to="/recommend">
        <span class="tab-link">推荐</span>
      </router-link>
      <router-link tag="div" class="tab-item" to="/singer">
        <span class="tab-link">歌手</span>
      </router-link>
      <router-link tag="div" class="tab-item" to="/rank">
        <span class="tab-link">排行</span>
      </router-link>
      <router-link tag="div" class="tab-item" to="/search">
        <span class="tab-link">搜索</span>
      </router-link>
    </div>
  </div>
</div>
</template>

<script type="text/ecmascript-6">
import { prefixStyle } from 'common/js/dom'

const SCROLL_TOP = 44
const transform = prefixStyle('transform')

export default {
  name: 'Header',
  methods: {
    handleScroll () {
      if (this.timer) {
        clearTimeout(this.timer)
      }
      this.timer = setTimeout(() => {
        let doc = document.documentElement
        let top
        if (doc && doc.scrollTop) {
          top = doc.scrollTop | 0
        } else {
          top = document.body.scrollTop | 0
        }
        if (top < 0) {
          return
        } else {
          top = top > SCROLL_TOP ? SCROLL_TOP : top
        }
        this.$refs.wrapper.style[transform] = `translateY(${-top}px)`
      }, 10)
    }
  },
  mounted () {
    window.addEventListener('scroll', this.handleScroll)
  },
  beforeDestroy () {
    window.removeEventListener('scroll', this.handleScroll)
  }
}
</script>

<style scoped lang="stylus" rel="stylesheet/stylus">
  @import '~common/stylus/variable'
  @import '~common/stylus/mixin'
  .m-header
    position: fixed
    top: 0
    left: 0
    right: 0
    background: $color-background
    .title
      text-align: center
      color: $color-theme
      font-size: 0
      .text
        display: inline-block
        vertical-align: middle
        line-height: 44px
        font-size: $font-size-large
    .tab
      display: flex
      height: 44px
      line-height: 44px
      font-size: $font-size-medium
      .tab-item
        flex: 1
        text-align: center
        .tab-link
          padding-bottom: 5px
          color: $color-text-l
        &.router-link-active
          .tab-link
            color: $color-theme
            border-bottom: 2px solid $color-theme
</style>

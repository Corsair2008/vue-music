<template>
<div class="m-header" ref="wrapper">
  <div class="title">
    <h1 class="text">Vue Music</h1>
  </div>
  <div ref="tabWrapper" :class="tabCls">
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
import { handleScrollMixin } from 'common/js/mixin'

const SCROLL_TOP = 44

export default {
  name: 'Header',
  mixins: [handleScrollMixin],
  methods: {
    handleScroll (scrollTop) {
      this.scrollTop = scrollTop
    }
  },
  computed: {
    tabCls () {
      return this.scrollTop > SCROLL_TOP ? 'tab-fixed' : ''
    }
  }
}
</script>

<style scoped lang="stylus" rel="stylesheet/stylus">
  @import '~common/stylus/variable'
  @import '~common/stylus/mixin'
  .m-header
    position: absolute
    top: 0
    left: 0
    right: 0
    z-index: 10
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
    .tab-fixed
      position: fixed
      top: 0
      left: 0
      right: 0
      background: $color-background
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

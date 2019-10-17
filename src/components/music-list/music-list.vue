<template>
<div class="music-list">
  <div class="back" @click="back">
    <i class="icon-back"></i>
  </div>
  <h1 class="title" v-html="title"></h1>
  <div :style="bgStyle" ref="bgImage" class="bg-image" >
    <div class="filter"></div>
  </div>
  <scroll :data="songList" ref="list" class="list">
    <div class="song-list-wrapper">
      <song-list :song-list="songList"></song-list>
    </div>
  </scroll>
</div>
</template>

<script type="text/ecmascript-6">
import SongList from '@/components/song-list/song-list'
import Scroll from '@/base/scroll/scroll'
export default {
  name: 'MusicList',
  props: {
    songList: {
      type: Array,
      default: null
    },
    title: {
      type: String,
      default: ''
    },
    bgImage: {
      type: String,
      default: ''
    }
  },
  methods: {
    back () {
      this.$router.back()
    }
  },
  mounted () {
    this.$refs.list.$el.style.top = `${this.$refs.bgImage.clientHeight}px`
  },
  computed: {
    bgStyle () {
      return `background-image:url(${this.bgImage})`
    }
  },
  components: {
    Scroll,
    SongList
  }
}
</script>

<style scoped lang="stylus" rel="stylesheet/stylus">
  @import "~common/stylus/variable"
  @import "~common/stylus/mixin"

  .music-list
    position: fixed
    z-index: 100
    top: 0
    left: 0
    bottom: 0
    right: 0
    background: $color-background
    .back
      position: absolute
      top: 0
      left: 6px
      z-index: 50
      .icon-back
        display: block
        padding: 10px
        font-size: $font-size-large-x
        color: $color-theme
    .title
      position: absolute
      top: 0
      left: 10%
      z-index: 40
      width: 80%
      no-wrap()
      text-align: center
      line-height: 40px
      font-size: $font-size-large
      color: $color-text
    .bg-image
      position: relative
      width: 100%
      height: 0
      padding-top: 70%
      transform-origin: top
      background-size: cover
      .filter
        position: absolute
        top: 0
        left: 0
        width: 100%
        height: 100%
        background: rgba(7, 17, 27, 0.4)
    .list
      position: fixed
      top: 0
      bottom: 0
      width: 100%
      background: $color-background
      .song-list-wrapper
        padding: 20px 30px
</style>

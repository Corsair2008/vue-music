<template>
<div class="music-list" ref="musicList">
  <div class="back" @click="back">
    <i class="icon-back"></i>
  </div>
  <h1 class="title" v-html="title"></h1>
  <div :style="bgStyle" ref="bgImage" class="bg-image" >
  <div class="play-wrapper" v-show="songList && songList.length > 0" @click="play">
    <div class="play">
      <i class="icon-play"></i>
      <span class="text">随机播放全部</span>
    </div>
  </div>
    <div ref="filter" class="filter"></div>
  </div>
  <div ref="list" class="list">
    <div class="song-list-wrapper">
      <song-list :song-list="songList" @select="select"></song-list>
    </div>
    <div class="loading-container" v-show="songList === null || !songList.length">
      <loading></loading>
    </div>
    <m-footer></m-footer>
  </div>
</div>
</template>

<script type="text/ecmascript-6">
import MFooter from '@/components/m-footer/m-footer'
import SongList from 'detail/song-list/song-list'
import Loading from '@/base/loading/loading'
import { handleScrollMixin } from 'common/js/mixin'
import { prefixStyle } from 'common/js/dom'
import { mapActions } from 'vuex'

const TOP_HEIGHT = 44

const transform = prefixStyle('transform')
export default {
  name: 'MusicList',
  mixins: [handleScrollMixin],
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
    },
    select (item, index) {
      this.selectPlay({
        list: this.songList,
        index
      })
    },
    play () {
      this.randomPlay({
        list: this.songList
      })
    },
    handleScroll (scrollTop) {
      let height = Math.max(this.bgImageMaxScrollHeight, -scrollTop)
      let blur = 8 * (height / this.bgImageMaxScrollHeight)
      this.$refs.bgImage.style[transform] = `translate3d(0, ${height}px, 0)`
      this.$refs.bgImage.style.filter = `blur(${blur}px)`
    },
    ...mapActions([
      'selectPlay',
      'randomPlay'
    ])
  },
  mounted () {
    this.bgImageHeight = this.$refs.bgImage.clientHeight
    this.bgImageMaxScrollHeight = TOP_HEIGHT - this.bgImageHeight
    this.$refs.list.style.marginTop = `${this.bgImageHeight}px`
  },
  computed: {
    bgStyle () {
      return `background-image:url(${this.bgImage}`
    }
  },
  components: {
    SongList,
    Loading,
    MFooter
  }
}
</script>

<style scoped lang="stylus" rel="stylesheet/stylus">
  @import "~common/stylus/variable"
  @import "~common/stylus/mixin"
  .music-list
    position: absolute
    z-index: 10
    top: 0
    left: 0
    bottom: 0
    right: 0
    background: $color-background
    .back
      position: fixed
      top: 0
      left: 6px
      z-index: 50
      .icon-back
        display: block
        padding: 10px
        font-size: $font-size-large-x
        color: $color-theme
    .title
      position: fixed
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
      position: fixed
      z-index: 10
      width: 100%
      height: 0
      padding-top: 70%
      transform-origin: top
      background-size: cover
      .play-wrapper
        position: absolute
        bottom: 20px
        z-index:50
        width: 100%
        .play
          box-sizing: border-box
          width: 135px
          padding: 7px 0
          margin: 0 auto
          text-align: center
          border: 1px solid $color-theme
          color: $color-theme
          border-radius: 100px
          font-size: 0
          .icon-play
            display: inline-block
            vertical-align: middle
            margin-right: 6px
            font-size: $font-size-medium-x
          .text
            display: inline-block
            vertical-align: middle
            font-size: $font-size-small
      .filter
        position: absolute
        top: 0
        left: 0
        width: 100%
        height: 100%
        background: rgba(7, 17, 27, 0.4)
    .list
      width: 100%
      background: $color-background
      .song-list-wrapper
        padding: 20px 30px
    .loading-container
      position: absolute
      width: 100%
      top: 50%
      transform: translateY(-50%)
</style>

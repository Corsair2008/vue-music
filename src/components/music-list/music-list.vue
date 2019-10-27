<template>
<div class="music-list">
  <div class="back" @click="back">
    <i class="icon-back"></i>
  </div>
  <h1 class="title" v-html="title"></h1>
  <div :style="bgStyle" ref="bgImage" class="bg-image" >
  <div class="play-wrapper" v-show="songList.length > 0" @click="play">
    <div class="play">
      <i class="icon-play"></i>
      <span class="text">随机播放全部</span>
    </div>
  </div>
    <div ref="filter" class="filter"></div>
  </div>
  <scroll :data="songList"
          :listen-scroll="listenScroll"
          @scroll="scroll"
          ref="list"
          class="list"
  >
    <div class="song-list-wrapper">
      <song-list :song-list="songList" @select="select"></song-list>
    </div>
    <div class="loading-container" v-show="!songList.length">
      <loading></loading>
    </div>
  </scroll>
</div>
</template>

<script type="text/ecmascript-6">
import SongList from '@/components/song-list/song-list'
import Scroll from '@/base/scroll/scroll'
import Loading from '@/base/loading/loading'
import { prefixStyle } from 'common/js/dom'
import { mapActions } from 'vuex'

const TOP_HEIGHT = 40
const transform = prefixStyle('transform')
const backdrop = prefixStyle('backdrop-filter')

export default {
  name: 'MusicList',
  data () {
    return {
      scrollY
    }
  },
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
    scroll (pos) {
      this.scrollY = pos.y
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
    ...mapActions([
      'selectPlay',
      'randomPlay'
    ])
  },
  created () {
    this.listenScroll = true
  },
  mounted () {
    this.bgImageHeight = this.$refs.bgImage.clientHeight
    this.bgImageMaxScrollHeight = TOP_HEIGHT - this.bgImageHeight
    this.$refs.list.$el.style.top = `${this.bgImageHeight}px`
  },
  computed: {
    bgStyle () {
      return `background-image:url(${this.bgImage}`
    }
  },
  watch: {
    scrollY (newY) {
      if (this.timer) {
        clearTimeout(this.timer)
      }
      this.timer = setTimeout(() => {
        let percent = Math.abs(newY / this.bgImageHeight)
        if (newY > 0) {
          let scale = 1 + percent
          this.$refs.bgImage.style[transform] = `scale(${scale})`
        } else {
          let blur = Math.min(5 * percent, 8)
          let height = Math.max(this.bgImageMaxScrollHeight, newY)
          this.$refs.bgImage.style[transform] = `translate3d(0, ${height}px, 0)`
          this.$refs.filter.style[backdrop] = `blur(${blur}px)`
          this.$refs.bgImage.style.filter = `blur(${blur}px)`
        }
      }, 6)
    }
  },
  components: {
    Scroll,
    SongList,
    Loading
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
      position: fixed
      top: 0
      bottom: 0
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

<template>
<div class="player" v-show="playlist.length > 0">
  <div class="normal-player" v-show="fullscreen">
    <div class="top">
      <div class="back" @click="back">
        <i class="icon-back"></i>
      </div>
      <h1 class="title"> v-html="标题"</h1>
      <h2 class="subtitle"> v-html="副标题"</h2>
    </div>
    <div class="middle">
      <div class="middle-l">
        <div class="cd-wrapper">
          <div class="cd">
            <img class="image">
          </div>
        </div>
      </div>
    </div>
    <div class="bottom">
      <div class="operators">
        <div class="icon i-left">
          <i class="icon-sequence"></i>
        </div>
        <div class="icon i-left">
          <i class="icon-prev"></i>
        </div>
        <div class="icon i-center">
          <i class="icon-play"></i>
        </div>
        <div class="icon i-right">
          <i class="icon-next"></i>
        </div>
        <div class="icon i-right">
          <i class="icon icon-not-favorite"></i>
        </div>
      </div>
    </div>
  </div>
  <div class="mini-player" v-show="!fullscreen">迷你播放器</div>
</div>
</template>

<script type="text/ecmascript-6">
import { mapGetters, mapMutations } from 'vuex'
export default {
  name: 'Player',
  methods: {
    back () {
      this.setFullscreen(false)
    },
    ...mapMutations({
      setFullscreen: 'SET_FULLSCREEN'
    })
  },
  computed: {
    ...mapGetters([
      'fullscreen',
      'playlist'
    ])
  }
}
</script>

<style scoped lang="stylus" rel="stylesheet/stylus">
  @import '~common/stylus/variable'
  @import '~common/stylus/mixin'

  .player
    .normal-player
      position: fixed
      left: 0
      right: 0
      top: 0
      bottom: 0
      z-index: 150
      background: $color-background
      .top
        position: relative
        margin-bottom: 25px
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
            transform: rotate(-90deg)
        .title
          width: 70%
          margin: 0 auto
          line-height: 40px
          text-align: center
          no-wrap()
          font-size: $font-size-large
          color: $color-text
        .subtitle
          line-height: 20px
          text-align: center
          font-size: $font-size-medium
          color: $color-text
      .middle
        position: flex
        width: 100%
        top: 80px
        bottom: 170px
        white-space: nowrap
        font-size: 0
        .middle-l
          display: inline-block
          vertical-align: top
          position: relative
          width: 100%
          height: 0
          padding-top: 80%
          .cd-wrapper
            position: absolute
            left: 10%
            top: 0
            width: 80%
            height: 100%
            .cd
              width: 100%
              height: 100%
              box-sizing: border-box
              border: 10px solid rgba(255, 255, 255, 0.1)
              border-radius: 50%
              .image
                position: absolute
                left: 0
                top: 0
                width: 100%
                height: 100%
                border-radius: 50%
      .bottom
        position: absolute
        bottom: 50px
        width: 100%
        .operators
          display: flex
          align-items: center
          .icon
            flex: 1
            color: $color-theme
            i
              font-size: 30px
          .i-left
            text-align: right
          .i-center
            padding: 0 20px
            text-align: center
            i
              font-size: 40px
          .i-right
            text-align: left
          .icon-favorite
            color: $color-sub-theme
    .mini-player
      display: flex
      align-items: center
      position:fixed
      left: 0
      bottom: 0
      z-index: 180
      width: 100%
      height: 60px
      background: $color-highlight-background
</style>

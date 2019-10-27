<template>
<div class="player" v-show="playlist.length > 0">
  <transition name="normal"
              @enter="enter"
              @after-enter="afterEnter"
              @leave="leave"
              @after-leave="afterLeave"
  >
    <div class="normal-player" v-show="fullscreen">
      <div class="background">
        <img width="100%" height="100%" :src="currentSong.image">
      </div>
      <div class="top">
        <div class="back" @click="back">
          <i class="icon-back"></i>
        </div>
        <h1 class="title" v-html="currentSong.name"></h1>
        <div class="subtitle-wrapper">
          <h2 ref="subtitle" class="subtitle" :class="{'loop': this.subtitleLoop}" v-html="currentSong.singer"></h2>
        </div>
      </div>
      <div class="middle"
           @touchstart.prevent="middleTouchStart"
           @touchmove.prevent="middleTouchMove"
           @touchend="middleTouchEnd"
      >
        <div class="middle-l" ref="middleL">
          <div class="cd-wrapper" ref="cdWrapper">
            <div class="cd" :class="cdCls">
              <img class="image" :src="currentSong.image">
            </div>
          </div>
          <div class="playing-lyric-wrapper">
            <div class="playing-lyric">{{this.playingLyric}}</div>
          </div>
        </div>
        <scroll class="middle-r" ref="lyricList" :data="currentLyric && currentLyric.lines">
          <div class="lyric-wrapper">
            <div v-if="currentLyric">
              <p ref="lyricLine" class="text"
                 v-for="(line, index) in currentLyric.lines" :key="index"
                 :class="{'current': currentLineNum === index}"
              >{{line.txt}}</p>
            </div>
          </div>
        </scroll>
      </div>
      <div class="bottom">
        <div class="dot-wrapper">
          <div class="dot" :class="{'active': this.curMidComp === 'cd'}"></div>
          <div class="dot" :class="{'active': this.curMidComp === 'lyric'}"></div>
        </div>
        <div class="progress-wrapper">
          <span class="time time-l">{{format(currentTime)}}</span>
          <div class="progress-bar-wrapper">
            <progress-bar :percent="percent" @percentChange="onProgressBarChange"></progress-bar>
          </div>
          <span class="time time-r">{{format(currentSong.duration)}}</span>
        </div>
        <div class="operators">
          <div class="icon i-left" @click="changeMode">
            <i :class="modeCls"></i>
          </div>
          <div class="icon i-left" :class="disableCls">
            <i @click="prev" class="icon-prev"></i>
          </div>
          <div class="icon i-center" :class="disableCls">
            <i @click="switchPlay" :class="playCls"></i>
          </div>
          <div class="icon i-right" :class="disableCls">
            <i @click="next" class="icon-next"></i>
          </div>
          <div class="icon i-right">
            <i class="icon icon-not-favorite"></i>
          </div>
        </div>
      </div>
    </div>
  </transition>
  <transition name="mini">
    <div class="mini-player" v-show="!fullscreen" @click="openPlayer">
      <div class="icon">
        <img width="40" height="40" :src="currentSong.image" :class="cdCls">
      </div>
      <div class="text">
        <h2 class="name" v-html="currentSong.name"></h2>
        <p class="desc" v-html="currentSong.singer"></p>
      </div>
      <div @click.stop="switchPlay" class="control">
        <progress-circle :percent='percent' :radius="radius">
          <i class="icon-mini" :class="`${playCls}-mini`"></i>
        </progress-circle>
      </div>
      <div class="control">
        <i class="icon-playlist"></i>
      </div>
    </div>
  </transition>
  <audio ref="audio" :src="currentSong.url" @canplay="ready" @error="error" @timeupdate="updateTime" @ended="nextSong"></audio>
</div>
</template>

<script type="text/ecmascript-6">
import { mapGetters, mapMutations } from 'vuex'
import animations from 'create-keyframe-animation'
import { prefixStyle } from 'common/js/dom'
import ProgressBar from '@/base/progress-bar/progress-bar'
import ProgressCircle from '@/base/progress-circle/progress-circle'
import Scroll from '@/base/scroll/scroll'
import { playMode } from 'common/js/config'
import { shuffle, padding } from 'common/js/util'
import { getLyric } from '@/api/song'
import { Base64 } from 'js-base64'
import Lyric from 'common/js/lyric'

const transform = prefixStyle('transform')
const transitionDuration = prefixStyle('transitionDuration')

export default {
  name: 'Player',
  data () {
    return {
      songReady: false,
      currentTime: 0,
      radius: 32,
      currentLyric: null,
      currentLineNum: 0,
      curMidComp: 'cd',
      playingLyric: '',
      subtitleLoop: false
    }
  },
  methods: {
    back () {
      this.setFullscreen(false)
    },
    openPlayer () {
      this.setFullscreen(true)
    },
    switchPlay () {
      this.setPlayingState(!this.playing)
      if (this.currentLyric) {
        this.currentLyric.togglePlay()
      }
    },
    prev () {
      if (!this.songReady) {
        return
      }
      let num = this.playlist.length
      this.setCurrentIndex((this.currentIndex - 1 + num) % num)
    },
    next () {
      if (!this.songReady) {
        return
      }
      let num = this.playlist.length
      this.setCurrentIndex((this.currentIndex + 1) % num)
    },
    ready () {
      this.songReady = true
    },
    error () {
      this.songReady = true
    },
    updateTime (e) {
      this.currentTime = e.target.currentTime
    },
    format (interval) {
      const time = Math.floor(interval)
      const min = Math.floor(time / 60)
      const sec = padding(time % 60)
      return `${min}:${sec}`
    },
    enter (el, done) {
      const { x, y, scale } = this._getPosAndScale()

      let animation = {
        0: {
          transform: `translate3d(${x}px, ${y}px, 0) scale(${scale})`
        },
        60: {
          transform: `translate3d(0, 0, 0) scale(1.1)`
        },
        100: {
          transform: `translate3d(0, 0, 0) scale(1)`
        }
      }

      animations.registerAnimation({
        name: 'move',
        animation,
        presets: {
          duration: 400,
          easing: 'linear'
        }
      })
      animations.runAnimation(this.$refs.cdWrapper, 'move', done)
    },
    afterEnter () {
      animations.unregisterAnimation('move')
      this.$refs.cdWrapper.style.animation = ''
    },
    leave (el, done) {
      this.$refs.cdWrapper.style.transition = 'all 0.4s'
      const { x, y, scale } = this._getPosAndScale()
      this.$refs.cdWrapper.style[transform] = `translate3d(${x}px, ${y}px, 0) scale(${scale})`
      this.$refs.cdWrapper.addEventListener('transitionend', done)
    },
    afterLeave () {
      this.$refs.cdWrapper.style.transition = ''
      this.$refs.cdWrapper.style[transform] = ''
    },
    onProgressBarChange (percent) {
      const currentTime = percent * this.currentSong.duration
      this.$refs.audio.currentTime = currentTime
      if (!this.playing) {
        this.switchPlay()
      }
      if (this.currentLyric) {
        this.currentLyric.seek(currentTime * 1000)
      }
    },
    changeMode () {
      const mode = (this.mode + 1) % 3
      this.setMode(mode)
      let list = null
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
    nextSong () {
      if (this.mode === playMode.loop) {
        this.$refs.audio.currentTime = 0
        this.$refs.audio.play()
        if (this.currentLyric) {
          this.currentLyric.seek(0)
        }
      } else {
        this.next()
      }
    },
    middleTouchStart (e) {
      const touch = e.touches[0]
      this.touch.initiated = true
      this.touch.startX = touch.pageX
      this.touch.startY = touch.pageY
    },
    middleTouchMove (e) {
      if (!this.touch.initiated) {
        return
      }
      if (this.middleTouchTimer) {
        clearTimeout(this.middleTouchTimer)
      }
      this.middleTouchTimer = setTimeout(() => {
        const touch = e.touches[0]
        const deltaX = touch.pageX - this.touch.startX
        const deltaY = touch.pageY - this.touch.startY
        if (Math.abs(deltaX) < Math.abs(deltaY)) {
          return
        }
        let currentX = this.curMidComp === 'cd' ? 0 : -window.innerWidth
        let offsetWidth = Math.min(0, Math.max(currentX + deltaX, -window.innerWidth))
        this.touch.percent = Math.abs(offsetWidth / window.innerWidth)
        this.$refs.lyricList.$el.style[transform] = `translate3d(${offsetWidth}px,0,0)`
        this.$refs.lyricList.$el.style[transitionDuration] = 0
        this.$refs.middleL.style[transitionDuration] = 0
        this.$refs.middleL.style.opacity = 1 - this.touch.percent
        this.$refs.middleL.style.filter = 'blur(3px)'
      }, 5)
    },
    middleTouchEnd () {
      let offsetWidth
      let opacity
      if (this.curMidComp === 'cd') {
        if (this.touch.percent > 0.1) {
          offsetWidth = -window.innerWidth
          opacity = 0
          this.curMidComp = 'lyric'
        } else {
          offsetWidth = 0
          opacity = 1
        }
      } else {
        if (this.touch.percent < 0.9) {
          offsetWidth = 0
          opacity = 1
          this.curMidComp = 'cd'
        } else {
          offsetWidth = -window.innerWidth
          opacity = 0
        }
      }
      const time = 300
      setTimeout(() => {
        this.$refs.lyricList.$el.style[transform] = `translate3d(${offsetWidth}px,0,0)`
        this.$refs.lyricList.$el.style[transitionDuration] = `${time}ms`
        this.$refs.middleL.style.opacity = opacity
        this.$refs.middleL.style.filter = ''
        this.$refs.middleL.style[transitionDuration] = `${time}ms`
        this.touch.initiated = false
      }, 20)
    },
    _getLyric () {
      getLyric(this.currentSong.mid).then((res) => {
        if (!res.code) {
          let lyric = Base64.decode(res.lyric)
          this.currentLyric = new Lyric(lyric, this._handleLyric)
          this.currentLyric.play()
        }
      })
    },
    _handleLyric ({txt, lineNum}) {
      this.currentLineNum = lineNum
      if (lineNum > 5) {
        let lineEl = this.$refs.lyricLine[lineNum - 5]
        this.$refs.lyricList.scrollToElement(lineEl, 1000)
      } else {
        this.$refs.lyricList.scrollTo(0, 0, 1000)
      }
      this.playingLyric = txt
    },
    _getPosAndScale () {
      const trgWidth = 40
      const trgPaddingLeft = 40
      const trgPaddingBottom = 30
      const srcPaddingTop = 80
      const srcWidth = window.innerWidth * 0.8
      const scale = trgWidth / srcWidth
      const x = trgPaddingLeft - window.innerWidth / 2
      const y = window.innerHeight - srcPaddingTop - trgPaddingBottom - srcWidth / 2
      return {
        x,
        y,
        scale
      }
    },
    _subtitleLoop () {
      const textWidth = this.currentSong.singer.length * 14
      const subtitleWidth = this.$refs.subtitle.clientWidth
      if (textWidth > subtitleWidth) {
        this.subtitleLoop = true
      }
    },
    ...mapMutations({
      setFullscreen: 'SET_FULLSCREEN',
      setPlayingState: 'SET_PLAYING_STATE',
      setCurrentIndex: 'SET_CURRENT_INDEX',
      setMode: 'SET_MODE',
      setPlaylist: 'SET_PLAYLIST'
    })
  },
  computed: {
    playCls () {
      return this.playing ? 'icon-pause' : 'icon-play'
    },
    cdCls () {
      return this.playing ? 'play' : 'play pause'
    },
    disableCls () {
      return this.songReady ? '' : 'disable'
    },
    modeCls () {
      switch (this.mode) {
        case playMode.sequence:
          return 'icon-sequence'
        case playMode.loop:
          return 'icon-loop'
        default:
          return 'icon-random'
      }
    },
    percent () {
      return this.currentTime / this.currentSong.duration
    },
    ...mapGetters([
      'fullscreen',
      'playlist',
      'currentSong',
      'playing',
      'currentIndex',
      'mode',
      'sequenceList'
    ])
  },
  watch: {
    currentSong (newSong, oldSong) {
      if (newSong.id === oldSong.id) {
        return
      }
      if (this.currentLyric) {
        this.currentLyric.stop()
        this.currentLineNum = 0
        this.subtitleLoop = false
      }
      clearTimeout(this.songPlayTimer)
      this.songPlayTimer = setTimeout(() => {
        this._getLyric()
        this._subtitleLoop()
        this.$refs.audio.play()
      }, 1000)
      if (!this.playing) {
        this.switchPlay()
      }
      this.songReady = false
    },
    playing (newPlay) {
      const audio = this.$refs.audio
      this.$nextTick(() => {
        newPlay ? audio.play() : audio.pause()
      })
    }
  },
  created () {
    this.touch = {}
  },
  components: {
    ProgressBar,
    ProgressCircle,
    Scroll
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
      .background
        position: absolute
        left: 0
        top: 0
        width: 100%
        height: 100%
        z-index: -1
        opacity: 0.6
        filter: blur(20px)
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
        .subtitle-wrapper
          margin: 0 10px
          overflow: hidden
          .subtitle
            line-height: 20px
            text-align: center
            white-space: nowrap
            font-size: $font-size-medium
            color: $color-text
            &.loop
              animation: wordsloop 10s linear infinite
      .middle
        position: fixed
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
              &.play
                animation: rotate 20s linear infinite
              &.pause
                animation-play-state: paused
              .image
                position: absolute
                left: 0
                top: 0
                width: 100%
                height: 100%
                border-radius: 50%
          .playing-lyric-wrapper
            width: 80%
            margin: 30px auto 0 auto
            overflow: hidden
            text-align: center
            .playing-lyric
              height: 20px
              line-height: 20px
              font-size: $font-size-medium
              color: $color-text-l
        .middle-r
          display: inline-block
          vertical-align: top
          width: 100%
          height: 100%
          overflow: hidden
          .lyric-wrapper
            width: 80%
            margin: 0 auto
            overflow: hidden
            text-align: center
            .text
              line-height: 32px
              color: $color-text-l
              font-size: $font-size-medium
              &.current
                color: $color-text
      .bottom
        position: absolute
        bottom: 50px
        width: 100%
        .dot-wrapper
          text-align: center
          font-size: 0
          .dot
            display: inline-block
            vertical-align: middle
            margin: 0 4px
            width: 8px
            height: 8px
            border-radius: 50%
            background: $color-text-l
            &.active
              width: 20px
              border-radius: 5px
              background: $color-text-ll
        .progress-wrapper
          display: flex
          align-items: center
          width: 80%
          margin: 0 auto
          padding: 10px 0
          .time
            color: $color-text
            font-size: $font-size-small
            flex: 0 0 30px
            line-height: 30px
            width: 30px
            &.time-l
              text-align: left
            &.time-r
              text-align: right
          .progress-bar-wrapper
            flex: 1
        .operators
          display: flex
          align-items: center
          .icon
            flex: 1
            color: $color-theme
            &.disable
              color: $color-theme-d
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
      &.normal-enter-active, &.normal-leave-active
        transition: all 0.4s
        .top, .bottom
          transition: all 0.4s cubic-bezier(0.86, 0.18, 0.82, 1.32)
      &.normal-enter, &.normal-leave-to
        opacity: 0
        .top
          transform: translate3d(0, -100px, 0)
        .bottom
          transform: translate3d(0, 100px, 0)
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
      .icon
        flex: 0 0 40px
        width: 40px
        padding: 0 10px 0 20px
        img
          border-radius: 50%
          &.play
            animation: rotate 20s linear infinite
          &.pause
            animation-play-state: paused
      .text
        display: flex
        flex-direction: column
        justify-content: center
        flex: 1
        line-height: 20px
        overflow: hidden
        .name
          margin-bottom: 2px
          no-wrap()
          font-size: $font-size-medium
          color: $color-text
        .desc
          no-wrap()
          font-size: $font-size-small
          color: $color-text-d
      .control
        font-size: 32px
        width: 30px
        padding: 0 10px
        .icon-play-mini, .icon-pause-mini, .icon-playlist
          font-size: 30px
          color: $color-theme-d
        .icon-mini
          font-size: 32px
          position: absolute
          top: 0
          left: 0
      &.mini-enter-active, .mini-leave-active
        transition: all .8s
      &.mini-enter, &.mini-leave-to
        opacity: 0

  @keyframes rotate {
    0% {
      transform: rotate(0)
    }
    100% {
      transform: rotate(360deg)
    }
  }

  @keyframes wordsloop {
    0% {
      transform: translate3d(0, 0, 0)
    }
    100% {
      transform: translate3d(-200%, 0, 0)
    }
  }
</style>

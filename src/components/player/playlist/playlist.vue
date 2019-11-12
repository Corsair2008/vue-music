<template>
<transition name="list-fade">
  <div class="playlist" v-show="showFlag" @click="hide">
    <div class="list-wrapper" @click.stop>
      <div class="list-header">
        <h1 class="title">
          <i class="icon" :class="iconMode" @click="changeMode"></i>
          <span class="text">{{modeText}}</span>
          <span class="clear" @click="showConfirm"><i class="icon-clear"></i></span>
        </h1>
      </div>
      <div class="list-content" ref="listContent">
        <transition-group name="list" tag="ul">
          <li class="item" v-for="(item, index) in sequenceList" :key="item.id" @click="selectItem(item, index)">
            <i class="current" :class="getCurrentIcon(index)"></i>
            <span class="text">{{item.name}}</span>
            <span class="like">
              <i></i>
            </span>
            <span class="delete" @click.stop="deleteItem(item)">
              <i class="icon-delete"></i>
            </span>
          </li>
        </transition-group>
      </div>
      <div class="list-operate">
        <div class="add" @click="addSong(true)">
          <i class="icon-add"></i>
          <span class="text">添加歌曲到队列</span>
        </div>
      </div>
      <div class="list-close" @click="hide">
        <span>Close</span>
      </div>
    </div>
    <confirm ref="confirm" text="是否清空播放列表" @confirm="confirmClear"></confirm>
    <add-song v-if="showAddSong" @hide="addSong"></add-song>
  </div>
</transition>
</template>

<script type="text/ecmascript-6">
import { playerMixin } from 'common/js/mixin'
import {playMode} from 'common/js/config'
import { mapActions } from 'vuex'
import Confirm from '@/base/confirm/confirm'
import AddSong from '@/components/player/add-song/add-song'
const ITEM_HEIGHT = 40
export default {
  name: 'Playlist',
  mixins: [playerMixin],
  data () {
    return {
      showFlag: false,
      showAddSong: false
    }
  },
  components: {
    Confirm,
    AddSong
  },
  methods: {
    show () {
      this.showFlag = true
      setTimeout(() => {
        this._scrollToCurrentSong(this.currentIndex)
      }, 100)
    },
    hide () {
      this.showFlag = false
    },
    selectItem (item, index) {
      if (this.mode === playMode.random) {
        index = this.playlist.findIndex((song) => {
          return item.id === song.id
        })
      }
      this.setCurrentIndex(index)
      this.setPlayingState(true)
      this.hide()
    },
    deleteItem (item) {
      this.deleteSong(item)
      if (!this.playlist.length) {
        this.hide()
      }
    },
    confirmClear () {
      this.deleteSongList()
      this.hide()
    },
    showConfirm () {
      this.$refs.confirm.show()
    },
    addSong (state) {
      this.showAddSong = state
    },
    getCurrentIcon (index) {
      return index === this.currentIndex ? 'icon-play' : ''
    },
    _scrollToCurrentSong (index) {
      this.$refs.listContent.scrollTop = ITEM_HEIGHT * index
    },
    ...mapActions([
      'deleteSong',
      'deleteSongList'
    ])
  },
  computed: {
    modeText () {
      let songInfo = `(${this.currentIndex + 1} / ${this.playlist.length}首)`
      let play = this.mode === playMode.sequence ? `顺序播放` : this.mode === playMode.loop ? `循环播放` : `随机播放`
      return play + songInfo
    }
  }
}
</script>

<style scoped lang="stylus" rel="stylesheet/stylus">
  @import '~common/stylus/variable'
  @import '~common/stylus/mixin'

  .playlist
    position: fixed
    top: 0
    left: 0
    right: 0
    bottom: 0
    z-index: 200
    background-color: $color-background-d
    &.list-fade-enter-active, &.list-fade-leave-active
      transition: opacity .3s
      .list-wrapper
        transition: all .3s
    &.list-fade-enter, &.list-fade-leave-to
      opacity: 0
      .list-wrapper
        transform: translateY(100%)
    .list-wrapper
      position: absolute
      left: 0
      right: 0
      bottom: 0
      background-color: $color-highlight-background
      .list-header
        position: relative
        padding: 20px 30px 10px 20px
        .title
          display: flex
          align-items: center
          .icon
            margin-right: 10px
            font-size: 30px
            color: $color-theme-d
          .text
            flex: 1
            font-size: $font-size-medium
            color: $color-text-l
          .clear
            extend-click()
            .icon-clear
              font-size: $font-size-medium
              color: $color-text-d
      .list-content
        max-height: 240px
        overflow-y: auto
        .item
          display: flex
          align-items: center
          height: 40px
          padding: 0 30px 0 20px
          &.list-enter-active, &.list-leave-active
            transition: all .3s
          &.list-enter, &.list-leave-to
            height: 0
          .current
            flex: 0 0 20px
            width: 20px
            font-size: $font-size-small
            color: $color-theme-d
          .text
            flex: 1
            no-warp()
            font-size: $font-size-medium
            color: $color-text-d
          .like
            extend-click()
            margin-right: 15px
            font-size: $font-size-small
            color: $color-theme
            .icon-favorite
              color: $color-sub-theme
          .delete
            extend-click()
            font-size: $font-size-small
            color: $color-theme
      .list-operate
        width: 140px
        margin: 20px auto 30px auto
        .add
          display: flex
          align-items: center
          padding: 8px 16px
          border: 1px solid $color-text-l
          border-radius: 100px
          color: $color-text-l
          .icon-add
            margin-right: 5px
            font-size: $font-size-small-s
          .text
            font-size: $font-size-small
      .list-close
        text-align: center
        line-height: 50px
        background: $color-background
        font-size: $font-size-medium-x
        color: $color-text-l
</style>

<template>
<transition appear name="slider">
  <div class="add-song" @click.stop>
    <div class="header">
      <div class="back" @click="hide">
        <i class="icon-back"></i>
      </div>
      <h1 class="title">添加歌曲</h1>
    </div>
    <div class="search-box-wrapper">
      <search-box ref="searchBox" @query="getQuery"></search-box>
    </div>
    <div class="shortcut" v-show="!query">
      <switches :switches="switches" :currentIndex="currentIndex" @switch="switchItem"></switches>
      <div class="list-wrapper">
        <div class="list-inner" v-if="currentIndex === 0">
          <song-list :songList="playHistory" @select="selectSong"></song-list>
        </div>
      </div>
      <div class="list-wrapper" v-if="currentIndex === 1">
        <div class="list-inner">
          <search-list :list="searchHistory" @select="selectQuery" @delete="deleteSearchHistory"></search-list>
        </div>
      </div>
    </div>
    <div class="suggest-result" v-show="query" ref="suggestResult">
      <suggest :query="query" :hasSinger="hasSinger" @select="selectSuggest"></suggest>
    </div>
    <top-tip ref="topTip">
      <div class="tip-title">
        <i class="icon-ok"></i>
        <span class="text">1首歌曲已添加到播放列表</span>
      </div>
    </top-tip>
  </div>
</transition>
</template>

<script type="text/ecmascript-6">
import Switches from '@/base/switches/switches'
import SearchBox from '@/base/search-box/search-box'
import SearchList from '@/base/search-list/search-list'
import TopTip from '@/base/top-tip/top-tip'
import Suggest from '@/base/suggest/suggest'
import SongList from 'detail/song-list/song-list'
import { searchMixin } from 'common/js/mixin'
import { mapGetters, mapActions } from 'vuex'
import Song from 'common/js/song'
export default {
  name: 'AddSong',
  mixins: [searchMixin],
  data () {
    return {
      switches: ['最近播放', '搜索历史'],
      currentIndex: 0,
      hasSinger: false
    }
  },
  methods: {
    hide () {
      this.$emit('hide', false)
    },
    switchItem (index) {
      this.currentIndex = index
    },
    selectSong (song, index) {
      if (index !== 0) {
        this.insertSong(new Song(song))
        this.$refs.topTip.show()
      }
    },
    selectSuggest () {
      this.$refs.topTip.show()
      this.saveQuery()
    },
    ...mapActions([
      'insertSong'
    ])
  },
  computed: {
    ...mapGetters([
      'playHistory'
    ])
  },
  components: {
    Switches,
    SearchBox,
    SearchList,
    Suggest,
    SongList,
    TopTip
  }
}
</script>

<style scoped lang="stylus" rel="stylesheet/stylus">
@import '~common/stylus/variable'
.add-song
  position: fixed
  top: 0
  left: 0
  right: 0
  bottom: 0
  z-index: 200
  background: $color-background
  &.slider-enter-active
    transition: all .3s
  &.slider-enter
    transform: translateX(100%)
  .header
    position: relative
    height: 44px
    text-align: center
    .title
      line-height: 44px
      font-size: $font-size-large
      color: $color-text
    .back
      position: absolute
      top: 0
      left: 8px
      .icon-back
        display: block
        padding: 12px
        font-size: 20px
        color: $color-theme
  .search-box-wrapper
    margin: 20px
  .shortcut
    .list-wrapper
      position: absolute
      top: 165px
      bottom: 0
      width: 100%
      overflow: auto
      .list-inner
        padding: 20px 30px
  .suggest-result
    position: absolute
    top: 130px
    left: 0
    right: 0
    bottom: 0
    overflow: auto
  .tip-title
    text-align: center
    padding: 18px 0
    font-size: 0
    .icon-ok
      font-size: $font-size-medium
      color: $color-theme
      margin-right: 4px
    .text
      font-size: $font-size-medium
      color: $color-text
</style>

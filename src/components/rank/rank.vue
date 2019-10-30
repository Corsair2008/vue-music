<template>
  <div class="rank" ref="rank">
    <scroll class="toplist" :data='toplist' ref="toplist">
      <ul>
        <li class="item" v-for="(item, index) in toplist" :key="index" @click="selectItem(item)">
          <div class="icon">
            <img v-lazy="item.frontPicUrl" width="100%" height="100%">
          </div>
          <ul class="songlist">
            <h2 class="title">{{item.title}}</h2>
            <li class="song" v-for="(song, index) in item.song" :key="index">
              <span>{{index + 1}}</span>
              <span>{{getText(song)}}</span>
            </li>
          </ul>
        </li>
      </ul>
      <div class="loading-container" v-show="toplist.length > 0">
        <loading></loading>
      </div>
    </scroll>
    <router-view></router-view>
  </div>
</template>

<script type="text/ecmascript-6">
import { getRank } from '@/api/toplist'
import Scroll from '@/base/scroll/scroll'
import Loading from '@/base/loading/loading'
import { playlistMixin } from 'common/js/mixin'
import { mapMutations } from 'vuex'

export default {
  name: 'Rank',
  mixins: [playlistMixin],
  data () {
    return {
      toplist: []
    }
  },
  methods: {
    getText (song) {
      return `${song.title} - ${song.singerName}`
    },
    selectItem (item) {
      this.$router.push(`/rank/${item.topId}`)
      this.setToplist(item)
    },
    handlePlaylist (playlist) {
      if (playlist === null) {
        return
      }
      const bottom = playlist.length > 0 ? '60px' : ''
      this.$refs.rank.style.bottom = bottom
      this.$refs.toplist.refresh()
    },
    _getRank () {
      getRank().then((res) => {
        let toplist = []
        if (res.group) {
          res.group.forEach((list) => {
            list.toplist.forEach((item) => {
              toplist.push(item)
            })
          })
        }
        this.toplist = toplist
      })
    },
    ...mapMutations({
      setToplist: 'SET_TOPLIST'
    })
  },
  created () {
    this._getRank()
  },
  components: {
    Scroll,
    Loading
  }
}
</script>

<style scoped lang="stylus" rel="stylesheet/stylus">
  @import '~common/stylus/variable'
  @import '~common/stylus/mixin'

  .rank
    position: fixed
    width: 100%
    top: 88px
    bottom: 0
    .toplist
      height: 100%
      overflow: hidden
      .item
        display: flex
        margin: 0 20px
        padding: 10px 0
        height: 100px
        .icon
          flex: 0 0 100px
          width: 100px
          height: 100px
        .songlist
          flex: 1
          display: flex
          flex-direction: column
          justify-content: center
          padding: 0 20px
          height: 100px
          overflow: hidden
          background: $color-highlight-background
          color: $color-text-d
          .title
            margin: 5px 0
            font-size: $font-size-medium-x
          .song
            no-wrap()
            line-height: 26px
            font-size: $font-size-small
          .loading-container
            position: absolute
            width: 100%
            top: 50%
            transform: translateY(-50%)
</style>

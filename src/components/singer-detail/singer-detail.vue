<template>
<transition appear name="slide">
  <div class="singer-detail"></div>
</transition>
</template>

<script type="text/ecmascript-6">
import { mapGetters } from 'vuex'
import { getSongList } from '@/api/singer'
import { filterSongUrl } from 'common/js/song'
export default {
  name: 'SingerDetail',
  data () {
    return {
      songList: []
    }
  },
  computed: {
    ...mapGetters([
      'singer'
    ])
  },
  methods: {
    _getSingerSongList () {
      if (!this.singer.id) {
        this._backToSingerPage()
        return
      }
      getSongList(this.singer.id).then((res) => {
        if (this.singer.id !== res.singerMid) {
          this._backToSingerPage()
          return
        }
        this.songList = res.songList
        console.log(this.songList)
      })
    },
    _normalizeSongList (songList) {
      // let ret = []
      // songList.forEach((song) => {
      //   let {musicData} = song
      //   console.log(musicData)
      // })
    },
    _backToSingerPage () {
      this.$router.push('/singer')
    }
  },
  created () {
    this._getSingerSongList()
    filterSongUrl('002E3MtF0IAMMY')
  }
}
</script>

<style scoped lang="stylus" rel="stylesheet/stylus">
  @import '~common/stylus/variable'

  .singer-detail
    position: fixed
    z-index: 100
    top: 0
    left: 0
    right: 0
    bottom: 0
    background: $color-background

  .slide-enter-active,.slide-leave-active
    transition: all .3s
  .slide-enter,.slide-leave-to
    transform: translate3d(100%, 0, 0)
</style>

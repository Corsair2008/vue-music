<template>
<transition appear name="slide">
  <music-list :title="title" :bg-image="bgImage" :songList="songList"></music-list>
</transition>
</template>

<script type="text/ecmascript-6">
import MusicList from '@/components/music-list/music-list'
import { mapGetters } from 'vuex'
import { createDiscSong } from 'common/js/song'
import { getSongUrl } from '@/api/song'
import { getDiscSongs } from '@/api/recommend'
export default {
  name: 'Disc',
  data () {
    return {
      songList: []
    }
  },
  methods: {
    _getSongList () {
      if (!this.disc.dissid) {
        this.$router.back()
      }
      getDiscSongs(this.disc.dissid).then((res) => {
        let songs = []
        if (res.songlist) {
          songs = res.songlist
        }
        this._normalizeSong(songs)
      })
    },
    _normalizeSong (songs) {
      if (!songs) {
        return
      }
      let mids = []
      songs.forEach((song) => {
        let mid = song.songmid
        mids.push(mid)
      })
      getSongUrl(mids).then((urls) => {
        for (let i = 0; i < songs.length; i++) {
          let url = urls[i]
          if (url && url.purl) {
            let songUrl = `http://ws.stream.qqmusic.qq.com/${url.purl}`
            this.songList.push(createDiscSong(songs[i], songUrl))
          }
        }
      })
    }
  },
  computed: {
    title () {
      return this.disc.dissname
    },
    bgImage () {
      return this.disc.imgurl
    },
    ...mapGetters([
      'disc'
    ])
  },
  created () {
    this._getSongList()
  },
  components: {
    MusicList
  }
}
</script>

<style scoped lang="stylus" rel="stylesheet/stylus">
  @import '~common/stylus/variable'

  .slide-enter-active, .slide-leave-active
    transition: all .3s
  .slide-enter, .slide-leave-to
    transform: translateX(100%)
</style>

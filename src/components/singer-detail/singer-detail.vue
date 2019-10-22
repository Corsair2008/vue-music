<template>
<transition appear name="slide">
  <music-list :title="title" :bg-image="bgImage" :song-list="songList"></music-list>
</transition>
</template>

<script type="text/ecmascript-6">
import { mapGetters } from 'vuex'
import { getSongList } from '@/api/singer'
import { createSong } from 'common/js/song'
import { getSongUrl } from '@/api/song'
import MusicList from '@/components/music-list/music-list'
export default {
  name: 'SingerDetail',
  data () {
    return {
      songList: []
    }
  },
  computed: {
    title () {
      return this.singer.name
    },
    bgImage () {
      return this.singer.avatar
    },
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
        this._normalizeSongList(res.songList)
      })
    },
    _normalizeSongList (songList) {
      let mids = []
      let songs = songList
      songs.forEach((song) => {
        let mid = song.songInfo.mid
        mids.push(mid)
      })
      getSongUrl(mids).then((urls) => {
        for (let i = 0; i < songs.length; i++) {
          let url = urls[i]
          if (url && url.purl) {
            let songUrl = `http://ws.stream.qqmusic.qq.com/${url.purl}`
            this.songList.push(createSong(songs[i].songInfo, songUrl))
          }
        }
      })
    },
    _backToSingerPage () {
      this.$router.push('/singer')
    }
  },
  created () {
    this._getSingerSongList()
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
    transform: translate3d(100%, 0, 0)
</style>

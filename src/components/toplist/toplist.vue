<template>
<transition appear name="toplist">
  <music-list :title='title' :bg-image="bgImage" :songList="songList"></music-list>
</transition>
</template>

<script type="text/ecmascript-6">
import MusicList from '@/components/music-list/music-list'
import { mapGetters } from 'vuex'
import { getRank } from '@/api/toplist'
import { createSong } from 'common/js/song'
import { getSongUrl } from '@/api/song'
export default {
  name: 'Toplist',
  data () {
    return {
      songList: []
    }
  },
  methods: {
    _getToplist () {
      if (!this.toplist.topId) {
        this.$refs.push('/rank')
        return
      }
      getRank(this.toplist.topId).then((res) => {
        this._normalizeSongList(res.songInfoList)
      })
    },
    _normalizeSongList (songList) {
      let mids = []
      let songs = songList
      songs.forEach((song) => {
        let mid = song.mid
        mids.push(mid)
      })
      getSongUrl(mids).then((urls) => {
        for (let i = 0; i < songs.length; i++) {
          let url = urls[i]
          if (url && url.purl) {
            let songUrl = `http://ws.stream.qqmusic.qq.com/${url.purl}`
            this.songList.push(createSong(songs[i], songUrl))
          }
        }
      })
    }
  },
  computed: {
    title () {
      return this.toplist.title
    },
    bgImage () {
      return this.toplist.frontPicUrl
    },
    ...mapGetters([
      'toplist'
    ])
  },
  created () {
    this._getToplist()
  },
  components: {
    MusicList
  }
}
</script>

<style scoped lang="stylus" rel="stylesheet/stylus">
.toplist-enter-active, .toplist-leave-active
  transition: all .3s
.toplist-enter, .toplist-leave-to
  transform: translateX(100%)
</style>

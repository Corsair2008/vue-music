<template>
<transition appear name="slide" class="detail">
  <music-list :title="title" :bg-image="bgImage" :songList="songList"></music-list>
</transition>
</template>

<script type="text/ecmascript-6">
import MusicList from 'detail/music-list/music-list'
import { detailType } from 'common/js/config'
import { normalizeToplist } from '@/api/toplist'
import { normalizeDisclist } from '@/api/disc'
import { normalizeSonglist } from '@/api/singer'
import { mapGetters } from 'vuex'
export default {
  name: 'Detail',
  data () {
    return {
      title: '',
      bgImage: '',
      songList: []
    }
  },
  methods: {
    _query () {
      const {type, id} = this.$route.query
      if (!type || !id) {
        this.$router.push('/recommend')
        return
      }
      this._getSongList(type, id)
    },
    _getSongList (type, id) {
      switch (type) {
        case detailType.singer:
          if (!this.singer) {
            this.$router.push('/')
            return
          }
          normalizeSonglist(id).then((res) => {
            this.title = this.singer.name
            this.bgImage = this.singer.avatar
            this.songList = res
          })
          break
        case detailType.toplist:
          if (!this.toplist) {
            this.$router.push('/')
            return
          }
          normalizeToplist(id).then((res) => {
            this.title = this.toplist.title
            this.bgImage = this.toplist.frontPicUrl
            this.songList = res
          })
          break
        case detailType.disc:
          if (!this.disc) {
            this.$router.push('/')
            return
          }
          normalizeDisclist(id).then((res) => {
            this.title = this.disc.dissname
            this.bgImage = this.disc.imgurl
            this.songList = res
          })
          break
        default:
          this.$router.push('/')
      }
    }
  },
  computed: {
    ...mapGetters([
      'disc',
      'toplist',
      'singer'
    ])
  },
  created () {
    this._query()
  },
  components: {
    MusicList
  }
}
</script>

<style scoped lang="stylus" rel="stylesheet/stylus">
.slide-enter-active
  transition: all .3s
.slide-enter
  transform: translateX(100%)
</style>

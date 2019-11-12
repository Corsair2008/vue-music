<template>
<transition appear name="slide" class="detail">
  <music-list :title="title" :bg-image="bgImage" :songList="songList"></music-list>
</transition>
</template>

<script type="text/ecmascript-6">
import MusicList from 'detail/music-list/music-list'
import { detailType } from 'common/js/config'
import { handleScrollMixin } from 'common/js/mixin'
import { normalizeToplist } from '@/api/toplist'
import { normalizeDisclist } from '@/api/disc'
import { normalizeSonglist, getSingerDetail } from '@/api/singer'
import Singer from 'common/js/singer'
export default {
  name: 'Detail',
  mixins: [handleScrollMixin],
  data () {
    return {
      title: '',
      bgImage: '',
      songList: [],
      page: 1
    }
  },
  methods: {
    handleScrollToEnd () {
      const { type, id } = this.$route.query
      if (parseInt(type) === detailType.singer) {
        normalizeSonglist(id, this.page++).then((res) => {
          let ret = this.songList
          this.title = this.singer.name
          this.bgImage = this.singer.avatar
          this.songList = ret.concat(res)
        })
      }
    },
    _query () {
      const {type, id} = this.$route.query
      if (!type || !id) {
        this.$router.push('/recommend')
        return
      }
      this._getSongList(type, id)
    },
    _getSongList (type, id) {
      if (typeof type === 'string') {
        type = parseInt(type)
      }
      switch (type) {
        case detailType.singer:
          this._getSingerDetail(id)
          normalizeSonglist(id, this.page++).then((res) => {
            this.title = this.singer.name
            this.bgImage = this.singer.avatar
            this.songList = res
          })
          break
        case detailType.toplist:
          normalizeToplist(parseInt(id)).then((res) => {
            this.title = res.title
            this.bgImage = res.bgImage
            this.songList = res.songlist
          })
          break
        case detailType.disc:
          normalizeDisclist(parseInt(id)).then((res) => {
            this.title = res.dissname
            this.bgImage = res.bgImage
            this.songList = res.songlist
          })
          break
        default:
          this.$router.push('/')
      }
    },
    _getSingerDetail (id) {
      getSingerDetail(id).then((res) => {
        if (res.singer_list && res.singer_list.length > 0) {
          let originSinger = res.singer_list[0].basic_info
          this.singer = new Singer(originSinger.singer_mid, originSinger.name)
        } else {
          return Promise.reject(new Error('singer mid err'))
        }
      })
    }
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

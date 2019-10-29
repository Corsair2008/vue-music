<template>
<transition appear name="slide">
  <music-list :title='title' :bg-image="bgImage" :songList='songList'></music-list>
</transition>
</template>

<script type="text/ecmascript-6">
import MusicList from '@/components/music-list/music-list'
import { mapGetters } from 'vuex'
export default {
  name: 'Disc',
  data () {
    return {
      songList: {
        type: Array,
        default: null
      }
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

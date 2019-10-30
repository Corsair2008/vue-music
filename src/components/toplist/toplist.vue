<template>
<transition class="toplist">
  <music-list></music-list>
</transition>
</template>

<script type="text/ecmascript-6">
import MusicList from '@/components/music-list/music-list'
import { mapGetters } from 'vuex'
export default {
  name: 'Toplist',
  methods: {},
  computed: {
    ...mapGetters ([
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

</style>

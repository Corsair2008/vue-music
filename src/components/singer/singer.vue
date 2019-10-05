<template>
  <div>
    歌手
  </div>
</template>

<script type="text/ecmascript-6">
import { getSingerList } from '@/api/singer.js'
export default {
  name: 'Singer',
  mounted () {
    this._getSingerList()
  },
  methods: {
    _getSingerList () {
      getSingerList().then((res) => {
        console.log(res)
      })
    }
  }
}
</script>

<style scoped lang="stylus" rel="stylesheet/stylus">

</style>

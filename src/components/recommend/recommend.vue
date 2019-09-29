<template>
  <div>
    推荐
  </div>
</template>

<script type="text/ecmascript-6">
import getRecommend from '@/api/recommend'
import { ERR_OK } from '@/api/config'
export default {
  name: 'Recommend',
  created () {
    this._getRecommend()
  },
  methods: {
    _getRecommend () {
      getRecommend().then((res) => {
        if (res.code === ERR_OK) {
          console.log(res.data)
        }
      })
    }
  }
}
</script>

<style scoped lang="stylus" rel="stylesheet/stylus">

</style>

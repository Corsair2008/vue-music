<template>
  <div class="singer" ref="singer">
    <listview ref="list" :data="singers" @select='selectSinger'></listview>
    <router-view></router-view>
  </div>
</template>

<script type="text/ecmascript-6">
import { getSingerList } from '@/api/singer'
import { ERR_OK } from '@/api/config'
import Singer from 'common/js/singer'
import Listview from '@/base/listview/listview'
import { mapMutations } from 'vuex'
import { detailType } from 'common/js/config'

const HOT_SINGER = '热门'
const HOT_SINGER_LEN = 10

export default {
  name: 'Singer',
  data () {
    return {
      singers: []
    }
  },
  components: {
    Listview
  },
  created () {
    this._getSingerList()
  },
  methods: {
    selectSinger (singer) {
      this.$router.push({
        path: '/detail',
        query: {
          type: detailType.singer,
          id: singer.id
        }
      })
      this.setSinger(singer)
    },
    _getSingerList () {
      getSingerList().then((res) => {
        if (res.code === ERR_OK) {
          this.singers = this._normalizeSinger(res.data.list)
        }
      })
    },
    _normalizeSinger (list) {
      let map = {
        hot: {
          title: HOT_SINGER,
          items: []
        }
      }
      list.forEach((item, index) => {
        if (index < HOT_SINGER_LEN) {
          map.hot.items.push(new Singer(item.Fsinger_mid, item.Fsinger_name))
        }
        let key = item.Findex
        if (!map[key]) {
          map[key] = {
            title: key,
            items: []
          }
        }
        map[key].items.push(new Singer(item.Fsinger_mid, item.Fsinger_name))
      })
      let hot = []
      let ret = []
      for (let key in map) {
        let val = map[key]
        if (val.title.match(/[a-zA-Z]/)) {
          ret.push(val)
        } else if (val.title === HOT_SINGER) {
          hot.push(val)
        }
      }
      ret.sort((a, b) => {
        return a.title.charCodeAt(0) - b.title.charCodeAt(0)
      })
      return hot.concat(ret)
    },
    ...mapMutations({
      setSinger: 'SET_SINGER'
    })
  }
}
</script>

<style scoped lang="stylus" rel="stylesheet/stylus">
  .singer
    margin-top: 88px
</style>

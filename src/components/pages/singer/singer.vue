<template>
  <div class="singer" ref="singer">
    <listview ref="list" :data="singers" @select='selectSinger'></listview>
    <router-view></router-view>
  </div>
</template>

<script type="text/ecmascript-6">
import { getHotSingers, getSingerList } from '@/api/singer'
import { ERR_OK } from '@/api/config'
import Singer from 'common/js/singer'
import Listview from '@/base/listview/listview'
import { detailType } from 'common/js/config'

const HOT_SINGER = '热门'
const HOT_SINGER_LEN = 30

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
    },
    _getSingerList () {
      let hot = [{
        title: HOT_SINGER,
        items: []
      }]
      getHotSingers().then((res) => {
        let singers = []
        res.forEach((item, index) => {
          if (index < HOT_SINGER_LEN) {
            hot[0].items.push(new Singer(item.singer_mid, item.singer_name))
          }
        })
        getSingerList(1).then((res) => {
          if (res.code === ERR_OK) {
            singers = res.data.list
            getSingerList(2).then((res) => {
              if (res.code === ERR_OK) {
                return singers.concat(res.data.list)
              }
            }).then((res) => {
              this.singers = this._normalizeSinger(res, hot)
            })
          }
        })
      })
    },
    _normalizeSinger (list, hot) {
      let map = {}
      list.forEach((item, index) => {
        let key = item.Findex
        if (!map[key]) {
          map[key] = {
            title: key,
            items: []
          }
        }
        map[key].items.push(new Singer(item.Fsinger_mid, item.Fsinger_name))
      })
      let ret = []
      for (let key in map) {
        let val = map[key]
        if (val.title.match(/[a-zA-Z]/)) {
          ret.push(val)
        }
      }
      ret.sort((a, b) => {
        return a.title.charCodeAt(0) - b.title.charCodeAt(0)
      })
      return hot.concat(ret)
    }
  }
}
</script>

<style scoped lang="stylus" rel="stylesheet/stylus">
  .singer
    margin-top: 88px
</style>

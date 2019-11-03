<template>
<div class="suggest">
  <ul class="suggest-list">
    <li class="suggest-item" v-for="(item, index) in suggestList" :key="index">
      <div class="icon">
        <i :class="getIconCls(item)"></i>
      </div>
      <div class="name">
        <p class="text" v-html="getContent(item)"></p>
      </div>
    </li>
  </ul>
</div>
</template>

<script type="text/ecmascript-6">
import { getSuggest } from '@/api/search'
import { filterSinger } from 'common/js/song'
const TYPE_SINGER = 'singer'
export default {
  name: 'Suggest',
  props: {
    query: {
      type: String,
      default: ''
    }
  },
  data () {
    return {
      page: 1,
      suggestList: []
    }
  },
  methods: {
    search (query, page) {
      if (this.searchIntervalTimer) {
        clearTimeout(this.searchIntervalTimer)
      }
      this.searchIntervalTimer = setTimeout(() => {
        getSuggest(query, page).then((res) => {
          let ret = []
          if (res.zhida.singername) {
            ret.push({...res.zhida, ...{type: TYPE_SINGER}})
          }
          if (res.song && res.song.list) {
            ret = ret.concat(res.song.list)
          }
          this.suggestList = ret
        })
      }, 10)
    },
    getIconCls (item) {
      if (item.type === TYPE_SINGER) {
        return 'icon-mine'
      } else {
        return 'icon-music'
      }
    },
    getContent (item) {
      if (item.type === TYPE_SINGER) {
        return item.singername
      } else {
        return `${item.songname}-${filterSinger(item.singer)}`
      }
    }
  },
  watch: {
    query () {
      this.search(this.query, this.page)
    }
  }
}
</script>

<style scoped lang="stylus" rel="stylesheet/stylus">
@import "~common/stylus/variable"
@import "~common/stylus/mixin"
.suggest
  background: $color-background
  overflow: hidden
  .suggest-list
    padding: 0 30px
    .suggest-item
      display: flex
      align-items: center
      padding-bottom: 20px
    .icon
      flex: 0 0 30px
      width: 30px
    .name
      flex: 1
      font-size: $font-size-medium
      color: $color-text-d
      overflow: hidden
      .text
        no-wrap()
    .no-result-wrapper
      position: absolute
      width: 100%
      top: 50%
      transform: translateY(-50%)
</style>

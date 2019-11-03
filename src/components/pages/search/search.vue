<template>
  <div class="search">
    <div class="search-box-wrapper">
      <search-box ref="searchBox" @query="getQuery"></search-box>
    </div>
    <div class="shortcut-wrapper" v-show="!query">
      <div class="hot-key">
        <h1 class="title">热门搜索</h1>
        <ul>
          <li v-for="(item, index) in hotkey"
              :key="index" v-html="item.query"
              class="item" @click="selectQuery(item.query)"
          ></li>
        </ul>
      </div>
    </div>
    <div class="suggest-result">
      <suggest :query="query"></suggest>
    </div>
  </div>
</template>

<script type="text/ecmascript-6">
import SearchBox from '@/base/search-box/search-box'
import Suggest from 'search/suggest/suggest'
import { getHotkey } from '@/api/search'
export default {
  name: 'Search',
  data () {
    return {
      query: '',
      hotkey: []
    }
  },
  methods: {
    selectQuery (query) {
      this.$refs.searchBox.setQuery(query)
    },
    getQuery (query) {
      this.query = query
    },
    _getHotkey () {
      getHotkey().then((res) => {
        this.hotkey = res.vec_hotkey
      })
    }
  },
  created () {
    this._getHotkey()
  },
  components: {
    SearchBox,
    Suggest
  }
}
</script>

<style scoped lang="stylus" rel="stylesheet/stylus">
@import "~common/stylus/variable"
@import "~common/stylus/mixin"
.search
  margin-top: 88px
  .search-box-wrapper
    padding: 20px
  .shortcut-wrapper
    position: absolute
    width: 100%
    top: 178px
    overflow: hidden
    .hot-key
      margin: 0 20px 20px 20px
      .title
        margin-bottom: 20px
        font-size: $font-size-medium
        color: $color-text-l
      .item
        display: inline-block
        max-width: 33%
        no-wrap()
        padding: 5px 10px
        margin: 0 20px 10px 0
        border-radius: 6px
        background: $color-highlight-background
        font-size: $font-size-small
        color: $color-text-d
  .suggest-result
    position: absolute
    width: 100%
    top: 178px
</style>

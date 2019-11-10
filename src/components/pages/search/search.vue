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
      <div class="search-history" v-show="searchHistory.length">
        <h1 class="title">
          <span class="text">搜索历史</span>
          <span class="clear" @click="showConfirm">
            <i class="icon-clear"></i>
          </span>
        </h1>
        <search-list :list="searchHistory" @select="selectQuery" @delete="deleteSearchHistory"></search-list>
      </div>
    </div>
    <div class="suggest-result">
      <suggest :query="query" @select="saveQuery" @scroll="handleScroll"></suggest>
    </div>
    <confirm ref="confirm" text="偶哟，删除所有记录？" @confirm="clearSearchHistory"></confirm>
  </div>
</template>

<script type="text/ecmascript-6">
import SearchBox from '@/base/search-box/search-box'
import SearchList from '@/base/search-list/search-list'
import Confirm from '@/base/confirm/confirm'
import Suggest from 'search/suggest/suggest'
import { getHotkey } from '@/api/search'
import { searchMixin } from 'common/js/mixin'
import { mapGetters } from 'vuex'
export default {
  name: 'Search',
  mixins: [searchMixin],
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
    handleScroll (scrollTop) {
      this.$refs.searchBox.blur()
    },
    showConfirm () {
      this.$refs.confirm.show()
    },
    _getHotkey () {
      getHotkey().then((res) => {
        this.hotkey = res.vec_hotkey
      })
    }
  },
  computed: {
    ...mapGetters([
      'searchHistory'
    ])
  },
  created () {
    this._getHotkey()
  },
  components: {
    SearchBox,
    Suggest,
    SearchList,
    Confirm
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
    width: 100%
    .hot-key
      margin: 0 20px 10px 20px
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
    .search-history
      margin: 0 20px
      .title
        display: flex
        align-items: center
        height: 30px
        font-size: $font-size-medium
        color: $color-text-l
      .text
        flex: 1
      .clear
        extend-click()
        .icon-clear
          font-size: $font-size-medium
          color: $color-text-d
  .suggest-result
    width: 100%
</style>

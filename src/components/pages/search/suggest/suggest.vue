<template>
<div class="suggest">
  <ul class="suggest-list">
    <li class="suggest-item" v-for="(item, index) in suggestList" :key="index" @click="selectItem(item)">
      <div class="icon">
        <i :class="getIconCls(item)"></i>
      </div>
      <div class="name">
        <p class="text" v-html="getContent(item)"></p>
      </div>
    </li>
  </ul>
  <div v-show="this.query && this.suggestList.length === 0" class="no-result-wrapper">
    <p class="no-result-text">抱歉，暂无搜索结果</p>
  </div>
</div>
</template>

<script type="text/ecmascript-6">
import { getSuggest } from '@/api/search'
import { detailType } from 'common/js/config'
import { getSongUrl } from '@/api/song'
import { createDiscSong } from 'common/js/song'
import { handleScrollMixin } from 'common/js/mixin'
import { mapActions } from 'vuex'
const TYPE_SINGER = 'singer'
export default {
  name: 'Suggest',
  mixins: [handleScrollMixin],
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
      getSuggest(query, page).then((res) => {
        let ret = this.suggestList
        if (res.zhida.singername && page === 1) {
          ret.push({...res.zhida, ...{type: TYPE_SINGER}})
        }
        if (res.song && res.song.list && res.song.list.length > 0) {
          this._normSuggestSonglist(res.song.list).then((res) => {
            this.suggestList = ret.concat(res)
          })
        }
      })
    },
    selectItem (item) {
      if (item.type === TYPE_SINGER) {
        this.$router.push({
          path: '/detail',
          query: {
            id: item.singermid,
            type: detailType.singer
          }
        })
      } else {
        this.insertSong(item)
      }
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
        return `${item.name} - ${item.singer}`
      }
    },
    handleScrollToEnd () {
      this.search(this.query, this.page++)
    },
    _normSuggestSonglist (originSonglist) {
      let mids = []
      originSonglist.forEach((song) => {
        mids.push(song.songmid)
      })
      return getSongUrl(mids).then((urls) => {
        let ret = []
        for (let i = 0; i < originSonglist.length; i++) {
          let url = urls[i]
          if (url && url.purl) {
            let songUrl = `http://ws.stream.qqmusic.qq.com/${url.purl}`
            ret.push(createDiscSong(originSonglist[i], songUrl))
          }
        }
        return Promise.resolve(ret)
      })
    },
    ...mapActions([
      'insertSong'
    ])
  },
  watch: {
    query () {
      this.page = 1
      this.suggestList = []
      this.search(this.query, this.page++)
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
      [class^="icon-"]
        font-size: 14px
        color: $color-text-d
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
    .no-result-text
      margin-top: 30px
      text-align: center
      font-size: $font-size-medium-x
      color: $color-text-d
</style>

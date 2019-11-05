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
</div>
</template>

<script type="text/ecmascript-6">
import { getSuggest } from '@/api/search'
import { detailType } from 'common/js/config'
import { getSongUrl } from '@/api/song'
import { createDiscSong } from 'common/js/song'
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
            this._normSuggestSonglist(res.song.list).then((res) => {
              this.suggestList = ret.concat(res)
            })
          }
        })
      }, 10)
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
    insertSong (item) {
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
</style>

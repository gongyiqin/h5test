<template lang="pug">
.langs(v-if="restaurantInfo.languages")
  a(href='#' :class='{active: lang === "cn"}' @click.prevent='setLocale("zh-CN")') 中文简体
  a(href='#' :class='{active: lang === "en"}' @click.prevent='setLocale("en")') English
  a(v-if='restaurantInfo.languages.enabled.ru' href='#' :class='{active: lang === "ru"}' @click.prevent='setLocale("ru")') {{restaurantInfo.languages.enabled.ru}}
  a(v-if='restaurantInfo.languages.enabled.jp' href='#' :class='{active: lang === "jp"}' @click.prevent='setLocale("jp")') {{restaurantInfo.languages.enabled.jp}}
  a(v-if='restaurantInfo.languages.enabled.kr' href='#' :class='{active: lang === "kr"}' @click.prevent='setLocale("kr")') {{restaurantInfo.languages.enabled.kr}}
  a(href='#' :class='{active: lang === "local"}' @click.prevent='setLocale("th")') ไทย
</template>

<script>
import { mapState, mapGetters } from 'vuex'
export default {
  computed: {
    ...mapState(['lang']),
    ...mapGetters(['restaurantInfo'])
  },
  methods: {
    setLocale(lang) {
      this.$i18n.set(lang)
      this.$store.commit('setLang', lang)
    }
  }
}
</script>

<style lang="scss">
@import 'setting';
.langs { text-align: center;
  a { display: inline-block; padding: 3px 10px; color: $white;
    border: 1px solid rgba(255,255,255,.6); margin: 2px 10px; border-radius: 5px;
    font-size: 12px; min-width: 50px; text-align: center;
    &.active { background: $white; color: #251923;}
  }
}
</style>

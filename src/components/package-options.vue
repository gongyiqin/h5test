<template lang="pug">
.package-options
  template(v-if='Object.keys(item.price_array).length')
    .packages.style(v-for='pack, name in item.attributes' :key='name')
      strong {{pack.name[lang]}}
      a(href='#' v-for='spec, key in pack.values' @click.prevent='setPackKey(name, key)' :class='{active: pKey[name] === key}') {{spec.name[lang]}}
  .favorites.style(v-if='Object.keys(item.favorites).length')
    strong {{$t('口味')}}：
    a(href='#' @click.prevent='toggleFavoKey(key)' v-for='favo, key in item.favorites' :class='{active: fKeys.indexOf(key) > -1}') {{favo[lang]}}
  .result <strong>{{$t('已选择')}}：</strong>{{checkedPackageDesc}}{{checkedFavoriteDesc}}
</template>

<script>
import { mapState } from 'vuex'
export default {
  props: {
    item: Object,
    pKey: undefined,
    fKeys: undefined,
  },
  computed: {
    ...mapState(['lang']),
    checkedPackageDesc() {
      let res = ''
      if (this.pKey && Object.keys(this.pKey).length) {
        res = Object.keys(this.pKey).map(key => this.item.attributes[key].values[this.pKey[key]].name[this.lang]).join(', ') + ' '
      }
      return res
    },
    checkedFavoriteDesc() {
      let desc = ''
      if (this.fKeys.length) {
        desc = this.fKeys.map(key => this.item.favorites[key][this.lang]).join(', ')
      }
      return desc
    },
  },
  methods: {
    setPackKey(name, key) {
      this.$emit('package', name, key)
    },
    toggleFavoKey(key) {
      this.$emit('favorite', key)
    },
  }
}
</script>

<style lang="scss">
@import 'setting';
.package-options {
  .style { margin-bottom: 10px;
    strong, a { display: inline-block; vertical-align: middle; padding: 3px 10px; margin: 0 5px 5px 0;}
    strong { padding-left: 0; }
    a { border: 1px solid $grayLighter; color: $grayDark;
      &.active { background: $primary; color: $white; border-color: $primary;}
    }
  }
  .result { margin-top: 20px; border-top: 1px solid $grayLightest; padding-top: 10px;}
}
</style>

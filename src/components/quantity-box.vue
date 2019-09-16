<template lang="pug">
.quantity-box(:class='{"label-by": showLabel}')
  a(href='#' @click.prevent='addToCart'
    v-if='defaultAsButton && (!quantity[item.id] || thisQuantity === 0)'
  ).add-to-button
    span.button.btn-small {{$t('加入购物车')}}
  label(v-if='showLabel && (Object.keys(pKey).length || (fKeys && fKeys.length))') {{packageDesc}}{{favoriteDesc}}
  .icons(v-if='!defaultAsButton || (quantity[item.id] && thisQuantity > 0)')
    a(v-if='quantity[item.id] && thisQuantity > 0' href='#' @click.prevent='changeQuantity("-", item)'): i.iconfont.if-jian
    span(v-if='quantity[item.id] && thisQuantity > 0') {{thisQuantity}}
    a(href='#' @click.prevent='changeQuantity("+", item)'): i.iconfont.if-jia
</template>

<i18n>
加入购物车:
  en: Add
  th: เพิ่มลงในตะกร้าสินค้า
  ru: Добавить в корзину
  kr: 장바구니에 들어가기
  jp: 参加する

该菜品不在当前时间段内:
  en: 'The dish is not in the current period！'
  th: อาหารนี้ไม่อยู่ในช่วงเวลาให้บริการ
  ru: 'Это блюдо не в данный момент'
  kr: '이 제품은 현재 시간에 없습니다'
  jp: 該料理は現時点では提供できません。

该菜品已售完:
  en: The dish are sold out
  th: สินค้าหมด
  ru: Распродано
  kr: 이 제품은 매진되었습니다
  jp: 該料理は売り切れました。

该菜品已下线:
  en: 'The dish has been off the menu'
  th: รายการนี้ยกเลิกจำหน่าย
  ru: Это блюдо уже офлайн
  kr: 이 제품은 오프라인 되었습니다
  jp: 該料理はキャンセルしました。
</i18n>

<script>
import { mapState, mapGetters } from 'vuex'
export default {
  props: {
    showLabel: false,
    defaultAsButton: false,
    item: Object,
    pKey: Object,
    fKeys: Array,
  },
  computed: {
    ...mapState(['lang', 'tableId']),
    ...mapGetters(['quantity']),
    needConfirm() {
      return Object.keys(this.item.price_array).length || Object.keys(this.item.favorites).length
    },
    packageDesc() {
      let res = ''
      if (this.pKey && Object.keys(this.pKey).length) {
        res = Object.keys(this.pKey).map(key => this.item.attributes[key].values[this.pKey[key]].name[this.lang]).join(', ') + ' '
      }
      return res
    },
    favoriteDesc() {
      let desc = ''
      if (this.fKeys && this.fKeys.length) {
        desc = this.fKeys.map(key => this.item.favorites[key][this.lang]).join(', ')
      }
      return desc
    },
    thisQuantity() {
      let num = 0
      let quantityItem = this.quantity[this.item.id]
      if (quantityItem) {
        if (quantityItem.items) {
          let item = quantityItem.items.find(it => {
            return this.isPackageEqual(it.package, this.pKey) && (it.favorites || []).concat().sort().join(',') === (this.fKeys || []).concat().sort().join(',')
          })
          num = item ? item.quantity : 0
        } else num = this.quantity[this.item.id].total
      }
      return num
    }
  },
  methods: {
    menuNoperiod() {
      this.$vux.alert.show({
        title: this.$t('提示'),
        content: this.$t('该菜品不在当前时间段内'),
      })
    },
    menuAreadyDown() {
      this.$vux.alert.show({
        title: this.$t('提示'),
        content: this.$t('该菜品已下线'),
      })
    },
    menuSoldOut() {
      this.$vux.alert.show({
        title: this.$t('提示'),
        content: this.$t('该菜品已售完'),
      })
    },
    isPackageEqual(a, b) {
      let res = true
      if (a === b) return res
      if (Object.keys(a || {}).length === Object.keys(b || {}).length) {
        for (let key in a) {
          if (a[key].toString() !== b[key].toString()) res = false
        }
      } else res = false
      return res
    },
    addToCart() {
      if (!this.item.inCurrent && this.item.period.length !== 0) {
        this.menuNoperiod()
        return false
      } else if (this.item.status === 'op') {
        this.menuSoldOut()
        return false
      } else if (this.item.status === 'status') {
        this.menuAreadyDown()
        return false
      }
      this.changeNow(1)
    },
    changeQuantity(type) {
      if (!this.item.inCurrent && this.item.period.length !== 0) {
        this.menuNoperiod()
        return false
      } else if (this.item.status === 'op') {
        this.menuSoldOut()
        return false
      } else if (this.item.status === 'status') {
        this.menuAreadyDown()
        return false
      }
      if (this.needConfirm) {
        if (this.pKey || this.fKeys) this.changeNow(type === '+' ? 1 : -1)
        else this.$emit('confirm', this.item)
        return
      }
      this.changeNow(type === '+' ? 1 : -1)
    },
    changeNow(quantity) {
      // console.log('pKey, fKeys', this.pKey, this.fKeys)
      let data = {menu_id: this.item.id, quantity}
      if (this.needConfirm) {
        if (this.pKey && Object.keys(this.pKey).length) data.package = this.pKey
        if (this.fKeys && this.fKeys.length) data.favorites = this.fKeys
      }
      this.$http.post(`tables/${this.tableId}/menu`, data).then(({body}) => {
        this.$store.commit('updateCartMenu', body.data) // 更新购物车菜品，购物车会自动更新 quantity 数据
      })
    },
  }
}
</script>

<style lang="scss">
.quantity-box {
  .add-to-button { display: inline-block; padding: 4px 0 3px; }
  .icons {
    label, a, span { display: inline-block; vertical-align: middle;}
    a { padding: 8px 10px;
      i.iconfont { font-size: 22px;}
    }
    span { padding-top: 2px; color: #000; line-height: 20px;}
  }
  &.label-by { display: flex; flex-direction: row; justify-content: space-between; align-items: center;}
}
</style>

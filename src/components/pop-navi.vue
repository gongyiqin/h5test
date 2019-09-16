<template lang="pug">
.pop-navi
  a(href='#' @click.prevent='toggleMainNavi').btn-navi: i.iconfont.if-daohang
  .shade(v-show='isShow' @click='toggleMainNavi')
  .main-navi(v-show='isShow')
    router-link(:to='"/restaurants/" + restaurantInfo.id') <i class="iconfont if-shouye"></i>{{$t('首页')}}
    router-link(to='/ucenter/orders') <i class="iconfont if-chakandingdan"></i>{{$t('查看订单')}}
    router-link(to='/ucenter') <i class="iconfont if-huiyuanzhongxin"></i>{{$t('会员中心')}}
    a(href='#' @click.prevent='toggleMainNavi') <i class="iconfont if-fanhui"></i>{{$t('取消')}}
</template>

<i18n>
首页:
  en: Home
  th: หน้าแรก
  ru:  Главная страница
  kr: 홈페이지
  jp: トップページ

查看订单:
  en: Orders
  th: รายการที่สั่ง
  ru:  Посмотреть заказ
  kr: 주문 확인
  jp: 注文書を確認します

会员中心:
  en: Account
  th: สมาชิก
  ru: Центр члена
  kr: 회원 센터
  jp: 会員センター

取消:
  en: Close
  th: ยกเลิก
  ru: Отменить
  kr: 취소
  jp: キャンセル

</i18n>

<script>
import { mapGetters } from 'vuex'
export default {
  data() {
    return {
      isShow: false,
    }
  },
  computed: {
    ...mapGetters(['restaurantInfo']),
  },
  methods: {
    toggleMainNavi() {
      this.isShow = !this.isShow
    }
  }
}
</script>

<style lang="scss">
@import 'setting';
.pop-navi {
  .btn-navi {
    i {
      @include icon-circle(60px, 32px, $white, $grayDark)
    }
  }
}
</style>

<template lang="pug">
.page.page-order-detail
  .block
    h2 {{item.restaurant_name[lang]}}
    .metas
      span {{$t('餐桌')}}：<em>{{item.info.table_code}}</em>
      span {{$t('用餐人数')}}：<em>{{item.info.pers}}</em>
      span {{$t('下单时间')}}：<em>{{item.created_at}}</em>
      span {{$t('订单号')}}：{{item.order_no}}
      span.invoice(v-if='item.invoice') {{item.invoice}}
    ul.prices(v-if='item.info.price')
      li
        span {{$t('小计')}}
        span {{item.info.price.toFixed(2)}}
      li(v-if='item.info.service_charge_rate')
        span {{$t('服务费（{rate}%）', {rate: parseInt(item.info.service_charge_rate * 1000) / 10})}}
        span {{item.info.service_charge.toFixed(2)}}
      li
        span {{$t('消费税（{rate}%）', {rate: parseInt(item.info.tax_rate * 1000) / 10})}}
        span {{item.info.tax.toFixed(2)}}
      li(v-if='item.info.discount')
        span {{$t('优惠')}}
        span {{item.info.discount.toFixed(2)}}
      li
        span
        em {{$t('合计')}}：{{item.pay_price.toFixed(2)}}

  .block
    h2 {{$t('菜单详情')}}
    .commits
      .commit(v-for='commit in item.commits' :key='commit.id' :class='"status-"+commit.status')
        p.status
          span.time <strong>{{$t('下单时间')}}：</strong>{{commit.created_at}}
          span {{$t('orderStatus.' + commit.status)}}
        p.invoice(v-if='commit.invoice') <string>{{$t('发票信息')}}：</string>{{commit.invoice}}
        ul
          li(v-for='it in commit.order_items' :key='it.id').cf
            router-link(:to='`/restaurants/${item.restaurant_id}/tables/${item.table_id}/${it.menu_id}`').item
              img(:src='it.thumb_url')
              .infos
                h4 {{it.info.name[lang]}}
                em {{it.price}}<small>{{$t('price-unit')}}/{{$t('units.' + (it.unit || 'dish'))}}</small>
                p.options
                  span {{$t('数量')}}：{{it.quantity}}
                  span(v-if='it.package') {{packageDesc(it)}}
                  span(v-if='Object.keys(it.info.favorites).length') {{$t('口味')}}：{{optionDesc(it)}}

  .actions
    router-link(:to='item.status === "open" ? `/restaurants/${item.restaurant_id}/tables/${item.table_id}?passcode=${item.info.passcode}` : `/restaurants/${item.restaurant_id}`').button {{$t('继续点餐')}}
    router-link(:to='`/restaurants/${item.restaurant_id}`').button.btn-hollow {{$t('返回首页')}}
</template>

<i18n>

优惠:
  en: Discount
  th: ลดราคา
  ru:  Скидка
  kr: 쿠폰
  jp: 割引

服务费（{rate}%）:
  en: Service charge（{rate}%）
  th: ค่าบริการ（{rate}%）
  ru: Сервисный сбор（{rate}%）
  kr: 서비스 비용（{rate}%）
  jp: サービス料（{rate}%）

消费税（{rate}%）:
  en: Tax rate（{rate}%）
  th: ภาษี（{rate}%）
  ru: Налог на потребление（{rate}%）
  kr: 소비세（{rate}%）
  jp: 消費税（{rate}%）

合计:
  en: Total：
  th: รวม
  ru: Итого
  kr: 합계
  jp: 合計

菜单详情:
  en: Detail
  th: รายละเอียดรายการอาหาร
  ru: Детали меню
  kr: 메뉴 확인
  jp: メニューの詳しい情況
</i18n>

<script>
import { mapState, mapGetters } from 'vuex'
export default {
  data() {
    return {
      item: {id: 0, restaurant_name: {}, info: {}},
    }
  },
  computed: {
    ...mapState(['lang']),
    ...mapGetters(['restaurantInfo']),
  },
  created() {
    this.getDetail()
  },
  methods: {
    packageDesc(it) {
      let attributes = it.menu.options.attributes
      return it.package ? Object.keys(it.package).map(pak => attributes[pak].values[it.package[pak]].name[this.lang]).join(', ') : ''
    },
    optionDesc(it) {
      let favorites = it.menu.options.favorites
      return it.favorites && it.favorites.length ? it.favorites.map(fav => favorites[fav][this.lang]).join(', ') : ''
    },
    getDetail() {
      this.$http.get(`orders/${this.$route.params.order_id}`).then(({body}) => {
        this.item = body.data
      })
    }
  }
}
</script>

<style lang="scss">
@import 'setting';
.page-order-detail {
  .block { padding: 15px; }
  h2 { text-align: center; padding: 0 0 15px; border-bottom: 1px solid $grayLightest; margin-bottom: 20px;
    font-size: 22px;
  }
  .metas {
    span { display: block; padding: 3px 0; }
  }
  .prices { border-top: 1px solid $grayLighter; padding-top: 15px; margin-top: 15px;
    li { display: flex; flex-direction: row; justify-content: space-between;
      border-top: 1px solid $grayLightest; padding: 10px 0;
      &:first-child { border-top: none }
    }
  }
  .actions { padding: 0 15px 15px;
    a { display: block; margin-top: 15px; }
  }

  .commits {
    .commit { margin-top: 10px; border-top: 1px solid $grayLighter; padding-top: 20px;
      &:first-child { border-top: none; margin-top: 0; padding-top: 0; }
      // &.status-confirmed {
      //   .status { background: #43C600; color: $white; }
      // }
      .invoice { font-size: 12px; padding: 10px 0; }
    }
    .status { display: flex; justify-content: space-between; padding: 8px 15px; margin-bottom: 10px;
      border-radius: 20px; background: $grayLightest; font-size: 12px;
    }
    li {
      a.item { color: $grayDarker; }
      img { float: left; width: 50px; height: 50px; margin-top: 10px; border-radius: 5px; display: block; }
      .infos { margin-left: 60px; min-height: 50px;
        border-top: 1px solid $grayLightest; padding: 10px 0;
        em { float: right; }
        h4 { margin-bottom: 3px; }
        .options { font-size: 12px; color: $gray;
          span { display: inline-block; margin-right: 15px; }
        }
      }
      &:first-child .infos { border-top: none; }
    }
  }
}
</style>

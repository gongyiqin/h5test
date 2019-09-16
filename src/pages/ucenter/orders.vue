<template lang="pug">
.page.page-orders
  .block.order-list(v-if='list.length')
    ul
      li(v-for='item in list'): router-link(:to='`/orders/${item.id}`')
        h4 {{item.restaurant_name[lang]}}
        .metas
          span {{$t('订单号')}}：{{item.id}}
          span {{$t('日期')}}：{{item.created_at}}
        .price: em {{item.pay_price.toFixed(2)}}{{$t('price-unit')}}
    .btn-line(v-if='last_page > current_page')
      a(href='#' @click.prevent='loadNextPage') {{$t('加载更多')}}
  .empty-note(v-else)
    p {{inited ? $t('看起来您还没有订单呢。') : $t('请稍等')}}

</template>

<i18n>
看起来您还没有订单呢。:
  en: no orders。
  th: ท่านยังไม่มีการสั่งค่ะ
  ru: Похоже, что у вас еще нет заказов.
  kr: 아직 주문하지 않습니다
  jp: 貴方はまだ注文してないようです。
</i18n>

<script>
import { mapState } from 'vuex'
export default {
  data() {
    return {
      inited: false,
      list: [],
      current_page: 0,
      last_page: 0,
    }
  },
  computed: {
    ...mapState(['lang']),
  },
  created() {
    this.getList()
  },
  methods: {
    loadNextPage() {
      this.getList(this.current_page + 1)
    },
    getList(page = 1) {
      this.$http.get('orders', {params: {page}}).then(({body}) => {
        this.inited = true
        this.current_page = body.data.current_page
        this.last_page = body.data.last_page
        if (body.data.data.length) {
          this.list = page === 1 ? body.data.data : this.list.concat(body.data.data)
        }
      })
    }
  }
}
</script>

<style lang="scss">
@import 'setting';
.page-orders {
  .order-list {
    a { display: block; color: $grayDarker; }
    ul { padding-left: 10px; }
    li { padding: 10px 10px 10px 0; border-top: 1px solid $grayLightest;
      &:first-child { border-top: none; }
      h4 { margin-bottom: 5px; font-size: 18px; font-weight: normal; }
      .metas { font-size: 12px; color: $gray;
        span { display: block; padding: 2px 0; }
      }
      position: relative;
      .price { position: absolute; bottom: 10px; right: 40px;}
    }
  }
  .empty-note { min-height: 100px; }
}
</style>

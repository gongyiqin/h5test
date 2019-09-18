<template lang="pug">
  .page.page-cart
    .restaurant-infos
      h1 {{restaurantInfo.name[lang]}}
      ul.table
        li {{$t('餐桌')}}：<em>{{table.name[lang]}}</em>
        li {{$t('用餐人数')}}：<em>{{pers}}</em>
      textarea(v-model='invoice' :placeholder='$t("备注")')
    .menu-list
      h1 {{$t('已选菜品')}}

      ul(v-if='cartItems.menu && Object.keys(cartItems.menu).length')
        li(v-for='item, key in cartItems.menu' :key='key').cf
          router-link(:to='`/restaurants/${restaurantInfo.id}/tables/${tableId}/${item.menu_id}`').item
            img(:src='menuMap[item.menu_id].thumb_url')
            .infos
              h4 {{menuMap[item.menu_id].name[lang]}}
              p.options(v-if='item.package || (item.favorites && item.favorites.length)')
                span(v-if='item.package') {{$t('规格')}}：{{packageDesc(item)}}
                span(v-if='item.favorites && item.favorites.length') {{$t('口味')}}：{{optionDesc(item)}}
              .prices
                em {{item.price}}<small>{{$t('price-unit')}}/{{$t('units.' + item.unit)}}</small>
                del(v-if='item.normal_price') {{item.normal_price}}{{$t('price-unit')}}
          quantity-box(:item='menuMap[item.menu_id]' :p-key='item.package' :f-keys='item.favorites')
      .empty-note(v-else)
        p {{cartItems.loading ? $t('请稍等...') : $t('看起来您还没有选择任何菜品呢？')}}
      .sum-prices(v-if='cartItems.price')
        small(v-if='sumPrice.normal_price > sumPrice.price') {{$t('已优惠')}}：{{(sumPrice.normal_price - sumPrice.price).toFixed(2)}}{{$t('price-unit')}}
        span {{$t('合计')}}：<em>{{sumPrice.price.toFixed(2)}}{{$t('price-unit')}}</em>

    .actions
      pop-navi
      a(href='#' @click.prevent='checkCart(cartItems.order_id)').btn-book <i class="iconfont if-xiadanqueren"></i>

    div.divBG(v-if="orderInfoStatus" @click="cancel")
    transition
      div.order_info(v-if="orderInfoStatus")
        div.column.justify-between
          span {{ $t('订单详情') }}
          div.row {{ $t('商户:') }} <em>{{restaurantInfo.name.cn}}</em>
          div.row {{ $t('金额:') }} <em>{{ cartItems.price }} {{  $t('THB') }}</em>
          button(@click="bookNow").btn {{ $t('确认支付') }}
</template>

<i18n>
  '请先选择菜品，谢谢':
  en: 'Please select menu first'
  th: 'กรุณาเลือกอาหารก่อน ขอบคุณค่ะ'
  ru: 'Пожалуйста, сначала попробовать блюдо, спасибо'
  kr: '메뉴부터 선택하십시오. 감사합니다.'
  jp: '先に料理を選んでください、ありがとうございます'

  '看起来您还没有选择任何菜品呢？':
  en: 'Please select menu first'
  th: 'ท่านยังไม่ได้สั่งอาหารค่ะ'
  ru: 'Кажется, вы еще не выбрали ни одного блюда?'
  kr: '아직 메뉴를 선택하지 않습니다.'
  jp: '貴方はまだどんな料理も注文してないようですが？'

  备注:
  en: Remarks
  th: หมายเหตุเพิ่มเติม
  ru: замечания
  kr: 비고
  jp: 備考

  '您选择的{menuName}时间段发生了变化 ,请重新选择':
  en: 'The {menuName} time period you selected has changed, please re-select.'
  th: '{menuName}ที่ท่านเลือก  ไม่อยู่ในช่วงเวลาให้บริการ  กรุณาเลือกใหม่'
  ru: 'Выбранный вами период {menuName} изменён. Повторите выбирать.'
  kr: '당신이 선택한 {menuName} 시간이 변화가 생겼으므로 다시 선택해 주세요'
  jp: 'あなたは選択した{menuName}期間に変更があるので、新たにご選択ください。'

  '您选择的{menuName}价格发生了变化':
  en: 'The {menuName} price you selected has changed.'
  th: '{menuName}ที่ท่านเลือก  ราคาถูกเปลี่ยนแปลง'
  ru: 'Выбранные вами {menuName} цены изменились.'
  kr: '당신이 선택한{menuName}가격이 변화가 생겼습니다'
  jp: 'あなたは選択した{menuName}値段は変更しました。'

  '您选择的{menuName}已下线':
  en: 'The {menuName} you selected has been off the menu.'
  th: '{menuName}ที่ท่านเลือก  ยกเลิกจำหน่าย'
  ru: 'Выбранные вами {menuName} уже офлайн.'
  kr: '당신이 선택한 {menuName} 이미 오프라인 되었습니다'
  jp: 'あなたは選択した{menuName}がおフランにしました。'
</i18n>

<script>
  import { mapState, mapGetters } from 'vuex'
  import QuantityBox from '../../components/quantity-box'
  import PopNavi from '../../components/pop-navi'

  export default {
    components: {
      QuantityBox,
      PopNavi,
    },
    data() {
      // console.log('window.menuMap', window.menuMap)
      return {
        menuMap: window.menuMap,
        invoice: '',
        orderInfoStatus: false,
        item: {id: 0, restaurant_name: {}, info: {}},
      }
    },
    computed: {
      ...mapState(['lang', 'tableId', 'pers']),
      ...mapGetters(['restaurantInfo', 'cartItems', 'quantity']),
      table() {
        return this.restaurantInfo.tables.find(table => table.id === Number(this.tableId))
      },
      sumPrice() {
        let sum = {price: 0, normal_price: 0}
        Object.keys(this.quantity).forEach(key => {
          // let quantity = this.quantity[key]
          // console.log('quantity >>>>> ', quantity, key)
          (this.quantity[key].items || [this.quantity[key].item]).forEach(it => {
            sum.normal_price += (it.normal_price || it.price) * it.quantity
            sum.price += it.price * it.quantity
          })
        })
        return sum
      },
    },
    created() {
      this.$store.dispatch('initCartItems')
      console.log(this.restaurantInfo)
      console.log(this.cartItems)
      console.log(this.quantity)
    },
    methods: {
      packageDesc(item) {
        const goods = this.menuMap[item.menu_id]
        let res = ''
        if (item.package) {
          res = Object.keys(item.package).map(key => goods.attributes[key].values[item.package[key]].name[this.lang]).join(', ') + ' '
        }
        return res
      },
      optionDesc(item) {
        const goods = this.menuMap[item.menu_id]
        return item.favorites.map(key => goods.favorites[key][this.lang]).join(', ')
      },
      checkCart() {
        if (!this.cartItems || !Object.keys(this.cartItems.menu).length) {
          this.$vux.alert.show({title: this.$t('提示'), content: this.$t('请先选择菜品，谢谢')})
          return
        }
        this.orderInfoStatus = true
      },
      cancel() {
        this.orderInfoStatus = false
      },
      bookNow() {
        this.orderInfoStatus = false
        this.$http.get(`tables/${this.tableId}/check_cart`, {}).then(({body}) => {
          if (body.data.length > 0) {
            body.data.map(res => {
              if (res.type === 'period') {
                this.$vux.alert.show({
                  title: this.$t('提示'),
                  content: this.$t('您选择的{menuName}时间段发生了变化 ,请重新选择', {menuName: res.name[this.lang]})
                })
              } else if (res.type === 'price') {
                this.$vux.alert.show({
                  title: this.$t('提示'),
                  content: this.$t('您选择的{menuName}价格发生了变化', {menuName: res.name[this.lang]})
                })
              } else if (res.type === 'status') {
                this.$vux.alert.show({
                  title: this.$t('提示'),
                  // eslint-disable-next-line no-template-curly-in-string
                  content: this.$t('您选择的{menuName}已下线', {menuName: res.name[this.lang]})
                })
              }
            })
            this.$store.dispatch('initCartItems')
          } else {
            if (!this.cartItems || !Object.keys(this.cartItems.menu).length) {
              this.$vux.alert.show({title: this.$t('提示'), content: this.$t('请先选择菜品，谢谢')})
              return
            }
            this.$http.post(`tables/${this.tableId}/order`, {
              lang: this.lang,
              invoice: this.invoice,
            }).then(({body}) => {
              this.$store.dispatch('initCartItems') // 更新购物车
              if (body.data && body.data.id) this.$router.replace('/order-result/' + body.data.id)
            })
          }
        })
      },
    }
  }
</script>

<style lang="scss">
  @import 'setting';
  .page-cart {
    .restaurant-infos,
    .menu-list { margin: 15px; background: $white; border-radius: 5px; padding: 10px; color: $grayDarker;}
    h1 { font-size: 22px; text-align: center; border-bottom: 1px solid $grayLighter;
      padding: 10px 0 20px; margin-bottom: 10px;
    }

    .restaurant-infos {
      li { padding: 5px 0; }
      textarea { border: 1px solid $grayLighter; border-radius: 3px; padding: 8px 6px; box-sizing: border-box;
        width: 100%; height:6em; margin: 10px 0;
      }
    }
    .menu-list {
      a.item { color: $grayDarkest; }
      img { float: left; width: 65px; height: 65px; margin-top: 10px; border-radius: 3px; }
      .infos { margin-left: 75px; min-height: 65px; padding: 10px 0; border-top: 1px solid $grayLightest;
        .options { font-size: 12px;
          span { display: inline-block; margin-right: 10px; }
        }
      }
      li { position: relative;
        &:first-child .infos { border-top: none; }
      }
      .quantity-box { position: absolute; bottom: 2px; right: 2px; }
      .prices {
        em, del { display: inline-block; }
        del { font-size: 10px; color: $gray; margin-left: 10px; }
      }
    }
    .sum-prices { text-align: right; margin-top: 15px; padding: 15px 0; border-top: 1px solid $grayLightest;
      small, span { display: inline-block; }
      small { font-size: 12px; color: $gray; }
      span { margin-left: 15px; }
      em { font-size: 20px; }
    }
    .actions { padding: 5px 15px 15px; display: flex; flex-direction: row; justify-content: space-between;
      .btn-book {
        i { @include icon-circle(60px, 32px, $white, #7589AC);}
      }
    }
  }
  .order_info{
    position: fixed;
    width: 300px;
    height: 150px;
    background-color: #ffffff;
    left: 0;
    right: 0;
    margin: 0 auto;
    top: 300px;
    z-index: 30;
    color: black;
    padding: 8px 16px;
    border-radius: 5px;
  }
  .order_info span {
    font-size: 20px;
    font-weight: bold;
  }
  .order_info li {
    font-size: 16px;
    font-weight: normal;
    color: #666;
  }
  .divBG{
    background: #000000;
    position: fixed;
    left: 0px;
    top: 0px;
    width: 100%;
    height: 100%;
    z-index: 20;
    filter: alpha(opacity=60);
    opacity: 0.5 !important;
    border: 1px solid red;
  }
  .column{
    em{color: #666}
    display: flex;
    flex-direction: column;
  }
  .row{
    display: flex;
    flex-flow: row;
    justify-content: space-between;
    margin: 5px 0;
  }
  .btn{
    background-color: green;
    border: none;
    height: 30px;
    color: #ffffff;
    border-radius: 5px;
    margin-top: 5px;
    text-align: center;
    line-height: 30px;
  }
  .justify-between{
    justify-content: space-between;
  }
  .v-enter,
  .v-leave-to{
    opacity: 0;
  }
  .v-enter-active,
  .v-leave-active{
    transition: all 0.4s ease;
  }
</style>

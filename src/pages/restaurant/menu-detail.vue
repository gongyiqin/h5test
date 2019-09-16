<template lang="pug">
.page.page-menu-detail
  .cover
    img(:src='item.cover_url')
  .infos
    h1 {{item.name[lang]}}
    .prices
      em {{_activePKey ? item.price_array[_activePKey].price : item.price}}<small>{{$t('price-unit')}}/{{$t('units.' + item.unit)}}</small>
      del(v-if='item.normal_price') {{_activePKey ? item.price_array[_activePKey].normal_price : item.normal_price}}{{$t('price-unit')}}
  .add-cart-box
    package-options(v-if='hasOptions' :item='item' :p-key='activePKey' :f-keys='activeFKeys'
      @package='setPackKey' @favorite='toggleFavoKey'
    )
    quantity-box(:item='item' :defaultAsButton='true' :p-key='activePKey' :f-keys='activeFKeys')
    span.note {{$t('如有特殊要求，请与服务员沟通。')}}

    //- .quantities(v-if='quantity[item.id] && quantity[item.id].items && quantity[item.id].items.length')
      h4 {{$t('已选择规格及口味')}}
      quantity-box(v-for='it, key in quantity[item.id].items' :key='key' :show-label='true'
        :p-key='it.package' :f-keys='it.favorites' :item='item'
      )

    .content
    h2 {{$t('菜品介绍')}}
    .content-html(v-html='item.content[lang]')

  .periodTime
    div(v-if="item.period.length!==0")
      h2 {{$t('销售时间段')}}
        ul
          li(v-for="item in item.period" )
            h3 {{item.start}}-{{ item.end }}


</template>

<i18n>

如有特殊要求，请与服务员沟通。:
  en: Any special request, please ask for waiter
  th: ถ้าต้องการเป็นพิเศษ ติดต่อพนักงานได้
  ru: Если у вас есть особые требования, пожалуйста, свяжитесь с официантом.
  kr: 필요하시면 서빙에게 얘기하십시오.
  jp: もし特殊な要求が有れば、従業員と交流してください。

已选择规格及口味:
  en: Selected Packages and Tasts
  th: ได้เลือกขนาดและรสชาติสำเร็จ
  ru: Характеристики и вкусы были выбраны
  kr: 선택한 규격과 입맛
  jp: 既に選んで居た規格と好み

菜品介绍:
  en: Introduce
  th: ข้อมูลอาหาร
  ru:  Представление блюд
  kr: 메뉴 소개
  jp: 料理紹介
</i18n>

<script>
import { mapState, mapGetters } from 'vuex'
import QuantityBox from '../../components/quantity-box'
import PackageOptions from '../../components/package-options'

export default {
  components: {
    QuantityBox,
    PackageOptions,
  },
  data() {
    let id = Number(this.$route.params.menu_id)
    let item = window.menuMap[id]
    // console.log('window.menuMap', window.menuMap, id, item)
    let hasOptions = Object.keys(item.price_array).length || Object.keys(item.favorites).length
    let activePKey = {}
    let priceKeys = Object.keys(item.price_array)
    if (priceKeys.length) {
      let keys = priceKeys[0].split('_')
      for (let i = 0; i < keys.length; i++) {
        let kV = keys[i].split(':')
        activePKey[kV[0]] = kV[1]
      }
    }

    return {
      id,
      activePKey,
      activeFKeys: [],
      item,
      hasOptions,
    }
  },
  computed: {
    ...mapState(['lang', 'tableId']),
    ...mapGetters(['quantity', 'restaurantInfo']),
    _activePKey() {
      let keys = Object.keys(this.activePKey)
      return keys.length ? keys.map(key => key + ':' + this.activePKey[key]).join('_') : ''
    },
  },

  methods: {
    setPackKey(name, key) {
      this.activePKey[name] = key
      // console.log('this.activePKey', this.activePKey)
    },
    toggleFavoKey(key) {
      let i = this.activeFKeys.indexOf(key)
      if (i > -1) this.activeFKeys.splice(i, 1)
      else this.activeFKeys.push(key)
    },
  }
}
</script>

<style lang="scss">
@import 'setting';
.page-menu-detail { padding: 15px;
  h1 { margin: 10px 0; font-size: 20px; }
  .cover {
    img { border-radius: 5px; }
  }
  .infos { margin-bottom: 20px; }

  .add-cart-box { border-top: 1px solid rgba(255,255,255,.2); padding-top: 15px;
    border-bottom: 1px solid rgba(255,255,255,.2); padding-bottom: 15px;
    .result { margin: 15px 0 20px; border-top: 1px dashed rgba(255,255,255,.2); }
    .note { display: block; padding: 10px 0; color: #9B9893; }
    .package-options {
      .style {
        a { border-color: rgba(255,255,255,.5); color: #FFF; margin-right: 10px; }
      }
    }
    .quantity-box {
      span { color: $white; }
      .icons { margin-left: -10px; }
    }
    .quantities { background: rgba(0,0,0,.2); border-radius: 5px;
      h4 { padding: 10px 0; text-align: center; border-bottom: 1px solid rgba(255,255,255,.1);}
      .quantity-box { border-bottom: 1px solid rgba(255,255,255,.1); margin: 0 10px;
        &:last-child { border-bottom: none; }
      }
    }
  }

  .prices {
    em { font-size: 22px;
      small { font-size: 12px; }
    }
    del { margin-left: 10px; font-size: 12px; color: rgba(255,255,255,.6);}
  }

  .content { margin-top: 20px; white-space:pre-wrap;
    h2 { margin-bottom: 10px; }
  }
  .periodTime {
    h2 { margin-top: 15px; }
    ul { font-size: 12px; margin-bottom: 8px; margin-top: 8px; }
    li { margin-bottom: 8px; margin-top: 8px; }
  }
}
</style>

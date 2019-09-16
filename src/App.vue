<template lang="pug">
  #app.app(:class='[pageMetas.class, "plat-" + platform]', :style='{paddingTop: hideHeaderBar ? 0 : "46px"}')
    //- view-box(:body-padding-top='hideHeaderBar ? 0 : "46px"').view-box
    x-header(:left-options='leftOptions',
      :title='$t(pageMetas.title)',
      :class='{"hollow": pageMetas.hollowNavbar}',
      v-show='!hideHeaderBar'
      ref='headerbar'
    ).header-bar
      .header-right-actions(slot='right' v-if='hasHeaderAction')
        template(v-if='headerActions.length')
          template(v-for='action in headerActions')
            component(v-if='action.component', :is='action.component', :props='action.props')
            a(v-else href='#' @click.prevent='action.action')
              i.iconfont(v-if='action.icon', :class='"fi-" + action.icon')
              span(v-if='action.label') {{action.label}}
    //- transition(:name='"vux-pop-" + (direction === "forward" ? "in" : "out")')
    router-view.router-view(:style='{minHeight: mainHeight}')
    message
</template>

<i18n>
提示:
  en: Tips
  th: การเตือน
  ru:  Подсказка
  kr: 주의
  jp:  ご注意

请稍等...:
  en: Please wait...
  th: โปรดรอสักครู่
  ru:  Пожалуйста, подождите...
  kr: 잠시만요…
  jp:  少々お待ち下さい...

泰铢:
  en: THB
  th: THB
  ru:  Тайский бат
  kr: 타이 밧
  jp:  バーツ

发票信息:
  en: 'Invoice'
  th: ข้อมูลใบเสร็จ
  ru:  Информация о счет-фактуре
  kr: 영수증 정보
  jp:  領収書の情報

数量:
  en: 'Qty'
  th: จำนวน
  ru:  Количество
  kr: 수량
  jp:  数量

规格:
  en: 'Package'
  th: ขนาด
  ru:  Технические характеристики
  kr: 규격
  jp:  規格

口味:
  en: 'Tast'
  th: รสชาติ
  ru:  Вкус
  kr: 입맛
  jp:  好み

餐桌:
  en: 'Tbl'
  th: 'Tbl'
  ru:  Обеденный стол
  kr: 식탁
  jp:  食卓

用餐人数:
  en: 'Pers'
  th: 'Pers'
  ru: Количество людей, которые едят
  kr: 식사 인원수
  jp: 食事人数

已选菜品:
  en: Selected
  th: อาหารที่สั่ง
  ru: Избранные блюда
  kr: 선택한 메뉴
  jp: 選んだ料理

已选择:
  en: Selected
  th: เลือกเรียบร้อย
  ru: Выбрано
  kr: 이미 선택한 옵션
  jp: 選びました

订单号:
  en: 'Order No'
  th: 'Order No'
  ru:  Номер заказа
  kr: 주문 번호
  jp:  注文書番号

下单时间:
  en: 'Time'
  th: 'Time'
  ru:  Время заказа
  kr: 주문 시간
  jp:  注文書時間

日期:
  en: 'Date'
  th: 'Date'
  ru:  Дата
  kr: 날짜
  jp:  日付

加载更多:
  en: Loading more
  th: โหลดเพิ่มเติม
  ru:  Загрузить больше
  kr: 더 많이 보기
  jp:  更に多くの情報をロードします

小计:
  en: Total
  th: Total
  ru:  Итого
  kr: 합계
  jp:  合計

继续点餐:
  en: Continue
  th: สั่งอาหารต่อไป
  ru:  Продолжить заказать блюдо
  kr: 계속 주문하기
  jp:  引き続き料理を注文します

返回首页:
  en: Back to Home
  th: กลับไปหน้าแรก
  ru:  Вернуться на главную страницу
  kr: 홈페이지로 돌아가기
  jp:  トップページに戻ります

PageTitle.Home:
  zh-CN: 首页
  en: Home
  th: Home
  ru:  Главная страница
  kr: 홈페이지
  jp:  トップページ

PageTitle.RestaurantDetail:
  zh-CN: 商户详情
  en: Restaurant home page
  th: Restaurant home page
  ru:  Бизнес детали
  kr: 가게 소개
  jp:  店舗の詳しい情況

PageTitle.RestaurantTables:
  zh-CN: 选择桌号及人数
  en: Select your seat
  th: เลือกหมายเลขโต๊ะและจำนวนคน
  ru:  Выбрать номер стола и количество человек
  kr: 테이블 번호 및 인원수
  jp:  テーブル番号と人数を選びます

PageTitle.RestaurantMenu:
  zh-CN: 选择菜品
  en: Order food
  th: เสือกอาหาร
  ru:  Выбрать блюдо
  kr: 메뉴 선택
  jp:  料理を選びます

PageTitle.MenuDetail:
  zh-CN: 菜品详情
  en: Detail
  th: คำแนะนำอาหาร
  ru:  Детали еды
  kr: 메뉴 소개
  jp:  料理の詳しい情況

PageTitle.Cart:
  zh-CN: 购物车
  en: Cart
  th: ตะกร้าสินค้า
  ru:  Корзина покупок
  kr: 장바구니
  jp:  ショッピングカート

PageTitle.OrderResult:
  zh-CN: 订单处理中
  en: Processing
  th: กำลังจัดการใบสั่งอยู่
  ru:  Обработка заказов
  kr: 주문 처리 중
  jp:  注文書の処理中

PageTitle.OrderDetail:
  zh-CN: 订单详情
  en: Order detail
  th: รายละเอียดที่สั่งอาหาร
  ru:  Детали заказа
  kr: 주문 확인
  jp:  注文書の詳しい情況

PageTitle.UcenterIndex:
  zh-CN: 用户中心
  en: Account
  th: ศูนย์ผู้ใช้
  ru:  Центр пользователя
  kr: 고객 센터
  jp:  ユーザーセンター

PageTitle.UcenterOrders:
  zh-CN: 我的订单
  en: My orders
  th: รายการที่สั่งของฉัน
  ru:  Мой заказ
  kr: 나의 주문
  jp:  私の注文書
</i18n>

<script>
import { mapState, mapGetters } from 'vuex'
import { ViewBox, XHeader } from 'vux'
import Message from './components/message'

export default {
  name: 'app',
  components: {
    ViewBox,
    XHeader,
    Message
  },
  data() {
    let agent = window.navigator.userAgent
    let platform = /(iPhone|iPod|ios)/i.test(agent) ? 'ios' : (/(Android)/i.test(agent) ? 'android' : 'pc')
    return {
      platform,
    }
  },
  computed: {
    ...mapState(['pageMetas', 'headerActions']), // 'direction',
    ...mapGetters(['restaurantInfo']),

    mainHeight() {
      // console.log('mainHeight', window.innerHeight)
      return (this.hideHeaderBar ? window.innerHeight : (window.innerHeight - 46)) + 'px'
    },
    hideHeaderBar() {
      let name = this.$route.name
      return name === 'Home' || name === 'RestaurantDetail'
    },
    hasHeaderAction() {
      return !!Object.keys(this.headerActions).length
    },
    isOnRootPage() {
      // let path = this.$route.path
      // return path === '/'
      let name = this.$route.name
      return name === 'Home' // || name === 'RestaurantDetail'
    },
    leftOptions() {
      return {
        showBack: !this.isOnRootPage
      }
    },
  },

  created() {
    this.$store.dispatch('initUserinfo')
  },
  methods: {

  }
}
</script>

<style lang="scss">
@import 'setting';
body { background-color: #fbf9fe; color: #666; font-size: 14px;}
html, body { height: 100%;}
body { background: #32455F url(/static/images/bg.png) no-repeat 50%;
  background-attachment: fixed;
  background-size: cover; color: $white;
}
.app { min-height: 100%; box-sizing: border-box; width: 100%; position: relative;
  max-width: 750px; margin: 0 auto;
}

h1, h2, h3 { font-weight: normal; line-height: 1.2; }
h1 { font-size: 30px; }

ul { list-style: none;}

em, i { font-style: normal;}
em { color: $primary;}

.cover {
  img { display: block; width: 100%;}
}

.cf {
  &:after { content: ''; height: 0; overflow: hidden; display: block; clear: both;}
}

.block { border-radius: 5px; margin: 15px; background: $white; color: $grayDarker; }

.shade { position: fixed; top: 0; left: 0; right: 0; bottom: 0; background: rgba(0,0,0,.7);}

.inner { padding: 15px 15px 0; }
.empty-note, .waiting-note { color: #888; padding: 20px 15px; text-align: center }
.iconfont { line-height: 1; display: inline-block; vertical-align: middle; }

a { text-decoration: none; color: #FF5000; }
.arrow { display: block; transform: rotate(315deg); border: 1px solid #999; width: 12px; height: 12px;}
.arrow-left { border-width: 1px 0 0 1px; }

.align-c { text-align: center; }
.align-r { text-align: right; }
.align-l { text-align: left; }

.splash-screen { height: 100%; display: flex; flex-direction: column; justify-content: center; align-items: center;
  img { display: block; width: 128px;}
}

.flexCenter { display: flex; flex-direction: column; justify-content: center; align-items: center;}

// .router-view { box-sizing: border-box;}

.button { background: $primary; color: $white; padding: 14px 20px;
  border-radius: 5px; line-height: 1.2;
  display: inline-block; text-align: center;
  &.btn-hollow { padding: 12px 20px; background: none; border: 1px solid rgba(255,255,255,.4); color: rgba(255,255,255,.8);}
  &.btn-main { font-size: 16px; box-shadow: 1px 1px 5px #3D3C3D;}
  &.btn-small { padding: 8px 10px;
    &.btn-hollow { padding: 7px 9px;}
  }
  &.btn-mini { padding: 5px 12px; font-size: 12px; border-radius: 20px;
    &.btn-hollow { padding: 4px 11px;}
  }
}


// reset
.app {
  .weui-tab__panel { padding-bottom: 0; }
  .vux-header { position: fixed; top: 0; left: 0; right: 0; z-index: 1111;
    &.hollow { background: none; }
  }
}

.weui-dialog { color: #333;
  .input { padding: 15px 0; text-align: left;
    label { display: block; margin-bottom: 10px;}
    span { display: block; padding-top: 8px; font-size: 11px;}
  }
  input { border: 1px solid $grayLight; border-radius: 3px; padding: 8px 10px;
    outline: none; box-sizing: border-box; width: 100%; font-size: 16px;
    &:focus { border-color: $orange;}
  }
}
.weui-dialog__bd { max-height: 75vh; overflow: auto;}

// .bottom-bar { position: fixed; bottom: 0; left: 0; right: 0; background: $white; color: $grayDark;
//   display: flex; align-items: center; justify-content: space-between;
//   .actions {
//     a.button { display: block; padding: 16px 20px; width: auto; font-size: 16px; border-radius: 0;}
//   }
//   .aside { padding-left: 15px; }
// }

.dialog-body { text-align: left; padding: 10px 15px 20px;
  // .title { font-size: 18px; padding: 10px 0; text-align: center;}
}
.dialog-footer { position: relative; text-align: left;
  .closeIcon { position: absolute; bottom: -66px; left: 50%; padding: 10px; margin-left: -23px;
    font-size: 26px; line-height: 26px; width: 26px; height: 26px; text-align: center;
    border-radius: 100%; border: 1px solid rgba(255,255,255,.8);
    color: $white;
    .iconfont { display: block; line-height: 26px; }
  }
}
.hr-title { display: flex; flex-direction: row; align-items: center;
  span { display: inline-block; padding: 0 10px;}
  &:before, &:after { flex: 1; content: ''; border-top: 1px solid rgba(255,255,255,.1); height: 0;}
}
</style>

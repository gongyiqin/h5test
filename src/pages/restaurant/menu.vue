<template lang="pug">
.page.page-menu
  .recommend(v-if='restaurantInfo.name')
    h2 <i class='iconfont if-canzhuo'></i>{{recommend.length ? $t('本店推荐') : restaurantInfo.name[lang]}}
    .banner(v-if='recommend.length')
      swiper(:auto='true' :interval='4000' :aspect-ratio='0.75')
        swiper-item(v-for='it, index in recommend' :key='index')
          router-link(:to='it.url')
            .vux-img(:style='{backgroundImage: "url("+it.img+")"}')
            p.vux-swiper-desc {{it.title}}
  .table-notice
    p.actions
      span {{$t('桌号')}}：{{table.name[lang]}}
      a(href='#' @click.prevent='changeTable').button.btn-mini.btn-hollow {{$t('重新选位')}}
    p.passcode
      span {{$t('分享邀请码，和朋友一起点餐：{passcode}', {passcode})}}
  ul.goodsByCate(v-if='restaurantInfo.menu')

    li(v-for='cate in restaurantInfo.menu' :key='cate.id' ref='cate' :id='"cate-" + cate.id').cate
      h2 {{cate.name[lang]}}
      ul.goodsList
        li(v-for='item, i in cate.items' :key='item.id' :class='{first: i === 0}').cf
          router-link(:to='`/restaurants/${restaurantInfo.id}/tables/${tableId}/${item.id}?status=${item.inCurrent}`')
            img(:src='item.thumb_url')
            .infos
              h4(v-if='item.period.length').time_zone {{item.inCurrent?$t('销售时间段') + ' ' + item.startTime + ' - ' + item.endTime:$t('销售时间段') + ' ' + item.nextStartTime + ' - ' + item.nextEndTime }}
              div.row
               h4 {{item.name[lang]}}
                 span {{item.status==="op"?'( ' + $t('售罄') + ' )':'' }}


              .prices
                em {{item.price}}<small>{{$t('price-unit')}}/{{$t('units.' + item.unit)}}</small>

                del(v-if='item.normal_price') {{item.normal_price}}{{$t('price-unit')}}

          .quantity
            a(v-if='hasOptions(item)' href='#' @click.prevent='showSpecConfirm(item)').show-options
              span.button.btn-mini {{$t('选规格')}}
              i.flag(v-if='quantity[item.id] && quantity[item.id].total') {{quantity[item.id].total}}
            quantity-box(v-else :item='item' @confirm='showSpecConfirm')

  .notice
    p {{$t('桌号：')}}{{table.name[lang]}} <a href="#" class="btn-exit-table" @click.prevent="wantExitTable">{{$t('点击退出')}}</a>

  pop-navi
  router-link(:to='`/restaurants/${restaurantInfo.id}/cart`').btn-cart: i.iconfont.if-gouwuche
  .shade(v-show='isCateNaviShow' @click='hideShade')
  .cate-navi(:style='{right: isCateNaviShow ? 0 : "-140px"}')
    a(href='#' @click.prevent='toggleCateNavi' :class='{active: isCateNaviShow}').handler <i class="iconfont" :class='"if-" + (isCateNaviShow ? "xiangyou" : "xiangzuo")'></i>
    .cates
      h2 {{$t('菜品分类')}}
      .links
        a(v-for='cate, i in restaurantInfo.menu' :key='cate.id'
          v-scroll-to='{el: "#cate-" + cate.id, offset: -56}'
          :class='{active: i === activeCateMenuIndex}'
        ) {{cate.name[lang]}}

  x-dialog(v-model='isPackageConfirmShow' :hide-on-blur='true' :mask-z-index='100' :dialog-style='{zIndex: 101}').packagesOptions
    .weui-dialog__hd: .weui-dialog__title {{activeItem.name[lang]}}
    .dialog-body(v-if='activeItem.id')
      package-options(:item='activeItem' :p-key='activePKey' :f-keys='activeFKeys'
        @package='setPackKey' @favorite='toggleFavoKey'
      )
    .dialog-footer(v-if='activeItem.id')
      .action-bar
        span.price {{_activePKey ? activeItem.price_array[_activePKey].price : activeItem.price}}<small>{{$t('price-unit')}}</small>
        quantity-box(:defaultAsButton='true' :p-key='activePKey' :f-keys='activeFKeys' :item='activeItem')
        a(href='#' @click.prevent='hidePackageConfirm').closeIcon: i.iconfont.if-cha
</template>

<i18n>
本店推荐:
  en: Recommends
  th: อาหารที่แนะนำ
  ru: Рекомендация нашего магазина
  kr: 추천 메뉴
  jp: 当店のオススメ

桌号:
  en: Tbl
  th: หมายเลขโต๊ะ
  ru: Номер стола
  kr: 테이블 번호
  jp: テーブル番号

重新选位:
  en: Change Seat
  th: เลือกโต๊ะใหม่
  ru: Повторно выбрать биты
  kr: 테이블 다시 선택
  jp: 改めて位置を選びます

复制分享:
  en: Copy & Share
  th: คัดลอก แบ่ง
  ru: Копировать и поделиться
  kr: 복사하고 공유하기
  jp: コピ－シェア

选规格:
  en: Options
  th: เลือกขนาด
  ru:  Выбор спецификации
  kr: 규격 선택
  jp: 規格を選びます

点击退出:
  en: Quit
  th: ออกจากระบบ
  ru: Нажмите, чтобы выйти
  kr: 클릭하고 뒤로
  jp: クリックして閉じります

菜品分类:
  en: Categories
  th: ประเภท
  ru: Классификация блюд
  kr: 메뉴 분류
  jp: 料理分類

分享邀请码，和朋友一起点餐：{passcode}:
  en: 'Invite friends joining: {passcode}'
  th: 'เชิญสั่งอาหารด้วยกัน: {passcode}'
  ru: Поделиться кодом приглашения и заказать блюда с друзьями
  kr: 초청 바코드를 공유하고 친구들과 함께 주문하실 수 있습니다.
  jp: 招待番号、友達と一緒に料理を注文します

inviteCopyResult:
  zh-CN: 点击链接 {link} (桌号：{tableName} 邀请码：{passcode})，和朋友一起点餐
  en: 'Click to join {link} (Tbl: {tableName} Pass code: {passcode})'
  th: 'คลิกที่ลิงค์ {link} (หมายเลขโต๊ะ: {tableName} รหัสเชิญ: {passcode}), เชิญสั่งอาหารโ้ยวกัน'
  ru: Нажать на ссылку {link} (Номер стола：{tableName} Код приглашения：{passcode})，Заказать блюда с друзьями
  kr: 링크를 클릭하십시오 {link} (테이블 번호：{tableName} 초청 바코드：{passcode})，친구들과 함께 주문하기
  jp: リンクをクリックします {link} (テーブル番号：{tableName} 招待番号：{passcode})，友達と一緒に料理を注文します

复制成功:
  en: Copy success
  th: คัดลอกสำเร็จ
  ru: Успешная копия
  kr: 복사 성공
  jp: コピ－成功

复制失败，请自行选择复制:
  en: Copy failed
  th: คัดลอกไม่ได้ กรุณาเลือกใหม่
  ru: Ошибка копирования, пожалуйста, выберите копирование
  kr: 복사 실패, 스스로 선택하고 복사하십시오.
  jp: コピ－失敗、自分でコピ－を選んでください

确定要重新选座吗？:
  en: Do you want to change your seat?
  th: ตกลงเลือกโต๊ะใหม่
  ru: Вы уверены, что хотите опять выбрать место?
  kr: 테이블 다시 선정하시겠습니까?
  jp: 改めて席を選びますか？

确定要退出已经定的桌子 {tableName} 吗？:
  en: 'Do you want quit table {tableName}?'
  th: ตกลงออกจากโต๊ะที่จอง
  ru: Вы уверены, что хотите выйти из уже установленного стола?
  kr: 이미 선정한 테이블을 취소하시겠습니까?
  jp: 既に予約したテーブルから退きますか？

销售时间段:
  en: Sales time period
  th: ช่วงเวลาจำหน่าย
  ru: Период продажи
  kr: 판매시간
  jp: 販売期間

该菜品不在当前时间段内:
  en: The dish is not in the current period！
  th: อาหารนี้ไม่อยู่ในช่วงเวลาให้บริการ
  ru: Это блюдо не в данный момент
  kr: 이 제품은 현재 시간에 없습니다
  jp: 該料理は現時点では提供できません。

该菜品已售完:
  en: The dish are sold out
  th: สินค้าหมด
  ru: Распродано
  kr: 이 제품은 매진되었습니다
  jp: 該料理は売り切れました。

该菜品已下线:
  en: The dish has been off the menu
  th: รายการนี้ยกเลิกจำหน่าย
  ru: Это блюдо уже офлайн
  kr: 이 제품은 오프라인 되었습니다
  jp: 該料理はキャンセルしました。

售罄:
  en: Sold out
  th: สินค้าหมด
  ru: Распродано
  kr: 매진
  jp: 売り切れ

</i18n>

<script>
import { mapState, mapGetters } from 'vuex'
import { XDialog, Swiper, SwiperItem } from 'vux'
import ClipboardJS from 'clipboard'
import QuantityBox from '../../components/quantity-box'
import PackageOptions from '../../components/package-options'
import PopNavi from '../../components/pop-navi'
const utils = require('../../utils/util')
export default {
  components: {
    XDialog,
    Swiper,
    SwiperItem,
    QuantityBox,
    PackageOptions,
    PopNavi
  },
  data() {
    return {
      isMainNaviShow: false,
      isCateNaviShow: false,
      isPackageConfirmShow: false,
      activeItem: {id: 0, name: {}},
      activePKey: {},
      activeFKeys: [],
      activeCateMenuIndex: 0,
      catePositions: [],
      scrollY: 0,
      startTime: '',
      endTime: '',
      period: []
    }
  },
  computed: {
    ...mapState(['lang', 'passcode', 'tableId']),
    ...mapGetters(['restaurantInfo', 'quantity']),
    recommend: function () {
      // eslint-disable-next-line no-use-before-define
      const recommend = []
      if (this.restaurantInfo.menu) {
        this.restaurantInfo.menu.forEach(cate => {
          cate.items.forEach(item => {
            item.inCurrent = false
            if (item.tags === 'hot') {
              recommend.push({
                url: `/restaurants/${this.restaurantInfo.id}/tables/${this.tableId}/${item.id}`,
                img: item.cover_url,
                title: item.name[this.lang]
              })
            }
            let dateTimeLength = item.period.length
            if (dateTimeLength > 0) {
              let dateTimeArray = []
              let code = false
              item.period.forEach(i => {
                if (utils.InTime(i.start, i.end)) {
                  code = true
                  item.inCurrent = true
                  item.startTime = i.start
                  item.endTime = i.end
                  return true
                } else {
                  // eslint-disable-next-line camelcase
                  let startTime = i.start.split(':')
                  let Minute = parseInt(startTime[0] * 60 * 60) + parseInt(startTime[1] * 60) + parseInt(startTime[2])
                  dateTimeArray.push(Minute)
                  code = false
                }
              })
              if (code === false) {
                let currentTime = new Date()
                let minuCurrent = currentTime.getHours() * 60 * 60 + currentTime.getMinutes() * 60 + currentTime.getSeconds()
                dateTimeArray.push(minuCurrent)
                dateTimeArray.sort(function (a, b) {
                  return a - b
                })
                let t = utils.nextTime(minuCurrent, dateTimeArray)
                item.period.forEach(j => {
                  // eslint-disable-next-line no-undef
                  if (j.start === t) {
                    item.nextStartTime = j.start
                    item.nextEndTime = j.end
                  }
                })
              }
            }
          })
        })
      }
      return recommend
    },
    table() {
      return this.tableId && this.restaurantInfo.tables ? this.restaurantInfo.tables.find(table => table.id === Number(this.tableId)) : undefined
    },
    _activePKey() {
      let keys = Object.keys(this.activePKey)
      return keys.length ? keys.map(key => key + ':' + this.activePKey[key]).join('_') : ''
    },
  },
  created() {
    window.addEventListener('scroll', this.checkScroll)
  },
  beforeDestroy() {
    window.removeEventListener('scroll', this.checkScroll)
    this.clipboard.destroy()
  },
  mounted() {
    let link = process.env.SITE_BASE + `/restaurants/${this.restaurantInfo.id}/tables/${this.tableId}?passcode=${this.passcode}`
    this.clipboard = new ClipboardJS('#copy-btn', {
      action: 'copy',
      text: (e) => {
        return this.$t('inviteCopyResult', {link, tableName: this.table.name[this.lang], passcode: this.passcode})
      }
    })
    this.clipboard.on('success', e => {
      e.clearSelection()
      this.$vux.toast.show({text: this.$t('复制成功')})
    })
    this.clipboard.on('error', e => {
      this.$vux.toast.show({type: 'warn', text: this.$t('您的浏览器不支持该功能，请自行选择复制')})
    })

    this.$nextTick(function () {
      this.$refs.cate.forEach(el => {
        this.catePositions.push(el.offsetTop)
      })
    })
  },
  methods: {
    checkScroll() {
      let i = this.catePositions.findIndex(y => y > window.scrollY - 56)
      this.activeCateMenuIndex = i < 0 ? 0 : i
    },
    hasOptions(item) {
      return Object.keys(item.price_array).length || Object.keys(item.favorites).length
    },
    hidePackageConfirm() {
      this.isPackageConfirmShow = false
    },
    toggleMainNavi() {
      this.isMainNaviShow = !this.isMainNaviShow
    },
    toggleCateNavi() {
      this.isCateNaviShow = !this.isCateNaviShow
    },
    hideShade() {
      this.isMainNaviShow = false
      this.isCateNaviShow = false
    },
    menuNoperiod() {
      this.$vux.alert.show({
        title: this.$t('提示'),
        content: this.$t('该菜品不在当前时间段内'),
      })
    },
    menuSoldOut() {
      this.$vux.alert.show({
        title: this.$t('提示'),
        content: this.$t('该菜品已售完'),
      })
    },
    menuAreadlyDown() {
      this.$vux.alert.show({
        title: this.$t('提示'),
        content: this.$t('该菜品已下线'),
      })
    },
    showSpecConfirm(item) {
      // eslint-disable-next-line eqeqeq
      if (!item.inCurrent && item.period.length !== 0) {
        this.menuNoperiod()
        return false
      } else if (item.status === 'op') {
        this.menuSoldOut()
        return false
      } else if (item.status === 'disabled') {
        this.menuAreadlyDown()
      }
      let activePKey = {}
      let priceKeys = Object.keys(item.price_array)
      if (priceKeys.length) {
        let keys = priceKeys[0].split('_')
        for (let i = 0; i < keys.length; i++) {
          let kV = keys[i].split(':')
          activePKey[kV[0]] = kV[1]
        }
      }
      this.activePKey = activePKey

      this.activeFKeys = []
      this.activeItem = item
      this.isPackageConfirmShow = true
    },
    // goToCate(id) {
    //   let cartBox = document.getElementById('cate-' + id)
    //   document.documentElement.scrollTop = cartBox.offsetTop - 60
    // },
    changeTable() {
      this.$vux.confirm.show({
        title: this.$t('提示'),
        content: this.$t('确定要重新选座吗？'),
        onConfirm: () => {
          this.$http.post(`tables/${this.tableId}/quit`).then(() => {
            this.$store.commit('justUpdate', {tableId: 0})
            this.$router.replace(`/restaurants/${this.restaurantInfo.id}/tables`)
          })
        }
      })
    },
    setPackKey(name, key) {
      this.activePKey[name] = key
    },
    toggleFavoKey(key) {
      let i = this.activeFKeys.indexOf(key)
      if (i > -1) this.activeFKeys.splice(i, 1)
      else this.activeFKeys.push(key)
      // console.log('this.activeFKeys', this.activeFKeys)
    },
    wantExitTable() {
      this.$vux.confirm.show({
        title: this.$t('提示'),
        content: this.$t('确定要退出已经定的桌子 {tableName} 吗？', {tableName: this.table.name[this.lang]}),
        onConfirm: () => this.exitTable(),
      })
    },
    exitTable(tableId) {
      this.$http.post(`tables/${tableId || this.tableId}/quit`).then(() => {
        this.$store.commit('justUpdate', {tableId: 0})
        this.$router.back()
      })
    },
  },
}
</script>

<style lang="scss">
@import 'setting';
.page-menu {
  .recommend { padding: 20px 15px;
    h2 { text-align: center;
      .iconfont { display: block; margin-bottom: 5px; font-size: 38px;}
    }
    .banner { margin-top: 20px; height: calc((100vw - 30px) * 0.75); max-height: 540px;
      border-radius: 5px; overflow: hidden; background: rgba(0,0,0,.2)
    }
  }

  // .inviteCode { border-top: 1px solid rgba(255,255,255,.2); border-bottom: 1px solid rgba(255,255,255,.2);
  //   padding: 10px; margin: 0 15px 40px; color: #FFF;
  //   span { display: block; padding: 4px 0;}
  //   a.button { float: right; width: auto; padding: 7px 10px;}
  // }

  .table-notice { border-top: 1px solid rgba(255,255,255,.2); border-bottom: 1px solid rgba(255,255,255,.2);
    margin: 0 15px 40px; color: #FFF;
    p { display: flex; flex-direction: row; align-items: center;
      span { flex: 1; border-top: 1px solid rgba(255,255,255,.1); padding: 12px 0; margin-right: 10px;}
      &:first-child {
        span {border-top: none;}
      }
    }
  }

  padding-bottom: 80px;
  .btn-navi, .btn-cart { position: fixed; bottom: 15px; color: $white;}
  .btn-navi { left: 15px;}
  .btn-cart { right: 15px;
    i { @include icon-circle(60px, 32px, $white, $primary);}
  }

  .show-options { display: block; padding: 8px; position: relative;
    .button { background: #FECB48; color: #000;}
    i.flag { position: absolute; top: 2px; right: 8px;
      font-size: 9px; min-width: 14px; height: 14px; border-radius: 100%;
      background: #FF5200; color: #FFF; text-align: center; line-height: 14px;
    }
  }
  .notice { padding-bottom: 20px; font-size: 12px; text-align: center;
    a { display: inline-block; padding: 8px 5px;}
  }
}
.goodsByCate {
  h2 { padding: 15px 0; text-align: center;}
  > li { margin: 15px; background: $white; border-radius: 5px; color: #333;
    ul { border-top: 1px solid $grayLightest; padding-left: 10px;}
    li { padding-bottom: 10px;
      img { float: left; width: 90px; height: 90px; margin-top: 10px; border-radius: 3px;}
      .infos { display: block; margin-left: 100px; min-height: 70px; color: $grayDark;
        h4 { margin-bottom: 10px; font-size: 14px;}
        padding-top: 10px; border-top: 1px solid $grayLightest;
      }
      &:first-child {
        .infos { border-top: none;}
      }
      .prices {
        em, del { display: inline-block;}
        em { color: $primary; font-style: normal; font-size: 18px;}
        small { font-size: 12px;}
        del { margin-left: 10px; font-size: 12px;}
      }

      position: relative;
      .quantity { position: absolute; bottom: 2px; right: 2px;}
    }
  }
}

.main-navi { position: fixed; bottom: 0; left: 0; width: 100%; padding-bottom: 5px;
  a { display: block; padding: 10px 0 10px 15px; color: $white; font-size: 18px;
    i { border: 1px solid $white; width: 60px; height: 60px; border-radius: 100%;
      font-size: 32px; text-align: center; line-height: 60px; margin-right: 20px;
    }
  }
}

.cate-navi { position: fixed; top: 0; bottom: 0; padding-top: 46px; color: $grayDarker;
  .cates { width: 140px; background: $white; height: 100%; position: relative; overflow: auto;
    h2 { font-size: 24px; padding: 15px 10px; border-bottom: 1px solid $grayLightest;}
    .links { padding-left: 10px;}
    a { display: block; padding: 10px 0; font-size: 16px; border-bottom: 1px solid $grayLightest;
      color: $black;
      &:hover { color: #555;}
      &.active { color: $primary;}
    }
  }
  a.handler { position: absolute; top: 50%; left: -40px; margin-top: -40px;
    background: $white; background: rgba(48,73,95, .5); border-radius: 100%;
    width: 80px; height: 80px; color: $white;
    i { line-height: 80px; padding-left: 15px; }
    &.active { color: #7589AC; background: $white; }
  }
}

.packagesOptions {
  .weui-dialog { overflow: visible;}
  .dialog-footer { background: #F8F4F5; border-bottom-left-radius: 3px; border-bottom-right-radius: 3px;
    .action-bar { padding: 10px 15px;
      display: flex; flex-direction: row; align-items: center; justify-content: space-between;
      .price { color: $primary; font-size: 26px;
        small { font-size: 14px;}
      }
      .quantity-box .icons { margin-right: -10px;}
    }
    // .quantities { background: #DEE8FA; border-top: 1px solid #7589AC;
    //   border-bottom-left-radius: 3px; border-bottom-right-radius: 3px;
    //   h4 { text-align: center; padding: 8px 0; border-bottom: 1px solid $white;}
    //   .label-by { border-bottom: 1px solid $white; margin: 0 15px;
    //     &:last-child { border-bottom: none;}
    //     &.active label { color: $primary;}
    //   }
    // }
  }
}
  .row{
    display: flex;
    flex-direction: row;
    justify-content: space-between;

    span{
      color: #e83820;
      font-size: 10px !important;
      font-weight: normal;
    }
  }
  /*.time_zone{*/
  /*  padding: 8px;*/
  /*}*/
.time_zone{
  padding-right: 8px;
  letter-spacing: 1px;
  color: #e83820;
  font-weight: normal;
  font-size: 11px !important;

}
</style>

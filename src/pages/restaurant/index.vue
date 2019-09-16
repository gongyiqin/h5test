<template lang="pug">
.page.page-detail
  .detail-cover(v-if='restaurantInfo.name')
    h1 {{restaurantInfo.name[lang]}}
    .banner(v-if='restaurantInfo.image_url.length')
      swiper(:list='banner' :auto='true' :interval='4000' :aspect-ratio='0.75')
    p.intro(v-html='restaurantInfo.content[lang]')

    .btn-line.align-c
      router-link(:to='`${this.startPath}`').button.btn-main {{this.tableId ? $t('继续点餐') : $t('进入点餐')}}
      //- span(v-if='table') 已订桌子：{{table.name[lang]}} <a href="#" class="btn-exit-table" @click.prevent="wantExitTable">点击退出</a>

  .work-metas(v-if='restaurantInfo.id')
    dl(v-if='restaurantInfo.open_time')
      dt {{$t('营业时间')}}
      dd {{restaurantInfo.open_time.from}} - {{restaurantInfo.open_time.to}}
    dl(v-if='restaurantInfo.tel')
      dt {{$t('电话')}}
      dd {{restaurantInfo.tel}}
    dl(v-if='restaurantInfo.address')
      dt {{$t('地址')}}
      dd {{restaurantInfo.address}}
  Langs()
</template>

<i18n>
营业时间:
  en: Open time
  th: เวลาบริการ
  ru: Рабочее время
  kr: 영업 시간
  jp: 営業時間

电话:
  en: Tel
  th: โทรศัพท์
  ru: Телефон
  kr: 연락처
  jp: 電話

地址:
  en: Address
  th: ที่อยู่
  ru:  Адрес
  kr: 주소
  jp: 住所

继续点餐:
  en: Continue
  th: สั่งอาหารต่อไป
  ru: Продолжить заказать блюда
  kr: 계속 주문
  jp: 引き続き料理を注文します

进入点餐:
  en: Enter
  th: เข้าสู่ระบบ
  ru: Войти в заказ на блюда
  kr: 주문
  jp: 料理注文に入ります

进入桌子中:
  en: Entering
  th: เข้าสู่ที่โต๊ะ
  ru: Войти в стол(заказ)
  kr: 테이블 선정
  jp: テーブルの中に入ります

您已经订了桌子了，要进入继续点餐吗？:
  en: You have a seat already, continue?
  th: ท่านได้เข้าจองโต๊ะแล้ว สั่งอาหารต่อไปหรือไม่ครับ
  ru: Вы уже забронировали столик, хотите продолжить заказать блюда?
  kr: 테이블 선정했습니다. 계속 주문하시겠습니까?
  jp: 貴方は食卓を予約しました、料理注文に入ります？

进入继续:
  en: Yes, continue
  th: สั่งอาหารต่อไป
  ru: Войти в продолжение
  kr: 계속합니다
  jp: 引き続きに入ります

退出原来的桌子:
  en: Leave my seat
  th: ออกจากโต๊ะเดิม
  ru:  Выход из оригинальный столик
  kr: 선정한 테이블을 취소하겠습니다.
  jp: 元々のテーブルから退きます

成功退出原来的桌子:
  en: Leave your seat already
  th: ออกจากโต๊ะเดิมสำเร็จ
  ru:  Успешно выйти из оригинальный столик
  kr: 선정한 테이블을 취소했습니다.
  jp: 元々のテーブルから退きました
</i18n>

<script>
import { mapState, mapGetters } from 'vuex'
import { Swiper } from 'vux'
import Langs from '../../components/langs'

// import userTableMixin from '../../mixins/user-table'

export default {
  // mixins: [userTableMixin],
  components: {
    Swiper,
    Langs,
  },
  data() {
    return {
      redirectTo: '',
    }
  },
  watch: {
    restaurantInfo() {
      this.tryToAmend()
    }
  },
  computed: {
    ...mapState(['lang', 'tableId']),
    ...mapGetters(['restaurantInfo']),
    banner() {
      return this.restaurantInfo.image_url && this.restaurantInfo.image_url.length ? this.restaurantInfo.image_url.map(it => ({img: it})) : []
    },
    startPath() {
      // console.log(this.$store.state.EnterParams)
      let {params} = this.$store.state.EnterParams
      // console.log("params:", params)
      if (this.tableId) {
        return `/restaurants/${this.restaurantInfo.id}/tables/${this.tableId}`
      }
      if (params && params.table_id) {
        return `/restaurants/${params.restaurant_id}/tables?table_id=${params.table_id}`
      }

      return `/restaurants/${this.restaurantInfo.id}/tables`
    }
    // table() {
    //   return this.tableId && this.restaurantInfo.tables ? this.restaurantInfo.tables.find(table => table.id === Number(this.tableId)) : undefined
    // },

  },
  created() {
    let {params} = this.$store.state.EnterParams
    // if (this.restaurantInfo.id === params.restaurant_id) return
    if (!params) return
    if (params.table_id && params.passcode) {
      this.$vux.loading.show({text: this.$t('进入桌子中')})
      this.$http.post(`tables/${params.table_id}/enter`, {passcode: params.passcode}).then(({body}) => {
        this.$store.commit('justUpdate', {passcode: params.passcode, tableId: params.table_id, pers: body.data.pers || 0})
        this.$vux.loading.hide()
        this.redirectTo = `/restaurants/${params.restaurant_id}/tables/${params.table_id}`
        this.tryToAmend()
      })
    } else {
      this.checkTableInfo(Number(params.table_id))
    }
  },
  methods: {
    setLocale(lang) {
      this.$i18n.set(lang)
      this.$store.commit('setLang', lang)
    },
    tryToAmend() {
      if (this.restaurantInfo.id && this.redirectTo) this.$router.push(this.redirectTo)
      // this.$store.commit('justUpdate', {EnterParams: {}})
    },
    checkTableInfo(tableId) {
      if (tableId) this.$vux.loading.show({text: this.$t('进入桌子中')})
      this.$http.get('restaurants/' + this.$route.params.restaurant_id + '/usertable').then(({body}) => {
        if (tableId) this.$vux.loading.hide()
        let _tableId = body.data ? Number(body.data.table_id) : 0
        if (body.data && _tableId > 0) {
          if (!tableId || _tableId === tableId) {
            this.$store.commit('justUpdate', {tableId: _tableId, passcode: body.data.passcode, pers: body.data.pers})
            // 直接进入页面
            if (tableId) {
              this.redirectTo = `/restaurants/${this.$route.params.restaurant_id}/tables/${_tableId}` // this.$store.state.EnterParams.path
              this.tryToAmend()
            }
          } else {
            this.$vux.confirm.show({
              title: this.$t('提示'),
              content: this.$t('检测到您已经订了桌子了，要进入继续点餐吗？'),
              confirmText: this.$t('进入继续'),
              cancelText: this.$t('退出原来的桌子'),
              onConfirm: () => {
                this.$store.commit('justUpdate', {tableId: _tableId, passcode: body.data.passcode, pers: body.data.pers})
                // 直接进入桌子
                this.redirectTo = `/restaurants/${this.$route.params.restaurant_id}/tables/${_tableId}`
                this.tryToAmend()
              },
              onCancel: () => {
                this.exitTable(_tableId)
                this.redirectTo = `/restaurants/${this.$route.params.restaurant_id}/tables?table_id=${tableId}`
                this.tryToAmend()
              },
            })
          }
        } else if (tableId) {
          // this.redirectTo = `/restaurants/${this.$route.params.restaurant_id}/tables?table_id=${tableId}`
          // this.tryToAmend()
        }
      })
    },
    // wantExitTable() {
    //   this.$vux.confirm.show({
    //     title: '退出桌子',
    //     content: `确定要退出已经定的桌子 ${this.table.name[this.lang]} 吗？`,
    //     onConfirm: () => {
    //       this.exitTable()
    //     }
    //   })
    // },
    exitTable(tableId) {
      this.$http.post(`tables/${tableId || this.tableId}/quit`).then(() => {
        this.$store.commit('justUpdate', {tableId: 0})
        this.$vux.toast.show({text: this.$t('成功退出原来的桌子')})
      })
    },
  }
}
</script>

<style lang="sass">
@import 'setting';
.page-detail { padding-bottom: 88px;
  .langs { position: fixed; bottom: 0; left: 0; right: 0;
    padding: 20px 0; background: rgba(0,0,0,.7); border-top: 1px solid rgba(255,255,255,.2);
  }
  .btn-line {
    span { display: block; padding: 10px 0; font-size: 12px;
      a.btn-exit-table { display: inline-block; padding: 8px 5px;}
    }
  }
}
.detail-cover { padding: 0 20px;
  h1 { padding: 30px 0 20px; color: $white; text-align: center; font-size: 25px;}
  .banner { border-radius: 5px; overflow: hidden; }
  .intro { padding: 20px 0 40px; color: $white; font-size: 12px; line-height: 2; white-space:pre-wrap;}
}
.work-metas { border-top: 1px solid rgba(255,255,255,.2); margin: 30px 10px 0; padding: 5px 10px 15px;
  border-bottom: 1px solid rgba(255,255,255,.2);
  color: $white;
  dl { margin-top: 10px;}
  dt { font-size: 16px;}
  dd { font-size: 12px;}
}
</style>

<template lang="pug">
.page.page-tables
  .init-table(v-if='initTable')
    h2 <i class='iconfont if-canzhuo'></i>{{initTable.name[lang]}}
    p(@click='resetTable') {{$t('点击选择其他餐桌')}}
  .tables(v-else)
    h2 <i class='iconfont if-canzhuo'></i>{{$t('选择餐桌')}}
    .link-options
      a(href='#' v-for='it, i in restaurantInfo.tables' :key='it.id' :class='[it.status, {active: i === tableIndex}]'
        @click.prevent='setTable(i)'
      ): span {{it.name[lang]}}
    .note
      span.inuse {{$t('点餐中')}}
      span.available {{$t('可选择')}}
      span.locked {{$t('被占用')}}
  .sizes
    h2 <i class='iconfont if-renshu'></i>{{$t('用餐人数')}}
    .link-options
      a(href='#' v-for='it, i in sizes' :key='i' :class='{active: pers === it}'
        @click.prevent='setPers(i)'
      ): span {{it}}

  .btn-line.align-c: a(href='#' @click.prevent='gotoOrder').button.btn-main {{$t('开始点餐')}}

  confirm(v-model='showUseConfirm' :title='$t("提示")' @on-confirm='checkPasscode' @on-cancel='cancelPasscode')
    .input
      label {{$t('输入邀请码，和朋友一起点餐')}}
      input(type='text' v-model='inviteCode')
      span {{$t('邀请码可向本桌第一位进入点餐的朋友获取')}}
</template>

<i18n>
选择餐桌:
  en: Select a seat
  th: เชิญเลือกโต๊ะ
  ru: Выбрать обеденный стол
  kr: 테이블 선정
  jp: 食卓を選びます

点餐中:
  en: In using
  th: กำลังสั่งอาหารอยู่
  ru:  В процессе заказа блюда
  kr: 주문 중
  jp: 料理を注文しています

可选择:
  en: Available
  th: เลือกได้
  ru: Можно выбрать
  kr: 선택 가능
  jp: 選ぶことができます

被占用:
  en: Reserved
  th: ใช้อยู่
  ru: Занято
  kr: 이미 선택한 테이블
  jp: 占用させられました

用餐人数:
  en: Pers
  th: จำนวนลูกค้าทานอาหาร
  ru: Количество людей, которые едят
  kr: 식사 인원수
  jp: 食事人数

开始点餐:
  en: Start now
  th: เข้าสู่ระบบ
  ru: Начать заказать блюда
  kr: 주문 시작
  jp: 料理を注文し始めます

输入邀请码，和朋友一起点餐:
  en: Please input passcode
  th: กรุณาใส่รหัส เชิญสั่งอาหารด้วยกัน
  ru: Введите код приглашения и заказать блюда с друзьями
  kr: 초청 바코드를 입력하고 친구들과 함께 주문하실 수 있습니다.
  jp: 招待番号、友達と一緒に料理を注文します

邀请码可向本桌第一位进入点餐的朋友获取:
  en: Ask your fiend or waiter to get pass code
  th: รหัสการเชิญสั่งอาหารสามารถได้จากท่านแรกที่เข้าสู่สั่งอาหารในโต๊ะนี้
  ru: Код приглашения можно получить у первого друга стола
  kr: 테이블 먼저 선정한 친구에게 초청 바코드를 받으실 수 있습니다.
  jp: 招待番号は当テブ－ルで第1位に入った料理を注文する友達から獲得できます

请先选择餐桌以及用餐人数，谢谢。:
  en: Please select your seat and pers first
  th: กรุณาเลือกโต๊ะและจำนวนคนทานอาหาร
  ru: Пожалуйста, выбрать обеденный стол и количество людей, чтобы поесть, спасибо.
  kr: 먼저 테이블과 인원수를 입력하시기 바랍니다. 감사합니다.
  jp: 先に食卓と食事人数を選んでください、ありがとうございます。

该桌子已被占用:
  en: This table has been reserved
  th: โต๊ะไม่ว่าง
  ru: Этот стол занят
  kr: 테이블 사용이 불가능합니다.
  jp: このテーブルは既に占用させられました

对不起，该桌子已被占用:
  en: Sorry, This table has been reserved
  th: ขออภัย, โต๊ะไม่ว่าง
  ru: Извините, этот стол уже занят
  kr: 죄송합니다. 테이블 사용이 불가능합니다.
  jp: 申し訳ございません、このテーブルは占用させられました

点击选择其他餐桌:
  en: Select other seats
  th: คลิกเลือกโต๊ะอื่น
  ru: Нажать, чтобы выбрать другой обеденный стол
  kr: 다른 테이블을 선택하십시오.
  jp: クリックしてその他の食卓を選びます
</i18n>

<script>
import { mapState, mapGetters } from 'vuex'
import { Confirm } from 'vux'
// import userTableMixin from '../../mixins/user-table'

export default {
  // mixins: [userTableMixin],
  components: {
    Confirm,
  },
  data() {
    return {
      tableIndex: -1,
      initTable: null,
      pers: 0,
      sizes: [1, 2, 3, 4, 5],
      showUseConfirm: false,
      inviteCode: '',
    }
  },
  computed: {
    ...mapState(['lang', 'tableId']),
    ...mapGetters(['restaurantInfo']),
  },
  created() {
    let tableId = this.$route.query.table_id
    if (tableId) {
      let tableIndex = this.restaurantInfo.tables.findIndex(table => table.id === Number(tableId))
      if (tableIndex > -1) {
        this.initTable = this.restaurantInfo.tables[tableIndex]
        this.setTable(tableIndex)
      }
    }
  },
  methods: {
    resetTable() {
      this.tableIndex = -1
      this.initTable = null
    },
    setTable(i) {
      let table = this.restaurantInfo.tables[i]
      this.checkTableStatus(table.id).then(theTable => {
        if (table.status !== theTable.status) {
          this.$store.commit('updateTableStatus', {index: i, status: theTable.status})
        }
        if (theTable.status === 'available') {
          this.tableIndex = i
          let sizes = []
          for (let i = 1; i <= table.capacity; i++) sizes.push(i)
          this.sizes = sizes
          if (this.pers > table.capacity) this.pers = 0
        } else if (theTable.status === 'inuse') {
          this.tableIndex = i
          this.showUseConfirm = true
        } else {
          this.$vux.alert.show({title: this.$t('该桌子已被占用'), content: this.$t('对不起，该桌子已被占用')})
          this.resetTable()
        }
      })
    },
    checkTableStatus(tableId) {
      return this.$http.get(`tables/${tableId}/status`).then(({body}) => body.data)
    },
    setPers(i) {
      this.pers = this.sizes[i]
    },
    gotoOrder() {
      const table = this.restaurantInfo.tables[this.tableIndex]
      if (this.tableIndex === -1 || (table.status !== 'inuse' && this.pers === 0)) this.$vux.alert.show({title: this.$t('提示'), content: this.$t('请先选择餐桌以及用餐人数，谢谢。')})
      else {
        this.enterTable()
      }
    },
    checkPasscode() {
      if (this.inviteCode) this.enterTable()
    },
    cancelPasscode() {
      this.resetTable()
    },
    enterTable() {
      const table = this.restaurantInfo.tables[this.tableIndex]
      let data = (!table.status || table.status === 'available') ? {pers: this.pers} : {passcode: this.inviteCode}
      this.$http.post(`tables/${table.id}/enter`, data).then(({body}) => {
        if (body.data.passcode) {
          this.$store.commit('justUpdate', {passcode: body.data.passcode, pers: this.pers, tableId: table.id})
          this.$router.replace(`/restaurants/${this.restaurantInfo.id}/tables/${table.id}`)
        }
      })
    },
  },
}
</script>

<style lang="scss">
@import 'setting';
.page-tables { padding-bottom: 30px;
  h2 { text-align: center;
    .iconfont { display: block; margin-bottom: 5px; font-size: 38px;}
  }
  .init-table, .tables { padding-top: 30px; margin-bottom: 30px;}
  .init-table {
    p { margin: 20px 0; text-align: center; }
  }
  .sizes { margin-bottom: 30px;}
  .note { border-top: 1px solid rgba(255,255,255,.3); padding-top: 10px; margin: 0 15px;
    span { margin-right: 20px;
      &:before { content: ''; display: inline-block; vertical-align: middle; width: 10px; height: 10px;
        border: 1px solid $white; border-radius: 3px; margin-right: 5px;
      }
      &.inuse {
        &:before { background: $white; border-color: $white;}
      }
      &.locked { color: $gray;
        &:before { background: $grayLight; border-color: $grayLight;}
      }
    }
  }
}
.link-options { margin: 20px 10px; font-size: 12px;
  a { display: inline-block; padding: 8px 5px;
    width: 20%; box-sizing: border-box;
    color: $white;
    span { display: block; border: 1px solid $white; border-radius: 3px; padding: 3px 0; text-align: center;
      min-height: 1em;
    }
    &.locked span { background: $grayLighter; border-color: $grayLighter; color: $gray;}
    &.inuse { color: #393537;
      span { background: $white; border-color: $white;}
      &.active { color: $white;
        span { background: $orange; border-color: $orange;}
      }
    }
    &.active {
      span { background: $primary; border-color: $primary;}
    }
  }
}
</style>

// page/community/pages/main/group/activation/components/gshare/index.js
import {
  get,
  post,
} from '../../../../../../../../utils/util.js';
Component({
  /**
   * 组件的属性列表
   */
  properties: {
    room_id: {
      type: String,
      value: ''
    }
  },

  /**
   * 组件的初始数据
   */
  data: {
    // 开始时间和结束时间
    startDate: '',
    endDate: '',
    // 订单tab
    orderIndex:'0',
    page:1,
    listH:[]
  },

  /**
   * 组件的方法列表
   */
  methods: {
    // 组件第一次加载事件
    loadData() {
      this.setData({
        startDate: this.getNow(),
        endDate: this.getNow(),
      })
      this.getData()
    },
    // getData: function () {
    //   this.triggerEvent('getData')
    // },
    // 开始时间选择
    bindDateChangeS(e) {
      var value = e.detail.value
      var tvalue = value.split('-')
      this.setData({
        startDate: `${tvalue[0]}/${tvalue[1]}/${tvalue[2]}`,
        page: 1
      })
      this.getData(1)

    },
    // 结束时间选择
    bindDateChangeE(e) {
      var value = e.detail.value
      var tvalue = value.split('-')
      this.setData({
        endDate: `${tvalue[0]}/${tvalue[1]}/${tvalue[2]}`,
        page:1
      })
      this.getData(1)

    },  
    orderTC(e){
      var index = e.currentTarget.dataset.index
      this.setData({
        orderIndex: index
      })
    },
    // 转换当前时间
    getYmd(data) {
      var date = new Date(data)
      var y = date.getFullYear()
      var m = date.getMonth() + 1
      var d = date.getDate()
      var hour = date.getHours()
      var minute = date.getMinutes()
      var second = date.getSeconds()
      m = m < 10 ? '0' + m : m
      d = d < 10 ? '0' + d : d
      hour = hour < 10 ? '0' + hour : hour
      minute = minute < 10 ? '0' + minute : minute
      second = second < 10 ? '0' + second : second
      return y + '/' + m + '/' + d
    },
    // 获取当前时间
    getNow() {
      var date = new Date()
      var y = date.getFullYear()
      var m = date.getMonth() + 1
      var d = date.getDate()
      var hour = date.getHours()
      var minute = date.getMinutes()
      var second = date.getSeconds()
      m = m < 10 ? '0' + m : m
      d = d < 10 ? '0' + d : d
      hour = hour < 10 ? '0' + hour : hour
      minute = minute < 10 ? '0' + minute : minute
      second = second < 10 ? '0' + second : second
      return y + '/' + m + '/' + d
    },
    getData: function (page) {
      let that = this
      wx.showLoading({
        title: '加载中',
      })
      post('/community/order/queryOrderList', {
        groupId: that.data.room_id,
        // groupId: 56,
        page: that.data.page,
        pageSize: 10,
        startDate: that.data.startDate, 
        endDate: that.data.endDate,
      }, (res) => {
        console.log(res.data.data.list, res.data.data, that.data.listH, '--------')
        if (res.data.code == 200) {
          that.setData({
            page: that.data.page + 1,
            listH: that.data.listH.concat(res.data.data.list),
            income: res.data.data.income ,
          })
          console.log(res.data.data.list, res.data.data, that.data.listH, '--------')

          console.log(this.data.listH, that.data.income,'0000000000999999999999')
          wx.hideLoading()

        } else {
          wx.showToast({
            title: res.data.msg,
            icon: 'none'
          })
        }
      }, 0, 'cb6313f328b0c04430ebe3aa6807d77c', true, 0, 1)
    },
    goDetail(e){
      console.log(e,'ppppppppppppppp')
      let goodsId = e.currentTarget.dataset.goodid
      let skuId = e.currentTarget.dataset.skuid
      wx.navigateTo({
        url: '/page/Yuemall/pages/details/details?goodsId=' + goodsId + '&skuid=' + skuId,
      })
    },
  }
})
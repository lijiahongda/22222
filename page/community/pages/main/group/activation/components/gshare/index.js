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
    room_id:{
      type:String,
      value:''
    }
  },

  /**
   * 组件的初始数据
   */
  data: {
    // 开始时间和结束时间
    startDate:'',
    endDate:'',
    // 用户弹窗
    alertShow:false,
    peoList:[]
  },

  /**
   * 组件的方法列表
   */
  methods: {
    // 复制昵称
    copyText: function (e) {
      wx.setClipboardData({
        data: e.currentTarget.dataset.text,
        success(res) {
          wx.getClipboardData({
            success(res) { }
          })
        },
        complete(res) { }
      })
    },
    // 组件第一次加载事件
    loadData() {
      this.setData({
        startDate: this.getNow(),
        endDate: this.getNow(),
      })
      this.getData()
    },
    
    // 时间选择
    bindDateChangeS(e){
      var value=e.detail.value
      var tvalue=value.split('-')
      this.setData({
        startDate: `${tvalue[0]}/${tvalue[1]}/${tvalue[2]}`
      })
      this.getData()
    },
    
    // 打开用户弹窗
    seeMore(e){
      this.setData({
        peoList: e.currentTarget.dataset.browse,
        alertShow:true
      })
    },
    // 关闭弹窗
    closeMyself(){
      this.setData({
        alertShow: false
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
    
    getData: function () {
      let that = this
      post('/community/group/queryGroupInfo', {
        date: that.data.startDate,
        groupId: that.data.room_id,
      }, (res) => {
        console.log(res.data.data.info, '6666666666666')
        this.triggerEvent('Child', res.data.data)
        if (res.data.code == 200) {
          that.setData({
            uv: res.data.data.uv,//人数
            pv: res.data.data.pv,//次数
            info: res.data.data.info,//群信息
          })
        } else {
          wx.showToast({
            title: res.data.msg,
            icon: 'none'
          })
        }
      }, 0, 'cb6313f328b0c04430ebe3aa6807d77c', true, 0, 1)
      post('/community/group/queryShareInfo', {
        date: that.data.startDate,
        groupId: that.data.room_id,
      }, (res) => {
        console.log(res.data.data,'=============')
        if (res.data.code == 200) {
          that.setData({
            list: res.data.data,
          })
          console.log(that.data.peoList)
          this.triggerEvent('Child2', res.data.data)
        } else {
          wx.showToast({
            title: res.data.msg,
            icon: 'none'
          })
        }
      }, 0, 'cb6313f328b0c04430ebe3aa6807d77c', true, 0, 1)
    },
    goDetail(e) {
      console.log(e, 'ppppppppppppppp')
      let goodsId = e.currentTarget.dataset.goodid
      let skuId = e.currentTarget.dataset.skuid
      wx.navigateTo({
        url: '/page/Yuemall/pages/details/details?goodsId=' + goodsId + '&skuid=' + skuId,
      })
    },
  }
})
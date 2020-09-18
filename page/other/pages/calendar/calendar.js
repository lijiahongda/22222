// // pages/demo/index.js
// const MONTHS = ['Jan.', 'Feb.', 'Mar.', 'Apr.', 'May.', 'June.', 'July.', 'Aug.', 'Sept.', 'Oct.', 'Nov.', 'Dec.'];

// Page({

//   /**
//    * 页面的初始数据
//    */
//   data: {
//     year: new Date().getFullYear(), // 年份
//     month: new Date().getMonth() + 1, // 月份
//     day: new Date().getDate(),
//     str: MONTHS[new Date().getMonth()], // 月份字符串
//     demo5_days_style: []
//   },
//   next: function(event) {
//     console.log(event.detail);
//   },
//   dayClick: function(event) {
//     console.log(this.data.isDiscount)
//     if (this.data.isDiscount == 1) {
//       console.log(this.data.typeTime)
//       if(this.data.typeTime == 33){
//         var date = new Date();
//         console.log('qqqqq')
//         console.log(date.getDate() + 5)
//         console.log(event.detail.day)
//         console.log(event.detail.month)
//         console.log(date.getMonth() + 1)
//         if (event.detail.month == (date.getMonth() + 1)) {
//           if (event.detail.day < (date.getDate() + 5)) {
//             console.log(event.detail.day)
//             wx.showToast({
//               title: '只能预定5天后的房间',
//               icon: 'none'
//             })
//           } else {

//             console.log(event.detail.day + '----')
//             const days_count = new Date(this.data.year, this.data.month, 0).getDate();

//             let demo5_days_style = new Array;
//             for (let i = 1; i <= days_count; i++) {
//               const date = new Date(this.data.year, this.data.month - 1, i);
//               if (i == event.detail.day) {
//                 demo5_days_style.push({
//                   month: 'current',
//                   day: i,
//                   color: 'white',
//                   background: '#b49eeb'
//                 });
//               }
//             }
//             this.setData({
//               demo5_days_style
//             });
//             console.log(event.detail)
//             const wxCurrPage = getCurrentPages(); //获取当前页面的页面栈
//             const wxPrevPage = wxCurrPage[wxCurrPage.length - 2]; //获取上级页面的page对象
//             if (wxPrevPage) {
//               wxPrevPage.setData({
//                 CheckInTime: event.detail.month + '月' + event.detail.day + '日',
//                 arrivalDate: event.detail.year + '-' + event.detail.month + '-' + event.detail.day,
//                 selectPage: 1,
//                 day: event.detail.day
//               })
//               wx.navigateBack()
//             }
//           }
//         } else {

//           console.log(event.detail.day + '----')
//           const days_count = new Date(this.data.year, this.data.month, 0).getDate();

//           let demo5_days_style = new Array;
//           for (let i = 1; i <= days_count; i++) {
//             const date = new Date(this.data.year, this.data.month - 1, i);
//             if (i == event.detail.day) {
//               demo5_days_style.push({
//                 month: 'current',
//                 day: i,
//                 color: 'white',
//                 background: '#b49eeb'
//               });
//             }
//           }
//           this.setData({
//             demo5_days_style
//           });
//           console.log(event.detail)
//           const wxCurrPage = getCurrentPages(); //获取当前页面的页面栈
//           const wxPrevPage = wxCurrPage[wxCurrPage.length - 2]; //获取上级页面的page对象
//           if (wxPrevPage) {
//             wxPrevPage.setData({
//               CheckInTime: event.detail.month + '月' + event.detail.day + '日',
//               arrivalDate: event.detail.year + '-' + event.detail.month + '-' + event.detail.day,
//               selectPage: 1,
//               day: event.detail.day
//             })
//             wx.navigateBack()
//           }
//         }
//       }else if(this.data.typeTime == 34){
//         var date = new Date();
//         console.log(date.getDate() + 3)
//         if (event.detail.month == (date.getMonth() + 1)) {
//           console.log('-----------------------')
//           console.log(event.detail.day+'+++++++++')
//           console.log((date.getDate() + 3))
//           if (event.detail.day < (date.getDate() + 3)) {
//             console.log(event.detail.day)
//             wx.showToast({
//               title: '只能预定3天后的房间',
//               icon: 'none'
//             })
//           } else {

//             console.log(event.detail.day + '----')
//             const days_count = new Date(this.data.year, this.data.month, 0).getDate();

//             let demo5_days_style = new Array;
//             for (let i = 1; i <= days_count; i++) {
//               const date = new Date(this.data.year, this.data.month - 1, i);
//               if (i == event.detail.day) {
//                 demo5_days_style.push({
//                   month: 'current',
//                   day: i,
//                   color: 'white',
//                   background: '#b49eeb'
//                 });
//               }
//             }
//             this.setData({
//               demo5_days_style
//             });
//             console.log(event.detail)
//             const wxCurrPage = getCurrentPages(); //获取当前页面的页面栈
//             const wxPrevPage = wxCurrPage[wxCurrPage.length - 2]; //获取上级页面的page对象
//             if (wxPrevPage) {
//               wxPrevPage.setData({
//                 CheckInTime: event.detail.month + '月' + event.detail.day + '日',
//                 arrivalDate: event.detail.year + '-' + event.detail.month + '-' + event.detail.day,
//                 selectPage: 1,
//                 day: event.detail.day
//               })
//               wx.navigateBack()
//             }
//           }
//         } else {

//           console.log(event.detail.day + '----')
//           const days_count = new Date(this.data.year, this.data.month, 0).getDate();

//           let demo5_days_style = new Array;
//           for (let i = 1; i <= days_count; i++) {
//             const date = new Date(this.data.year, this.data.month - 1, i);
//             if (i == event.detail.day) {
//               demo5_days_style.push({
//                 month: 'current',
//                 day: i,
//                 color: 'white',
//                 background: '#b49eeb'
//               });
//             }
//           }
//           this.setData({
//             demo5_days_style
//           });
//           console.log(event.detail)
//           const wxCurrPage = getCurrentPages(); //获取当前页面的页面栈
//           const wxPrevPage = wxCurrPage[wxCurrPage.length - 2]; //获取上级页面的page对象
//           if (wxPrevPage) {
//             wxPrevPage.setData({
//               CheckInTime: event.detail.month + '月' + event.detail.day + '日',
//               arrivalDate: event.detail.year + '-' + event.detail.month + '-' + event.detail.day,
//               selectPage: 1,
//               day: event.detail.day
//             })
//             wx.navigateBack()
//           }
//         }
//       }
//     } else {
//       console.log(event.detail);
//       const days_count = new Date(this.data.year, this.data.month, 0).getDate();

//       let demo5_days_style = new Array;
//       for (let i = 1; i <= days_count; i++) {
//         const date = new Date(this.data.year, this.data.month - 1, i);
//         if (i == event.detail.day) {
//           demo5_days_style.push({
//             month: 'current',
//             day: i,
//             color: 'white',
//             background: '#b49eeb'
//           });
//         }
//       }
//       this.setData({
//         demo5_days_style
//       });
//       console.log(event.detail)
//       const wxCurrPage = getCurrentPages(); //获取当前页面的页面栈
//       const wxPrevPage = wxCurrPage[wxCurrPage.length - 2]; //获取上级页面的page对象
//       if (wxPrevPage) {
//         wxPrevPage.setData({
//           CheckInTime: event.detail.month + '月' + event.detail.day + '日',
//           arrivalDate: event.detail.year + '-' + event.detail.month + '-' + event.detail.day,
//           selectPage: 1,
//           day: event.detail.day
//         })
//         wx.navigateBack()
//       }
//     }
//   },
//   /**
//    * 生命周期函数--监听页面加载
//    */
//   onLoad: function(options) {
//     const days_count = new Date(this.data.year, this.data.month, 0).getDate();
//     console.log(days_count)
//     let demo5_days_style = new Array;
//     console.log(options.month)
//     this.setData({
//       CheckInTime: options.CheckInTime,
//       day: options.day,
//       month: options.month,
//       isDiscount: options.isDiscount,
//       typeTime:options.typeTime,
//     })

//     console.log(options.typeTime)
//     for (let i = 1; i <= days_count; i++) {
//       // if ()
//       const date = new Date(this.data.year, this.data.month - 1, i);
//       if (date.getDay() == 0) {
//         demo5_days_style.push({
//           month: 'current',
//           day: i,
//           color: '#f488cd'
//         });
//       } else {
//         demo5_days_style.push({
//           month: 'current',
//           day: i,
//           color: '#a18ada'
//         });
//       }
//       if (i == this.data.day) {
//         demo5_days_style.push({
//           month: 'current',
//           day: i,
//           color: 'white',
//           background: '#b49eeb'
//         });
//       }
//     }
//     this.setData({
//       demo5_days_style,
//     });
//     console.log(this.data.demo5_days_style)
//     console.log(this.data.day)
//     console.log(this.data.month)
//     console.log(this.data.CheckInTime)
//   },
// })
Page({

  /**
   * 页面的初始数据
   */
  data: {
    dayStyle: [{
        month: 'current',
        day: new Date().getDate(),
        color: 'white',
        background: '#AAD4F5'
      }
    ],
  },
  dayClick: function(event) {
    console.log(event.detail);
    const days_count = new Date(this.data.year, this.data.month, 0).getDate();
    console.log(this.data.year)
    console.log(this.data.month)
    console.log(days_count)
    let demo5_days_style = new Array;
    for (let i = 1; i <= days_count; i++) {
      const date = new Date(this.data.year, this.data.month - 1, i);
      if (i == event.detail.day) {
        demo5_days_style.push({
          month: 'current',
          day: i,
          color: 'white',
          background: '#b49eeb'
        });
      }
    }
    this.setData({
      demo5_days_style
    });
    console.log(event.detail)
    // const wxCurrPage = getCurrentPages(); //获取当前页面的页面栈
    // const wxPrevPage = wxCurrPage[wxCurrPage.length - 2]; //获取上级页面的page对象
    // if (wxPrevPage) {
    //   wxPrevPage.setData({
    //     CheckInTime: event.detail.month + '月' + event.detail.day + '日',
    //     arrivalDate: event.detail.year + '-' + event.detail.month + '-' + event.detail.day,
    //     selectPage: 1,
    //     day: event.detail.day
    //   })
    //   wx.navigateBack()
    // }
  },
  onLoad: function(e) {
    console.log(e)
    let that = this
    that.setData({
      year: e.year,
      month:e.month
    })
  }
})
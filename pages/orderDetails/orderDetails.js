const app = getApp()
const ajax_url = app.globalData.ajax_url;
Page({

  /**
   * 页面的初始数据
   */
  data: {
    bar_Height: wx.getSystemInfoSync().statusBarHeight, //获取手机状态栏
    my_class: true, //是否显示白色
    ishideback: false, //是否显示箭头
    orderId: '',
    orderDetail: '',
    endTime: '', //2018/11/22 10:40:30这种格式也行
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    console.log(options.orderId)
    this.setData({
      orderId: options.orderId
    });
    this.getOrderDetail()
  },

  // 获取订单详情
  getOrderDetail: function() {
    var _this = this
    var keywords = {
      orderId: _this.data.orderId
    }
    wx.request({
      url: ajax_url + '/order/mb/detail',
      method: "get",
      data: keywords,
      header: {
        'Authorization': "Bearer" + " " + wx.getStorageSync('token'),
        'client': 'APP',
      },
      success: function(res) {
        if (res.data.code == '200') {
          _this.setData({
            orderDetail: res.data.data,
            endTime: res.data.data.closeTime
          });
          if (res.data.data.status == 1) {
            _this.countDown();
          }

        } else {
          wx.showModal({
            content: res.data.message,
            confirmColor: '#6928E2',
            showCancel: false,
          })
        }
      }
    })

  },
  // 再次购买
  againBuy: function(e) {
    var orderid = e.currentTarget.dataset.orderid;
    var keywords = {
      orderId: orderid
    };
    wx.request({
      url: ajax_url + '/order/mb/buyAgain',
      method: "post",
      data: keywords,
      header: {
        'Authorization': "Bearer" + " " + wx.getStorageSync('token'),
        'client': 'APP',
        'content-type': 'application/x-www-form-urlencoded'
      },
      success: function(res) {
        if (res.data.code == '200') {
          wx.switchTab({
            url: '../../pages/shopCart/shopCart'
          })

        } else {
          wx.showModal({
            content: res.data.message,
            confirmColor: '#6928E2',
            showCancel: false,
          })
        }
      }
    })

  },
  // 取消支付
  cancelPay: function(e) {
    var orderid = e.currentTarget.dataset.orderid;
    var keywords = {
      orderId: orderid
    };
    wx.request({
      url: ajax_url + '/order/mb/cancelPay',
      method: "post",
      data: keywords,
      header: {
        'Authorization': "Bearer" + " " + wx.getStorageSync('token'),
        'client': 'APP',
        'content-type': 'application/x-www-form-urlencoded'
      },
      success: function(res) {
        if (res.data.code == '200') {
          console.log(res)
          _this.getOrderDetail() //刷新数据
        } else {
          wx.showModal({
            content: res.data.message,
            confirmColor: '#6928E2',
            showCancel: false,
          })
        }
      }
    })
  },
  // 查看物流
  goLogistics: function(e) {
    var orderid = e.currentTarget.dataset.orderid;
    wx.navigateTo({
      url: '/pages/logistics/logistics?orderId=' + orderid,
    })
  },
  // 确认收货
  confirmOrder: function(e) {
    var orderid = e.currentTarget.dataset.orderid;
    var _this = this;
    var keywords = {
      orderId: orderid
    };
    wx.request({
      url: ajax_url + '/order/mb/confirmReceipt',
      method: "post",
      data: keywords,
      header: {
        'Authorization': "Bearer" + " " + wx.getStorageSync('token'),
        'client': 'APP',
        'content-type': 'application/x-www-form-urlencoded'
      },
      success: function(res) {
        if (res.data.code == '200') {
          console.log(res)
          _this.getMyOrder('new') //刷新数据
        } else {
          wx.showModal({
            content: res.data.message,
            confirmColor: '#6928E2',
            showCancel: false,
          })
        }
      }
    })
  },
  // 去支付
  goOrderPay: function(e) {
    console.log(e.currentTarget.dataset.paydata);
    wx.navigateTo({
      url: '/pages/paymentOrder/paymentOrder?payData=' + JSON.stringify(e.currentTarget.dataset.paydata),
    })
  },

  // 倒计时
  countDown: function() {
    console.log(endTime)
    var that = this;
    var nowTime = new Date().getTime(); //现在时间（时间戳）
    var endTime = new Date(that.data.endTime).getTime(); //结束时间（时间戳）
    var time = (endTime - nowTime) / 1000; //距离结束的毫秒数
    // 获取天、时、分、秒
    let min = parseInt(time % (60 * 60 * 24) % 3600 / 60);
    let sec = parseInt(time % (60 * 60 * 24) % 3600 % 60);
    sec = that.timeFormin(sec)
    that.setData({
      min: that.timeFormat(min),
      sec: that.timeFormat(sec)
    })
    // 每1000ms刷新一次
    if (time > 0) {
      that.setData({
        countDown: true
      })
      setTimeout(this.countDown, 1000);
    } else {
      that.setData({
        countDown: false
      })
    }
  },
  //小于10的格式化函数（2变成02）
  timeFormat(param) {
    return param < 10 ? '0' + param : param;
  },
  //小于0的格式化函数（不会出现负数）
  timeFormin(param) {
    return param < 0 ? 0 : param;
  },
  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function() {

  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function() {

  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function() {

  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function() {

  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function() {

  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function() {

  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function() {

  }
})
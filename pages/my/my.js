// pages/my/my.js
const app = getApp()
const ajax_url = app.globalData.ajax_url;
Page({
  data: {
    bar_Height: wx.getSystemInfoSync().statusBarHeight,
    ishideback: true,
    name: '留一手',
    hiddenName: false,
    myData: '',
    jinDou:0
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    // app.isLogin();//是否登录
    this.getMyDeatail() //获取个人信息
    // this.getMoney() //获取余额
    // this.getMyRedBlance()//获取金豆
  },
  // 获取个人信息
  getMyDeatail: function() {
    var _this = this;
    wx.request({
      url: ajax_url + '/mb/find/' + wx.getStorageSync('useId'),
      method: "get",
      header: {
        'Authorization': "Bearer" + " " + wx.getStorageSync('token'),
        'client': 'APP',
      },
      success: function(res) {
        if (res.data.code == '200') {
          _this.setData({
            myData: res.data.data
          })
          _this.getMoney()
        } else if (res.data.code == '1500' || res.data.code == '401') {
          wx.navigateTo({
            url: '../logs/logs'
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
  // 获取我的金豆
  getMyRedBlance:function(){
    var _this = this;
    wx.request({
      url: ajax_url + '/redEnvelope/myRedBlance',
      method: "get",
      data: {memberId:wx.getStorageSync('useId')},
      header: {
        'Authorization': "Bearer" + " " + wx.getStorageSync('token'),
        'client': 'APP',
      },
      success: function (res) {
        if (res.data.code == '200') {
          console.log(res.data.data )
          _this.setData({
            jinDou: res.data.data || 0
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
  // 获取余额
  getMoney: function() {
    var _this = this;
    wx.request({
      url: ajax_url + '/account/find/' + wx.getStorageSync('useId'),
      method: "get",
      header: {
        'Authorization': "Bearer" + " " + wx.getStorageSync('token'),
        'client': 'APP',
      },
      success: function(res) {
        if (res.data.code == '200') {
          console.log(res)
          _this.setData({
            myMoney: res.data.data
          })
          _this.getMyRedBlance();
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
  // 去金豆页
  goGoldDetail:function(){
    if (this.data.jinDou.amount > 0){
      wx.navigateTo({
        url: '../goldDetail/goldDetail',

      })
    }else{
      wx.showModal({
        content: '没有笑容金',
        confirmColor: '#6928E2',
        showCancel: false,
      })
    }
   
  },
  
  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function() {
    this.onLoad();
  },

  
  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function() {

  },

  // 我的订单页面跳转
  goMyOrder: function(e) {
    let falg = e.currentTarget.dataset.falg;
    let status = e.currentTarget.dataset.status;
    wx.navigateTo({
      url: '../myOrder/myOrder?index=' + falg + '&status=' + status,
      success: function(res) {},
      fail: function(res) {},
      complete: function(res) {}
    })
  },
  // 去退换货
  goReturnedGoods: function() {
    wx.navigateTo({
      url: '../returnedGoods/returnedGoods'
    })
  },
  // 去余额
  goBalance: function() {
    wx.navigateTo({
      url: '../myBalance/myBalance',
    })
  }

})
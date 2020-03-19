// pages/my/my.js
const app = getApp()
const ajax_url = app.globalData.ajax_url;
Page({
  data: {
    bar_Height: wx.getSystemInfoSync().statusBarHeight,
    ishideback: true,
    name: '留一手',
    hiddenName: false,
    myData: ''
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    this.getMyDeatail() //获取个人信息
    this.getMoney()//获取余额
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
  getMoney: function () {
    var _this = this;
    wx.request({
      url: ajax_url + '/account/find/' + wx.getStorageSync('useId'),
      method: "get",
      header: {
        'Authorization': "Bearer" + " " + wx.getStorageSync('token'),
        'client': 'APP',
      },
      success: function (res) {
        if (res.data.code == '200') {
          console.log(res)
          _this.setData({
            myMoney: res.data.data
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
    console.log('离开时间')
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

  },

  // 我的订单页面跳转
  goMyOrder: function(e) {
    let falg = e.currentTarget.dataset.falg;
    wx.navigateTo({
      url: '../myOrder/myOrder?index=' + falg,
      success: function(res) {},
      fail: function(res) {},
      complete: function(res) {}
    })
  },
  // 去余额
  goBalance: function() {
    wx.navigateTo({
      url: '../myBalance/myBalance',
    })
  }

})
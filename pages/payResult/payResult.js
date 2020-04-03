const app = getApp()
const ajax_url = app.globalData.ajax_url;
Page({

  /**
   * 页面的初始数据
   */
  data: {
    bar_Height: wx.getSystemInfoSync().statusBarHeight,
    ishideback: false,
    my_class: true,
    falg: true
  },
  goHome: function() {
    wx.switchTab({
      url: '../../pages/index/index'
    })
  },
  goOne: function() {
    wx.navigateBack({
      delta: -1
    });
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    var _this = this;
    if (options.item) {
      var dataHotD = JSON.parse(options.item)
      _this.setData({
        orderId: dataHotD.orderId || '',
        orderNo: dataHotD.orderNo || ''
      });
    }
    if (options.payFalg == 'success') {
      _this.setData({
        falg: false
      })
      _this.getHotB() //获取红包金额
    }
  },
  // 领取红包
  getHotB: function() {
    var _this = this;
    var data = {
      memberId: wx.getStorageSync('useId'),
      orderId: _this.data.orderId,
      orderNo: _this.data.orderNo
    }
    wx.request({
      url: ajax_url + '/redEnvelope/receiveRedEnvelope',
      method: "get",
      data: data,
      header: {
        'Authorization': "Bearer" + " " + wx.getStorageSync('token'),
        'client': 'APP',
      },
      success: function(res) {
        if (res.data.code == '200') {
          _this.setData({
            hotMoney: res.data.data
          });
        } else {
          // wx.showModal({
          //   content: res.data.message,
          //   confirmColor: '#6928E2',
          //   showCancel: false,
          // })
          wx.showToast({
            title: res.data.message,
            icon: 'none',
            duration: 1000,
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
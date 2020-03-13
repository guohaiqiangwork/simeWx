// pages/setUp/setUp.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    bar_Height: wx.getSystemInfoSync().statusBarHeight,
    ishideback: false,
    my_class: true,
    setList: [{ name: '个人资料设置', url: '../dataSet/dataSet' }, { name: '提现密码', url: '../setPassword/setPassword' }, { name: '联系客服', url: '15010825114', phone: '0434-23423423' }, { name: '关于我们', url: '../aboutUs/aboutUs' }]
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {

  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {

  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {

  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function () {

  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function () {

  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function () {

  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {

  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {

  },
  // 页面跳转
  goPages: function (e) {
    let pageUrl = e.currentTarget.dataset.url
    if (pageUrl == '15010825114') {
      wx.makePhoneCall({
        phoneNumber: pageUrl
      })
    } else {
      wx.navigateTo({
        url: pageUrl
      })
    }

  }
})
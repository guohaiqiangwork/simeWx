// pages/myOrder/myOrder.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    bar_Height: wx.getSystemInfoSync().statusBarHeight, //获取手机状态栏
    my_class: true, //是否显示白色
    ishideback: false, //是否显示箭头
    orderTabList: [{
      name: '全部',
      id: '001'
    }, {
      name: '待付款',
      id: '002'
    }, {
      name: '待发货',
      id: '003'
    }, {
      name: '待收款',
      id: '004'
    }],
    tabFalg: '001',//显示那个模块
    // isRuleTrueWl: false,
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.setData({
      tabFalg: options.index//我的订单某个模块
    });
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
  productTabSwich: function (e) {
    this.setData({
      tabFalg: e.currentTarget.dataset.id,
    })
  },
})
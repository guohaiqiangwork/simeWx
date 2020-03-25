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
    tabList: [{
      name: '全部',
      id: '001',
      transType: ''
    }, {
      name: '支出',
      id: '002',
      transType: 2
    }, {
      name: '收入',
      id: '003',
      transType: 1
    }],
    tabFalg: '001', //显示那个模块
    isScroll: true,
    transType: '' //列表参数
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    this.getMoney(); //获取余额
    this.getMoneyList()//获取列表
  },
  // tab
  productTabSwich: function(e) {
    this.setData({
      tabFalg: e.currentTarget.dataset.id,
      transType: e.currentTarget.dataset.transtype
    });
    this.getMoneyList()//获取列表
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
  // 获取lieb
  getMoneyList: function() {
    var _this = this;
    var data = {
      memberId: wx.getStorageSync('useId'),
      transType: _this.data.transType,
      status: 1
    }
    wx.request({
      url: ajax_url + '/acc/flow/findAll',
      method: "post",
      data: data,
      header: {
        'Authorization': "Bearer" + " " + wx.getStorageSync('token'),
        'client': 'APP',
      },
      success: function(res) {
        if (res.data.code == '200') {
          _this.setData({
            moneyList: res.data.data.data
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
  goCashMoney: function() {
    wx.navigateTo({
      url: "../cashMoney/cashMoney",
    })
  }
})
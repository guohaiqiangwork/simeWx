// pages/category/category.js
const app = getApp()
const ajax_url = app.globalData.ajax_url;
Page({
  /**
   * 页面的初始数据
   */
  data: {
    bar_Height: wx.getSystemInfoSync().statusBarHeight,
    ishideback: true,
    my_class: false,
    tabFalg: '01',
    leftList: [], //左面分类
    rightList: [] //右面分类
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    let _this = this;
    _this.getTabList(); //获取主分类
    _this.getTabListRight(_this.data.tabFalg) //获取右面
  },
  //  获取分类左
  getTabList: function() {
    var _this = this;
    wx.request({
      url: ajax_url + '/sort/selectSortF',
      method: "get",
      success: function(res) {
        if (res.data.code == '200') {
          _this.setData({
            leftList: res.data.data
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
  //  获取分类右
  getTabListRight: function(code) {
    var _this = this;
    wx.request({
      url: ajax_url + '/sort/selectSortC/' + code,
      method: "get",
      success: function(res) {
        if (res.data.code == '200') {
          _this.setData({
            rightList: res.data.data
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
  goSearchResult(e){
    console.log(e)
    wx.navigateTo({
      url: '/pages/searchResult/searchResult?code=' + e.currentTarget.dataset.id,
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
  // 左边切换
  swichTab: function(e) {
    let _this = this;
    _this.getTabListRight(e.currentTarget.dataset.id)
    _this.setData({
      tabFalg: e.currentTarget.dataset.id
    })
  }
})
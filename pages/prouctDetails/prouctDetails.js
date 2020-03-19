// pages/prouctDetails/prouctDetails.js
//获取应用实例
const app = getApp()
const ajax_url = app.globalData.ajax_url;
Page({

  /**
   * 页面的初始数据
   */
  data: {
    bar_Height: wx.getSystemInfoSync().statusBarHeight,
    ishideback: false,
    my_class: false,
    banners: [], //轮播数组
    goodsName:'',//产品名称
    title:'',
    gList: [{ name: '原料产地', content: '丹麦' }, { name: '保质期', content: '3天冷藏（建议收货当天食用）' }, { name: '储藏温度', content: '0℃ - 5℃' }, { name: '商家电话', content: '400-1005-200' }]
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    console.log(options)
    this.getProduct(options.productId);//获取商品详情
    this.getNum()//获取购物车数量
  },
  // 获取商品详情
  getProduct:function(id){
    var _this = this;
    wx.request({
      url: ajax_url + '/goods/getGoodsDetail/' + id,
      method: "get",
      header: {
        'Authorization': "Bearer" + " " + wx.getStorageSync('token'),
        'client': 'APP',
      },
      success: function (res) {
        if (res.data.code == '200') {
          _this.setData({
            banners: res.data.data.pictureUrlList,
            goodsName: res.data.data.goodsName,
            title: res.data.data.title,
            grossMargin: res.data.data.grossMargin,
            price: res.data.data.specification[0].price,
            gList: res.data.data.propertyList,
            specification: res.data.data.specification,
            pictureUrlList: res.data.data.pictureUrlList
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
  // 获取购物车数量
  getNum: function () {
    var _this = this;
    wx.request({
      url: ajax_url + '/shoppingCart/getNum/' + wx.getStorageSync('useId'),
      method: "get",
      header: {
        'Authorization': "Bearer" + " " + wx.getStorageSync('token'),
        'client': 'APP',
      },
      success: function (res) {
        console.log(res)
        if (res.data.code == '200') {
          _this.setData({
            number: res.data.data
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
  // 拨打电话
  getPhone:function(e){
    console.log(e)
    let pageUrl = e.currentTarget.dataset.pvalue
    let falg = e.currentTarget.dataset.id
    if (falg == '1') {
      wx.makePhoneCall({
        phoneNumber: pageUrl
      })
    } 
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

  }
})
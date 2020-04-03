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
    gList: [],
    prouctNumberNo:''
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
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
            pictureUrlList: res.data.data.pictureUrlList,
            goodsId: res.data.data.id,//商品id
            mchId: res.data.data.mchId,//商户id
            skuId: res.data.data.specification[0].id,//规格id
            detailsList: res.data.data.detailsList
          })
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
        if (res.data.code == '200') {
         
          _this.setData({
            prouctNumberNo: res.data.data
          })
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
  // 拨打电话
  getPhone:function(e){
    let pageUrl = e.currentTarget.dataset.pvalue
    let falg = e.currentTarget.dataset.id
    if (falg == '1') {
      wx.makePhoneCall({
        phoneNumber: pageUrl
      })
    } 
  },
//立即购买
  goBuy:function(){
    var _this = this;
    if (_this.data.specification[0].inventory == 0){
      wx.showToast({
        title: '货物已售罄',
        icon: 'none',
        duration: 1000,
      })
    }else{
      var prouctData = {
        goodsId: _this.data.goodsId,//商品id
        mchId: _this.data.mchId,//商户id
        skuId: _this.data.skuId,//规格id
        falg: 'prouct'
      }
      wx.navigateTo({
        url: '/pages/confirmOrder/confirmOrder?prouctData=' + JSON.stringify(prouctData),
      })
    }
   
  },
  // 去购物车
  goShopCart:function(){
    wx.switchTab({
      url: '../../pages/shopCart/shopCart'
    })
  },
  // 加入购物车
  addShopCard: function (e) {
    var _this = this;

    wx.showLoading({
      title: '添加中...',
    })
    var data = {
      goodsId: _this.data.goodsId,
      pecificationId: _this.data.skuId,
      userId: wx.getStorageSync('useId'),
    };
    wx.request({
      url: ajax_url + '/shoppingCart/addCart',
      method: "post",
      data: data,
      header: {
        'Authorization': "Bearer" + " " + wx.getStorageSync('token'),
        'client': 'APP',
      },
      success: function (res) {
        wx.hideLoading();
        if (res.data.code == '200') {
          // wx.showModal({
          //   content: '添加成功',
          //   confirmColor: '#6928E2',
          //   showCancel: false,
          // })
          wx.showToast({
            title: '添加成功',
            icon: 'none',
            duration: 1000,
          })
          _this.getNum()
        } else {
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
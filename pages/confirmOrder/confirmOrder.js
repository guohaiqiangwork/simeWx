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

    adderList: [], //地址数据
    prouctList: [],
    prouctData: '', //详情页购买数据
    sharePeopleId: '', //分享人id
    addressId: '', //地址id
    buyData: ''
  },


  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    var _this = this;
    // 详情直接进行购买
    if (options.prouctData) {
      _this.data.prouctData = JSON.parse(options.prouctData);
      _this.getProuctBuy() //详情页过来获取数据
    };
    _this.getCartListNo() //获取失效商品数量 
    _this.getAddressList() //获取地址列表
    _this.getShareId() //查询是否绑定他人
  },
  // 详情获取页面数据
  getProuctBuy: function() {
    var _this = this;
    var data = [{
      goodsId: _this.data.prouctData.goodsId,
      skuId: _this.data.prouctData.skuId,
      num: 1
    }]
    wx.request({
      url: ajax_url + '/order/mb/settle',
      method: "post",
      data: data,
      header: {
        'Authorization': "Bearer" + " " + wx.getStorageSync('token'),
        'client': 'APP',
      },
      success: function(res) {
        if (res.data.code == '200') {
          _this.setData({
            prouctList: res.data.data
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
  // 获取失效商品
  getCartListNo: function() {
    var _this = this;
    wx.request({
      url: ajax_url + '/shoppingCart/cartListNo/' + wx.getStorageSync('useId'),
      method: "get",
      header: {
        'Authorization': "Bearer" + " " + wx.getStorageSync('token'),
        'client': 'APP',
      },
      success: function(res) {
        if (res.data.code == '200') {
          _this.setData({
            cartListNo: res.data.data.length
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
  // 获取地址列表
  getAddressList: function() {
    var _this = this;
    wx.request({
      url: ajax_url + '/address/findAll/' + wx.getStorageSync('useId'),
      method: "get",
      header: {
        'Authorization': "Bearer" + " " + wx.getStorageSync('token'),
        'client': 'APP',
      },
      success: function(res) {
        if (res.data.code == '200') {
          var addressList = res.data.data;
          var list = [];
          if (addressList.length > 0) {
            for (var i = 0; i < addressList.length; i++) {
              if (addressList[i].isDefault == 1) {
                list.push(addressList[i]);
                _this.data.addressId = addressList[i].id
              }
            }
          }
          _this.setData({
            adderList: list
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
  // 查询是否有绑定人
  getShareId: function() {
    var _this = this;
    wx.request({
      url: ajax_url + '/share/getShareId',
      method: "get",
      data: {
        memberId: wx.getStorageSync('useId')
      },
      header: {
        'Authorization': "Bearer" + " " + wx.getStorageSync('token'),
        'client': 'APP',
      },
      success: function(res) {
        if (res.data.code == '200') {
          _this.data.sharePeopleId = res.data.data
        }
      }
    })
  },
  //去支付
  goPay: function() {
    wx.showLoading({
      title: '生成订单中...',
    })

    var _this = this;
    var data = {
      itemList: _this.data.prouctList.itemList, //商品数组
      memberId: wx.getStorageSync('useId'),
      orderAddress: {
        addressId: _this.data.addressId //地址id
      },
      sharePeopleId: _this.data.sharePeopleId,
    };
    wx.request({
      url: ajax_url + '/order/mb/singleItemBuy',
      method: "post",
      data: data,
      header: {
        'Authorization': "Bearer" + " " + wx.getStorageSync('token'),
        'client': 'APP',
      },
      success: function(res) {
        wx.hideLoading();
        if (res.data.code == '200') {
          _this.setData({
            buyData: res.data.data
          })
          wx.navigateTo({
              url: '/pages/paymentOrder/paymentOrder?buyData=' + JSON.stringify(_this.data.buyData) ,
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
  // 去商品清单
  goDetailList: function(e) {
    console.log(e)
    wx.navigateTo({
      url: '/pages/detailedList/detailedList?type=' + e.currentTarget.dataset.type,
    })
  },

})
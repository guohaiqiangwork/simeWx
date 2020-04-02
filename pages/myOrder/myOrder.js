const app = getApp()
const ajax_url = app.globalData.ajax_url;
Page({

  /**
   * 页面的初始数据
   */
  data: {
    bar_Height: wx.getSystemInfoSync().statusBarHeight, //获取手机状态栏
    my_class: true, //是否显示白色
    ishideback: true, //是否显示箭头
    isScroll: true,
    orderTabList: [{
      name: '全部',
      id: '001',
      status: '',
    }, {
      name: '待付款',
      id: '002',
      status: '1'
    }, {
      name: '待发货',
      id: '003',
      status: '2'
    }, {
      name: '待收货',
      id: '004',
      status: '3'
    }],
    tabFalg: '001', //显示那个模块
    inputValue: '', //输入框值
    isScroll: true,
    refresh_falg: true,
    page: 1,
    page_size: 10,
    code: '', //分类
    synthesize: '1',
    priceSorted: '',
    sell: '',
    orderList: [],
    status: ''
    // isRuleTrueWl: false,
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    this.setData({
      tabFalg: options.index, //我的订单某个模块
      status: options.status
    });
    this.getMyOrder() //获取我的订单
  },
  // 获取我的订单数据
  getMyOrder: function(type) {
    var _this = this;
    var data = {
      pageNum: _this.data.page,
      pageSize: _this.data.page_size,
      data: {
        status: _this.data.status,
        memberId: wx.getStorageSync('useId'),
        orderId: ''
      }
    }
    wx.request({
      url: ajax_url + '/order/mb/list',
      method: "post",
      data: data,
      header: {
        'Authorization': "Bearer" + " " + wx.getStorageSync('token'),
        'client': 'APP',
      },
      success: function(res) {
        wx.hideLoading();
        if (res.data.code == '200') {
          if (type == 'new') {
            _this.setData({
              orderList: res.data.data.records
            });
          } else {
            _this.setData({
              orderList: _this.data.orderList.concat(res.data.data.records)
            });
          }
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
  // 去我的订单详情
  goOrderDetail: function(e) {
    wx.navigateTo({
      url: '../orderDetails/orderDetails?orderId=' + e.currentTarget.dataset.orderid,
    })
  },
  // // tab 切换
  // tabSwich: function(e) {
  //   if (e.currentTarget.dataset.id == '002') {
  //     this.setData({
  //       sell: 1,
  //       priceSorted: '',
  //       synthesize: ''
  //     })
  //   } else if (e.currentTarget.dataset.id == '003') {
  //     this.setData({
  //       priceSorted: 1,
  //       sell: '',
  //       synthesize: ''
  //     })
  //   } else {
  //     this.setData({
  //       priceSorted: '',
  //       sell: '',
  //       synthesize: 1
  //     })
  //   }
  //   this.setData({
  //     tabFalg: e.currentTarget.dataset.id,
  //   });
  //   this.data.searchList = [];
  //   this.getSearchList();
  // },

  // 去支付
  goOrderPay: function(e) {
    console.log(e.currentTarget.dataset.paydata);
    wx.navigateTo({
      url: '/pages/paymentOrder/paymentOrder?payData=' + JSON.stringify(e.currentTarget.dataset.paydata),
    })
  },
  // 删除订单
  delOrder: function(e) {
    var orderid = e.currentTarget.dataset.orderid;
    var _this = this;
    wx.showModal({
      title: '确定删除此订单？',
      content: '删除后如有售后问题可联系客服恢复',
      success: function(e) {
        if (e.confirm) {
          var keywords = {
            orderId: orderid
          };
          wx.request({
            url: ajax_url + '/order/mb/delete',
            method: "post",
            data: keywords,
            header: {
              'Authorization': "Bearer" + " " + wx.getStorageSync('token'),
              'client': 'APP',
              'content-type': 'application/x-www-form-urlencoded'
            },
            success: function(res) {
              if (res.data.code == '200') {
                _this.getMyOrder('new') //刷新数据
              } else {
                wx.showModal({
                  content: res.data.message,
                  confirmColor: '#6928E2',
                  showCancel: false,
                })
              }
            }
          })
        } else if (e.cancel) {}
      }
    })
  },
  // 取消支付
  cancelPay: function(e) {
    var orderid = e.currentTarget.dataset.orderid;
    var keywords = {
      orderId: orderid
    };
    wx.request({
      url: ajax_url + '/order/mb/cancelPay',
      method: "post",
      data: keywords,
      header: {
        'Authorization': "Bearer" + " " + wx.getStorageSync('token'),
        'client': 'APP',
        'content-type': 'application/x-www-form-urlencoded'
      },
      success: function(res) {
        if (res.data.code == '200') {
          console.log(res)
          _this.getMyOrder('new') //刷新数据
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
  // 确认收货
  confirmOrder: function(e) {
    var orderid = e.currentTarget.dataset.orderid;
    var _this = this;
    var keywords = {
      orderId: orderid
    };
    wx.request({
      url: ajax_url + '/order/mb/confirmReceipt',
      method: "post",
      data: keywords,
      header: {
        'Authorization': "Bearer" + " " + wx.getStorageSync('token'),
        'client': 'APP',
        'content-type': 'application/x-www-form-urlencoded'
      },
      success: function(res) {
        if (res.data.code == '200') {
          console.log(res)
          _this.getMyOrder('new') //刷新数据
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
  // 查看物流
  goLogistics: function(e) {
    var orderid = e.currentTarget.dataset.orderid;
    wx.navigateTo({
      url: '/pages/logistics/logistics?orderId=' + orderid,
    })
  },
  // 再次购买
  againBuy: function(e) {
    var orderid = e.currentTarget.dataset.orderid;
    var keywords = {
      orderId: orderid
    };
    wx.request({
      url: ajax_url + '/order/mb/buyAgain',
      method: "post",
      data: keywords,
      header: {
        'Authorization': "Bearer" + " " + wx.getStorageSync('token'),
        'client': 'APP',
        'content-type': 'application/x-www-form-urlencoded'
      },
      success: function(res) {
        if (res.data.code == '200') {
          wx.switchTab({
            url: '../../pages/shopCart/shopCart'
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
  // 去我的
  goToMy:function(){
    wx.switchTab({
      url: '../../pages/my/my'
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
    wx.showNavigationBarLoading();
    this.setData({
      page: 1
    })
    this.getMyOrder('new');
    wx.stopPullDownRefresh();
  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function() {
    wx.showLoading({
      title: '加载中',
    });
    this.setData({
      page: this.data.page + 1,
    })
    this.getMyOrder(); //获取数据
  },

  productTabSwich: function(e) {
    var _this = this;
    _this.data.orderList = [];
    this.setData({
      tabFalg: e.currentTarget.dataset.id,
      status: e.currentTarget.dataset.status
    });
    _this.getMyOrder();
  },
 
})
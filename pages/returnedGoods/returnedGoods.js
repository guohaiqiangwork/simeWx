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
    orderTabList: [{
      name: '可申请订单',
      id: '001',
      status: '',
    }, {
      name: '申请记录',
      id: '002',
      status: '1'
    }],
    tabFalg: '001', //显示那个模块
    page: 1,
    page_size: 10,
    orderList: [],
    applyOrderList: [],

    hiddenmodalput: true,
    logisticsNumber:'',
    orderId:''
  },
  //点击按钮痰喘指定的hiddenmodalput弹出框
  modalinput: function (e) {
    console.log(e)
    this.setData({
      hiddenmodalput: !this.data.hiddenmodalput,
      orderId: e.currentTarget.dataset.item.id
    })
  },
  //取消按钮
  cancel: function () {
    this.setData({
      hiddenmodalput: true
    });
  },
  //确认
  confirm: function () {
    var _this = this;
    if (!_this.data.logisticsNumber){
      wx.showModal({
        content: '请输入内容',
        confirmColor: '#6928E2',
        showCancel: false,
      });
      return;
    };
    var addLogistics = {
      logisticsCode: _this.data.logisticsNumber, //物流单号
      retId: _this.data.orderId //订单号
    }
    wx.request({
      url: ajax_url + '/return/mb/addLogistics',
      method: "post",
      data: addLogistics,
      header: {
        'Authorization': "Bearer" + " " + wx.getStorageSync('token'),
        'client': 'APP',
        'content-type': 'application/x-www-form-urlencoded'
      },
      success: function (res) {
        if (res.data.code == '200') {
          console.log(res);
          _this.setData({
            hiddenmodalput: true
          });
          _this.getApplyRecord('new')//刷新数组
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
  bankcardInput:function(e){
    this.setData({
      logisticsNumber: e.detail.value
    })
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    var _this = this;
    _this.getReturnedList('new') //获取可申请订单
  },
  // 切换
  productTabSwich: function(e) {
    console.log(e)
    var _this = this;
    _this.data.orderList = [];
    this.setData({
      tabFalg: e.currentTarget.dataset.id,
      status: e.currentTarget.dataset.status,
      page:1
    });
    if (e.currentTarget.dataset.id == '001') {
      _this.getReturnedList()
    } else {
      _this.getApplyRecord()
    }

  },
  // 获取可申请订单
  getReturnedList: function(type) {
    var _this = this;
    var data = {
      pageNum: _this.data.page,
      pageSize: _this.data.page_size,
      data: {
        status: '',
        memberId: wx.getStorageSync('useId'),
        orderId: ''
      }
    }
    wx.request({
      url: ajax_url + '/return/mb/apply',
      method: "post",
      data: data,
      header: {
        'Authorization': "Bearer" + " " + wx.getStorageSync('token'),
        'client': 'APP',
      },
      success: function(res) {
        wx.hideLoading();
        if (res.data.code == '200') {
          console.log(res)
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
  // 获取申请记录
  getApplyRecord: function(type) {
    var _this = this;
    var data = {
      pageNum: _this.data.page,
      pageSize: _this.data.page_size,
      data: {
        id: '',
        memberId: wx.getStorageSync('useId'),
      }
    }
    wx.request({
      url: ajax_url + '/return/mb/applyRecord',
      method: "post",
      data: data,
      header: {
        'Authorization': "Bearer" + " " + wx.getStorageSync('token'),
        'client': 'APP',
      },
      success: function(res) {
        wx.hideLoading();
        if (res.data.code == '200') {
          console.log(res)
          if (type == 'new') {
            _this.setData({
              applyOrderList: res.data.data.records
            });
          } else {
            _this.setData({
              applyOrderList: _this.data.applyOrderList.concat(res.data.data.records)
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
  // 去申请退换货
  applyRecord: function(e) {
    console.log(e.currentTarget.dataset.orderid);
    console.log(e.currentTarget.dataset.status);
    wx.request({
      url: ajax_url + "/order/mb/isLapse/" + e.currentTarget.dataset.orderid,
      method: "post",
      header: {
        'Authorization': "Bearer" + " " + wx.getStorageSync('token'),
        'client': 'APP',
      },
      success: function(res) {
        if (res.data.code == '200') {
          wx.navigateTo({
            url: '../returnedApply/returnedApply?orderId=' + e.currentTarget.dataset.orderid + '&status=' + e.currentTarget.dataset.status,
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
  // 去我的订单详情
  goOrderDetail: function(e) {
    wx.navigateTo({
      url: '../orderDetails/orderDetails?orderId=' + e.currentTarget.dataset.orderid,
    })
  },
  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function() {
    this.onLoad();
  },
  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function() {
    wx.showNavigationBarLoading();
    this.setData({
      page: 1
    })
    if (this.data.tabFalg == '001') {
      this.getReturnedList('new'); //获取可申请
    } else {
      this.getApplyRecord('new') //获取申请
    }
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
    if (this.data.tabFalg == '001') {
      this.getReturnedList(); //获取数据
    } else {
      this.getApplyRecord() //获取申请
    }

  }
})
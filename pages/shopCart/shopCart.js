const app = getApp()
const ajax_url = app.globalData.ajax_url;
Page({

  /**
   * 页面的初始数据
   */
  data: {
    bar_Height: wx.getSystemInfoSync().statusBarHeight,
    ishideback: true,
    select_all: false, //全选
    checkbox_goodsid: '',
    arr: [], //id 数组
    priceArr: [], //价格 数组
    totalNumber: 0, //总数
    totalPrice: 0, //总价
    noList: [], //失效数据
    list: [],
    shopCarId: [], //购物车Id
    curTouchGoodStore: 99, //最大购买数量
    editFalg: true,
    deleArr:[]
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    this.getCartList(); //有效商品列表
    // _this.getCartListNo() //失效商品列表

  },
  // 获取购物车列表有效
  getCartList: function() {
    var _this = this;
    wx.request({
      url: ajax_url + '/shoppingCart/cartList/' + wx.getStorageSync('useId'),
      method: "get",
      header: {
        'Authorization': "Bearer" + " " + wx.getStorageSync('token'),
        'client': 'APP',
      },
      success: function(res) {
        if (res.data.code == '200') {
          _this.setData({
            list: res.data.data
          })
          for (var i = 0; i < _this.data.list.length; i++) {
            _this.data.list[i].checkeditem = false
          }
          _this.setData({
            checked_all: false,
            list: _this.data.list
          })
          _this.getCartListNo() //失效商品列表
        } else if (res.data.code == '1500' || res.data.code == '401') {
          wx.navigateTo({
            url: '../logs/logs'
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
  // 获取购物车列表失效
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
          console.log(res)
          _this.setData({
            noList: res.data.data
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

  // 加按钮
  jiaBtnTap: function(e) {
    var _this = this;
    var index = e.currentTarget.dataset.index;
    var shopId = e.currentTarget.dataset.id;
    var num = e.currentTarget.dataset.number;
    var fag = e.currentTarget.dataset.fag;
    var pecificationId = e.currentTarget.dataset.pecificationid;
    var num = Number(e.currentTarget.dataset.number);
    if (fag == 'add') {
      num = num + 1;
    } else {
      num = num - 1;
    };
    if (num == 0) {
      console.log('3232')
      return;
    } else if (num == 100) {
      console.log('12')
      return;
    }
    var data = {
      id: shopId,
      num: num,
      pecificationId: pecificationId,
    };
    console.log(data)
    wx.request({
      url: ajax_url + '/shoppingCart/setCarttNum',
      method: "post",
      data: data,
      header: {
        'Authorization': "Bearer" + " " + wx.getStorageSync('token'),
        'client': 'APP',
      },
      success: function(res) {
        if (res.data.code == '200') {
          let list = "list[" + index + "].num"
          _this.setData({
            [list]: num
          });

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
  // 删除数据处理
  deleteShopData: function(e) {
    let _this = this;
    let deleteF = e.currentTarget.dataset.falg; //是否为失效商品
    let deleteList = [];
    if (deleteF == 'over') {
      // let deleteList = _this.data.noList;
      for (var i = 0; i < _this.data.noList.length; i++) {
        deleteList.push(_this.data.noList[i].id);
      }
      _this.deleteShop(deleteList);
    } else {
      let deleteList = _this.data.arr;
      _this.deleteShop(deleteList);
    }
  },
  // 删除商品
  deleteShop: function(list) {
    var _this = this;
    if (_this.data.deleArr.length == 0) {
      wx.showModal({
        content: '请选择需要删除的内容',
        confirmColor: '#6928E2',
        showCancel: false,
      })
    }
    wx.request({
      url: ajax_url + '/shoppingCart/delCarts',
      method: "post",
      data: _this.data.deleArr,
      header: {
        'Authorization': "Bearer" + " " + wx.getStorageSync('token'),
        'client': 'APP',
      },
      success: function(res) {
        if (res.data.code == '200') {
          wx.showModal({
            content: '删除成功',
            confirmColor: '#6928E2',
            showCancel: false,
          });
          _this.setData({
            editFalg: true,
            totalNumber: 0, //选中商品数量
            totalPrice: 0 //选中商品价格
          })
          _this.getCartList(); //有效商品列表
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
  // 编辑
  editShop: function() {
    this.setData({
      editFalg: false
    })
  },
  // 取消操作
  cancelEnit: function() {
    for (var i = 0; i < this.data.list.length; i++) {
      this.data.list[i].checkeditem = false
    }
    this.setData({
      editFalg: true,
      checked_all:false,
      list: this.data.list,
      arr: [],
      priceArr: [],
      deleArr: [],
      totalNumber: 0, //选中商品数量
      totalPrice: 0 //选中商品价格
    })
  },
  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function() {
    var _this = this;
    _this.onLoad() //
    // 全选回复默认
    _this.setData({
      arr: [],
      priceArr: [],
      checked_all: false,
      deleArr: [],
      totalNumber: 0, //选中商品数量
      totalPrice: 0 //选中商品价格
    })
  },

  goHome: function() {
    wx.switchTab({
      url: '../../pages/index/index'
    })
  },
  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function() {

  },
  //单选
  checkboxChange: function(e) {
    var that = this
    var value = e.detail.value;
    var valLen = value.length;
    var checkid = e.target.dataset.checkid;
    var list = that.data.list;
    var listLen = list.length;
    var zpricenum = e.currentTarget.dataset.zpricenum; //选中商品数量
    var num = 0
    if (valLen != 0) { //选中
      for (var i = 0; i < listLen; i++) {
        if (list[i].goodsId == checkid) {
          console.log(list[i].goodsId + 'if' + checkid)
          if (!list[i].checkeditem) {
            list[i].checkeditem = true;
            console.log('未选中状态');
            num = num + 1;
            console.log('--' + num)
            var buyDataObj = {
              goodsId: list[i].goodsId,
              num: list[i].num,
              skuId: list[i].pecificationId,
              shopCarId: list[i].id
            }
            that.data.deleArr.push(list[i].id); //选中商品删除数组
            // that.data.shopCarId.push(list[i].id)//购物车id
            that.data.arr.push(buyDataObj); //选中商品数组
            that.data.priceArr.push(list[i].price * zpricenum); //价格数组
          }
        } else {
          if (list[i].checkeditem) {
            console.log(list[i].goodsId + 'else' + checkid)
            num = num + 1;
            console.log('++' + num)
          }
        }
      }
    } else {
      console.log('单选取消');
      var arrList = []
      var trolleyLen = that.data.arr.length;
      // 去掉数组中取消选中数据
      console.log(listLen + '循环长度')
      console.log(that.data.arr)
      for (var i = 0; i < listLen; i++) {
        if (list[i].goodsId == checkid) {
          if (list[i].checkeditem) {
            for (var j = 0; j < that.data.arr.length; j++) {
              if (list[i].goodsId == that.data.arr[j].goodsId) {
                list[i].checkeditem = false;
                that.data.deleArr.splice(j, 1); //选中商品删除数组
                that.data.arr.splice(j, 1); //删除选中
                that.data.priceArr.splice(j, 1); //删除金额
              }
            }

            // trolleyLen = trolleyLen - 1
          }
        }
      };
    }
    // 数据跟新
    // 计算总价
    var sum = 0,
      l = that.data.priceArr.length;
    for (var i = 0; i < l; i++) {
      sum += Number(that.data.priceArr[i]);
    }
    if (num == listLen) {
      that.setData({
        checked_all: true, //全选
        totalNumber: that.data.arr.length, //选中商品数量
        totalPrice: sum, //选中商品价格
        list: list //页面数据
      })
    } else {
      console.log(that.data.arr.length)
      that.setData({
        checked_all: false, //全选
        totalNumber: that.data.arr.length, //选中商品数量
        totalPrice: sum, //选中商品价格
        list: list //页面数据
      });
    }
    // console.log(JSON.stringify(list) + '页面展示数据');
  },
  // 全选
  checkedAll: function(e) {
    var that = this
    var value = e.detail.value;
    var valLen = value.length
    var list = that.data.list
    var listLen = list.length
    var priceArr = that.data.priceArr;
    // console.log(valLen)
    that.data.arr =[];
    that.data.priceArr = [];
    that.data.deleArr=[];
    if (valLen != 0) {
      console.log(that.data.arr + '全选选中')
      for (var i = 0; i < listLen; i++) {
        list[i].checkeditem = true;
        var buyDataObj = {
          goodsId: list[i].goodsId,
          num: list[i].num,
          skuId: list[i].pecificationId,
          shopCarId: list[i].id
        }
        that.data.deleArr.push(list[i].id);
        that.data.arr.push(buyDataObj); //ID数组
        that.data.priceArr.push(that.data.list[i].price * that.data.list[i].num) //价格数组
      }
      var sum = 0,
        l = that.data.priceArr.length;
      for (var i = 0; i < l; i++) {
        sum += Number(that.data.priceArr[i]);
      }
      console.log(that.data.arr)
      that.setData({
        checked_all: true, //全选
        list: list,
        priceArr: priceArr,
        totalNumber: that.data.arr.length, //选中商品数量
        totalPrice: sum //选中商品价格
      })
    } else {
      console.log(that.data.arr + '取消全选')
      for (var i = 0; i < listLen; i++) {
        list[i].checkeditem = false
      }
      that.data.arr = [];
      that.setData({
        arr: [],
        priceArr: [],
        checked_all: false,
        list: list,
        deleArr:[],
        totalNumber: 0, //选中商品数量
        totalPrice: 0 //选中商品价格
      })
    }
  },
  // 去结算
  goConfirmOrder: function() {
    var that = this;
    console.log(that.data.arr)
    if (that.data.arr.length > 0) {
      wx.navigateTo({
        url: '/pages/confirmOrder/confirmOrder?listArr=' + JSON.stringify(that.data.arr),
      })
    } else {
      wx.showToast({
        title: '请选择商品',
        icon: '',
        image: '/image/add.png',
        duration: 2000
      })

    }

  }
})
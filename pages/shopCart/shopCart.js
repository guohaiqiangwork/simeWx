// pages/shopCart/shopCart.js
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
    goodsList: {
      list: [1, 2, 3, 4]
    },
    list: [{
      id: '001',
      number: "2",
      price: '10'
    }, {
      id: '002',
      number: "2",
      price: '10'
    }, {
      id: '003',
      number: "99",
      price: '10'
    }],
    curTouchGoodStore: 99, //最大购买数量
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {

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
  // 加按钮
  jiaBtnTap: function(e) {
    var index = e.currentTarget.dataset.index;
    var number = Number(e.currentTarget.dataset.number);
    let list = "list[" + index + "].number"
    this.setData({
      [list]: number + 1
    })
  },
  // 减按钮
  jianBtnTap: function(e) {
    var index = e.currentTarget.dataset.index;
    var number = Number(e.currentTarget.dataset.number);
    let list = "list[" + index + "].number"
    this.setData({
      [list]: number - 1
    })
  },

  //单选
  checkboxChange: function(e) {
    // console.log(e)
    var that = this
    var value = e.detail.value;
    var valLen = value.length
    var checkid = e.target.dataset.checkid
    var list = that.data.list
    var listLen = list.length
    var num = 0
    if (valLen != 0) { //选中
      for (var i = 0; i < listLen; i++) {
        if (list[i].id == checkid) {
          console.log(list[i].id + 'if' + checkid)
          if (!list[i].checkeditem) {
            list[i].checkeditem = true;
            console.log('未选中状态');
            num = num + 1;
            console.log('--' + num)
            that.data.arr.push(list[i].id); //选中商品数组
            that.data.priceArr.push(list[i].price); //价格数组
          }
        } else {
          if (list[i].checkeditem) {
            console.log(list[i].id + 'else' + checkid)
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
      for (var i = 0; i < listLen; i++) {
        if (list[i].id == checkid) {
          if (list[i].checkeditem) {
            list[i].checkeditem = false
            that.data.arr.splice(i, 1); //删除选中
            that.data.priceArr.splice(i, 1); //删除金额
            trolleyLen = trolleyLen - 1
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
      that.setData({
        checked_all: false, //全选
        totalNumber: that.data.arr.length, //选中商品数量
        totalPrice: sum, //选中商品价格
        list: list //页面数据
      });
    }
    console.log(JSON.stringify(list) + '页面展示数据');
  },
  // 全选
  checkedAll: function(e) {
    var that = this
    var value = e.detail.value;
    var valLen = value.length
    var list = that.data.list
    var listLen = list.length
    var priceArr = that.data.priceArr
    // console.log(valLen)
    if (valLen != 0) {
      console.log(that.data.arr + '全选选中')
      for (var i = 0; i < listLen; i++) {
        list[i].checkeditem = true;
        that.data.arr.push(list[i].id); //ID数组
        that.data.priceArr.push(that.data.list[i].price) //价格数组
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
        totalNumber: 0, //选中商品数量
        totalPrice: 0 //选中商品价格
      })
    }
  },
  // 去结算
  goConfirmOrder: function() {
    var that = this;
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
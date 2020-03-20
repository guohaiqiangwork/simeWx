var bankCard = require('../../utils/bankType.js');
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
    title: '绑定银行卡',
    bankFalg: 1, //标示
    bankList: [],
    yzmButtonName: '获取验证码',
    onOff: true, //验证码开关
    cardName: '', //持卡人姓名
    userInputCardNum: '', // 银行卡账号
    cardPhone: '', //手机号
    startX: 0, //开始坐标
    startY: 0,

    bankName: '', //银行开户行名称
    bankType: '', //	银行卡类型
    bankCode: '', //银行编码
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    var that = this;
    that.getName() //查询是否实名认证

    if (that.data.bankList.length > 0) {
      that.setData({
        title: '我的银行卡',
      })
    };

  },
  // 查询是否实名
  getName: function() {
    var _this = this;
    wx.request({
      url: ajax_url + '/mb/checkVerified/' + wx.getStorageSync('useId'),
      method: "get",
      header: {
        'Authorization': "Bearer" + " " + wx.getStorageSync('token'),
        'client': 'APP',
      },
      success: function(res) {
        if (res.data.code == '200') {
          if (res.data.data) {
            _this.getBankList() //查询银行卡列表
          } else {
            wx.showModal({
              content: '请先进行实名认证',
              confirmColor: '#6928E2',
              showCancel: false,
            })
            setTimeout(function() {
              wx.navigateBack({
                delta: 1,
              })
            }, 1500)

          }
        }
      }
    })
  },
  // 获取银行卡列表
  getBankList: function() {
    var _this = this;
    wx.request({
      url: ajax_url + '/bank/findAll/' + wx.getStorageSync('useId'),
      method: "get",
      header: {
        'Authorization': "Bearer" + " " + wx.getStorageSync('token'),
        'client': 'APP',
      },
      success: function(res) {
        if (res.data.code == '200') {
          _this.data.bankList = res.data.data;
          // 添加滑动事件列表
          for (var i = 0; i < _this.data.bankList.length; i++) {
            _this.data.bankList[i].isTouchMove = false;
            _this.data.bankList[i].bankCard = "****" + _this.data.bankList[i].bankCard.substr(-4);
            switch (_this.data.bankList[i].bankBj) {
              case 'ICBC':
                _this.data.bankList[i].bankBj = 'bank_bgColor_zgp'
                _this.data.bankList[i].imgUrl = '/image/bank/gsy.png';
                break;
              case 'ABC':
                _this.data.bankList[i].bankBj = 'bank_bgColor_ny'
                _this.data.bankList[i].imgUrl = '/image/bank/nyy.png';
                break;
              case 'CCB':
                _this.data.bankList[i].bankBj = 'bank_bgColor_jj'
                _this.data.bankList[i].imgUrl = '/image/bank/jsy.png';
                break;
              case 'BOC':
                _this.data.bankList[i].bankBj = 'bank_bgColor_zgp'
                _this.data.bankList[i].imgUrl = '/image/bank/zgy.png';
                break;
              case 'COMM':
                _this.data.bankList[i].bankBj = 'bank_bgColor_jj'
                _this.data.bankList[i].imgUrl = '/image/bank/jty.png';
                break;
              case 'PSBC':
                _this.data.bankList[i].bankBj = 'bank_bgColor_ny'
                _this.data.bankList[i].imgUrl = '/image/bank/yzy.png';
                break;
              case 'SPDB':
                _this.data.bankList[i].bankBj = 'bank_bgColor_zgp'
                _this.data.bankList[i].imgUrl = '/image/bank/qty.png';
                break;
              case 'CMB':
                _this.data.bankList[i].bankBj = 'bank_bgColor_zgp'
                _this.data.bankList[i].imgUrl = '/image/bank/zsy.png';
                break;
              default:
                _this.data.bankList[i].bankBj = 'bank_bgColor_zgp'
                _this.data.bankList[i].imgUrl = '/image/bank/qty.png';
                break;
            }

          }
          _this.setData({
            bankList: _this.data.bankList
          });
        }
      }
    })

  },

  // 保存银行卡
  saveBank: function() {
    var _this = this;
    if (!_this.data.cardName) {
      wx.showModal({
        content: '请填写持卡人名字',
        confirmColor: '#6928E2',
        showCancel: false,
      })
      return;
    } else if (!_this.data.cardPhone) {
      wx.showModal({
        content: '请填写手机号',
        confirmColor: '#6928E2',
        showCancel: false,
      })
      return;
    } else if (!_this.data.code) {
      wx.showModal({
        content: '请填写验证码',
        confirmColor: '#6928E2',
        showCancel: false,
      })
      return;
    }
    var keyword = {
      name: _this.data.cardName,
      bankCard: _this.data.userInputCardNum, //银行卡
      bankName: _this.data.cardname, //银行开户行名称
      bankType: _this.data.cardType, //	银行卡类型
      memberId: wx.getStorageSync('useId'), //
      reservedMobile: _this.data.cardPhone, //银行预留手机号
      bankCode: _this.data.bankCode
    }
    wx.request({
      url: ajax_url + '/bank/addBank/' + _this.data.code,
      method: "post",
      data: JSON.stringify(keyword),
      header: {
        'Authorization': "Bearer" + " " + wx.getStorageSync('token'),
        'client': 'APP',
      },
      success: function(res) {
        if (res.data.code == '200') {
          wx.showModal({
            content: '添加成功',
            confirmColor: '#6928E2',
            showCancel: false,
          })
          _this.getBankList();
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
  //删除事件
  del: function(e) {
    var _this = this;
    wx.request({
      url: ajax_url + '/bank/deleteBank/' + e.currentTarget.dataset.id,
      method: "post",
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
          })
          _this.getBankList();
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

  // 添加银行卡
  addBank: function() {
    this.setData({
      bankList: [],
    })
  },
  //手指触摸动作开始 记录起点X坐标
  touchstart: function(e) {
    //开始触摸时 重置所有删除
    this.data.bankList.forEach(function(v, i) {
      if (v.isTouchMove) //只操作为true的
        v.isTouchMove = false;
    })
    this.setData({
      startX: e.changedTouches[0].clientX,
      startY: e.changedTouches[0].clientY,
      bankList: this.data.bankList
    })
  },
  //滑动事件处理
  touchmove: function(e) {
    var that = this,
      index = e.currentTarget.dataset.index, //当前索引
      startX = that.data.startX, //开始X坐标
      startY = that.data.startY, //开始Y坐标
      touchMoveX = e.changedTouches[0].clientX, //滑动变化坐标
      touchMoveY = e.changedTouches[0].clientY, //滑动变化坐标
      //获取滑动角度
      angle = that.angle({
        X: startX,
        Y: startY
      }, {
        X: touchMoveX,
        Y: touchMoveY
      });
    that.data.bankList.forEach(function(v, i) {
      v.isTouchMove = false
      //滑动超过30度角 return
      if (Math.abs(angle) > 30) return;
      if (i == index) {
        if (touchMoveX > startX) //右滑
          v.isTouchMove = false
        else //左滑
          v.isTouchMove = true
      }
    })
    //更新数据
    that.setData({
      bankList: that.data.bankList
    })
  },
  /**
   * 计算滑动角度
   * @param {Object} start 起点坐标
   * @param {Object} end 终点坐标
   */
  angle: function(start, end) {
    var _X = end.X - start.X,
      _Y = end.Y - start.Y
    //返回角度 /Math.atan()返回数字的反正切值
    return 360 * Math.atan(_Y / _X) / (2 * Math.PI);
  },


  // 账号输入框的监听事件
  bankcardInput: function(e) {
    var card = e.detail.value;
    // 格式
    var len = card.length
    //判断用户是输入还是回删
    if (len > this.data.cardlen) {
      //用户输入
      if ((len + 1) % 5 == 0) {
        card = card + ' '
      }
    } else {
      //用户回删
      card = card.replace(/(^\s*)|(\s*$)/g, "")
    }
    //将处理后的值赋予到输入框
    this.setData({
      userInputCardNum: card
    })
    //将每次用户输入的卡号长度赋予到长度中转站
    this.setData({
      cardlen: len
    });
    let cardNum = this.data.userInputCardNum.replace(/\s*/g, ""); // 格式化字符串的空格
    var temp = bankCard.bankCardAttribution(cardNum);
    if (temp == Error) {
      temp.bankName = '';
      temp.cardTypeName = '';
    } else {
      this.setData({
        cardname: temp.bankName,
        cardType: temp.cardTypeName,
        bankCode: temp.bankCode
      })
    }
  },
  // 姓名
  cardName: function(e) {
    this.setData({
      cardName: e.detail.value
    })
  },
  // 手机号
  cardPhone: function(e) {
    this.setData({
      cardPhone: e.detail.value
    })
  },
  // 验证码
  yzmInp: function(e) {
    this.setData({
      code: e.detail.value
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
  // 获取验证码
  getYzm: function(e) {
    let that = this;
    let yzm = that.data.yzm;
    let telephone = that.data.cardPhone;
    if (telephone.length < 11 || !(/^1[3456789]\d{9}$/.test(telephone))) {
      wx.showModal({
        content: '请输入正确手机号',
        confirmColor: '#6928E2',
        showCancel: false,
      })
      return;
    }
    if (!that.data.onOff) {
      return;
    } else {
      let times = 60;
      var data = {
        phone: telephone
      };
      wx.showLoading({
        title: '获取中',
      })
      // 获取验证码
      wx.request({
        url: ajax_url + '/wx/send/messages',
        method: "POST",
        data: data,
        header: {
          'content-type': 'application/x-www-form-urlencoded' // 默认值 
        },
        success: function(res) {
          wx.hideLoading();
          if (res.data.code == '200') {
            wx.showToast({
              title: '获取验证码成功',
              icon: 'success',
              duration: 2000
            })
            that.data.setInter = setInterval(function() {
              times--;
              if (times < 1) {
                that.setData({
                  yzmButtonName: "重新获取"
                });
                that.data.onOff = true;
                clearInterval(that.data.setInter);
              } else {
                that.setData({
                  yzmButtonName: times + 's'
                });
                that.data.onOff = false;
              }
            }, 1000);
          } else {
            wx.showModal({
              content: res.message,
              confirmColor: '#6928E2',
              showCancel: false,
            })
          }
        }
      })
    }
  },

})
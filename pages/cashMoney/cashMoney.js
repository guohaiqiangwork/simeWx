const app = getApp();
const ajax_url = app.globalData.ajax_url;
Page({

  /**
   * 页面的初始数据
   */
  data: {
    bar_Height: wx.getSystemInfoSync().statusBarHeight, //获取手机状态栏
    my_class: true, //是否显示白色
    ishideback: false, //是否显示箭头
    payMoudel: true, //是否展示密码框
    focus: false,
    Length: 6, //输入框个数  
    isFocus: false, //聚焦  
    Value: "", //输入的内容  
    ispassword: true, //是否密文显示 true为密文， false为明文。
    moneyNumber:''
  },
  password_input: function(e) {
    var that = this;
    var inputValue = e.detail.value;
    if (inputValue.length == 6) {
      wx.showLoading({
        title: '验证中...',
      })
      wx.request({
        url: ajax_url + '/account/passwordCheck/' + wx.getStorageSync('useId'),
        method: "post",
        data: {
          password: inputValue
        },
        header: {
          'Authorization': "Bearer" + " " + wx.getStorageSync('token'),
          'client': 'APP',
          'content-type': 'application/x-www-form-urlencoded',
        },
        success: function(res) {
          wx.hideLoading();
          if (res.data.code == '200') {
            var dataBase = {
              amount: that.data.moneyNumber,
              bankId: that.data.bankList[0].id,
              memberId: wx.getStorageSync('useId'),
            };
            wx.showLoading({
              title: '提取中...',
            })
            wx.request({
              url: ajax_url + '/account/reflectBank',
              method: "post",
              data: dataBase,
              header: {
                'Authorization': "Bearer" + " " + wx.getStorageSync('token'),
                'client': 'APP',
                'content-type': 'application/x-www-form-urlencoded'
              },
              success: function(res) {
                if (res.data.code == '200') {
                  that.setData({
                    inputValue: '',
                    Value: "",
                    payMoudel: true,
                    isFocus: false,
                    focus:false,
                    Length: 6, //输入框个数  
                  });
                  wx.hideLoading();

                  wx.navigateTo({
                    url: '/pages/cashResult/cashResult?payFalg=' + res.data.data,
                  })
                  
                } else {
                  that.setData({
                    inputValue: '',
                    Value: "",
                    payMoudel: true,
                    isFocus: false,
                    focus:false,
                    Length: 6, //输入框个数  
                  })
                  wx.hideLoading();
                  // wx.showModal({
                  //   content: res.data.message,
                  //   confirmColor: '#6928E2',
                  //   showCancel: false,
                  // })

                  wx.showToast({
                    title:res.data.message,
                    icon: 'none',
                    duration: 1000,
                  })

                }
              }
            })
          } else {
            that.setData({
              inputValue: '',
              Value: "",
              payMoudel: true,
              isFocus: false,
              focus:false,
              Length: 6, //输入框个数  
            });

            wx.showToast({
              title:res.data.message,
              icon: 'none',
              duration: 1000,
            })
            // wx.showModal({
            //   content: res.data.message,
            //   confirmColor: '#6928E2',
            //   showCancel: false,
            // })
          }
        }
      })
    }
    that.setData({
      Value: inputValue
    })
  },

  Tap() {
    var that = this;
    that.setData({
      isFocus: true,
    })
  },

  getFocus: function() {
    this.setData({
      focus: !this.data.focus
    })
  },
  goBank: function() {
    wx.navigateTo({
      url: "../bank/bank",
    })
  },
  //提现
  goMoney: function() {
    if (!this.data.moneyNumber){
      // wx.showModal({
      //   content: '请填写金额',
      //   confirmColor: '#6928E2',
      //   showCancel: false,
      // })
      wx.showToast({
        title:'请填写金额',
        icon: 'none',
        duration: 1000,
      })
      return;
    }else{
      this.setData({
        payMoudel: false
      });
    }

  },
  // 关闭密码框
  closeM: function() {
    var that = this
    that.setData({
      payMoudel: true
    });
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    this.getBankList(); //获取银行卡列表
    this.getMoney(); //获取余额
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
          if (_this.data.bankList.length > 0) {
            for (var i = 0; i < _this.data.bankList.length; i++) {
              _this.data.bankList[i].bankCard = _this.data.bankList[i].bankCard.replace(/\s*/g, "").substr(-4);
              switch (_this.data.bankList[i].bankCode) {
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
            };
          }
          _this.setData({
            bankList: _this.data.bankList,
          });
        }
      }
    })

  },
  // 更换
  bankBtn: function(e) {
    let bankList = "bankList[0]"
    this.setData({
      [bankList]: e.currentTarget.dataset.item,
      isRuleTrue: false,
      isScroll: true,
    })
  },
  //选择银行卡
  goBank: function() {
    this.setData({
      isRuleTrue: true
    })
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
          _this.setData({
            myMoney: res.data.data
          })
        } else {
          // wx.showModal({
          //   content: res.data.message,
          //   confirmColor: '#6928E2',
          //   showCancel: false,
          // })
          wx.showToast({
            title:res.data.message,
            icon: 'none',
            duration: 1000,
          })
        }
      }
    })
  },
  // 金额
  moneyNumber: function(e) {
    if (e.detail.value > this.data.myMoney.balance) {
      this.setData({
        moneyNumber: ''
      })
    } else {
      this.setData({
        moneyNumber: e.detail.value
      })
    }

  },
  // 全部提现
  wholeMoney: function() {
    this.setData({
      moneyNumber: this.data.myMoney.balance
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

  }
})
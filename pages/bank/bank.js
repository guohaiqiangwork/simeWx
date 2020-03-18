var bankCard = require('../../utils/bankType.js');
Page({

  /**
   * 页面的初始数据
   */
  data: {
    bar_Height: wx.getSystemInfoSync().statusBarHeight,
    ishideback: false,
    my_class: true,
    title: '绑定银行卡',
    bankList: [{
      name: '1',
      bankBj: 'ICBC'
    }, {
      name: '2',
      bankBj: 'ABC'
    }, {
      bankBj: 'CCB'
    }],
    yzmButtonName: '获取验证码',
    onOff: true, //验证码开关
    cardName: '', //持卡人姓名
    userInputCardNum: '', // 银行卡账号
    cardPhone: '', //手机号


    startX: 0, //开始坐标
    startY: 0
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    var that = this;
    if (that.data.bankList.length > 0) {
      that.setData({
        title: '我的银行卡',
      })
    };
    // 添加滑动事件列表
    for (var i = 0; i < this.data.bankList.length; i++) {
      this.data.bankList[i].isTouchMove = false;
      console.log(this.data.bankList[i].bankBj);
      switch (this.data.bankList[i].bankBj) {
        case 'ICBC':
          this.data.bankList[i].bankBj = 'bank_bgColor_zgp'
          this.data.bankList[i].imgUrl = '/image/bank/gsy.png';
          break;
        case 'ABC':
          this.data.bankList[i].bankBj = 'bank_bgColor_ny'
          this.data.bankList[i].imgUrl = '/image/bank/nyy.png';
          break;
        case 'CCB':
          this.data.bankList[i].bankBj = 'bank_bgColor_jj'
          this.data.bankList[i].imgUrl = '/image/bank/jsy.png';
          break;
        case 'BOC':
          this.data.bankList[i].bankBj = 'bank_bgColor_zgp'
          this.data.bankList[i].imgUrl = '/image/bank/zgy.png';
          break;
        case 'COMM':
          this.data.bankList[i].bankBj = 'bank_bgColor_jj'
          this.data.bankList[i].imgUrl = '/image/bank/jty.png';
          break;
        case 'PSBC':
          this.data.bankList[i].bankBj = 'bank_bgColor_ny'
          this.data.bankList[i].imgUrl = '/image/bank/yzy.png';
          break;
        case 'SPDB':
          this.data.bankList[i].bankBj = 'bank_bgColor_zgp'
          this.data.bankList[i].imgUrl = '/image/bank/qty.png';
          break;
        case 'CMB':
          this.data.bankList[i].bankBj = 'bank_bgColor_zgp'
          this.data.bankList[i].imgUrl = '/image/bank/zsy.png';
          break;
        default:
          this.data.bankList[i].bankBj = 'bank_bgColor_zgp'
          this.data.bankList[i].imgUrl = '/image/bank/qty.png';
          break;
      }

    }
    this.setData({
      bankList: this.data.bankList
    });
  },
  // 添加银行卡
  addBank:function(){
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
  //删除事件
  del: function(e) {
    this.data.bankList.splice(e.currentTarget.dataset.index, 1)
    this.setData({
      bankList: this.data.bankList
    })
  },
  //跳转
  goDetail() {
    console.log('点击元素跳转')
  },
  // 账号输入框的监听事件
  bankcardInput: function(e) {
    var card = e.detail.value;
    console.log(card + '是东方接口')
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
    console.log(JSON.stringify(temp) + '谁都能解开了')
    if (temp == Error) {
      temp.bankName = '';
      temp.cardTypeName = '';
    } else {
      this.setData({
        cardname: temp.bankName,
        cardType: temp.cardTypeName,
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
    let telephone = that.data.telephone;
    if (!that.data.onOff) {
      return;
    } else {
      let times = 60;
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
    }
  },

})
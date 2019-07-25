//index.js
//获取应用实例
const util = require('../../utils/util.js')
const Promise = require('../../utils/bluebird.core.min.js')
const app = getApp()
const qqmapsdk = app.globalData.qqmapsdk
const points = app.globalData.points
var mks = []
Page({
  onLoad: function () {     
    
  },
  onShow: function () {
    this.hideModal();
    var that = this;
    mks = []
    getCurrentLocation(that).then(function(locationRes){
      // 调用接口
      qqmapsdk.search({
        keyword: 'WC',  //搜索关键词
        success: function (res) { //搜索成功后的回调
          for (var i = 0; i < res.data.length; i++) {
            mks.push({ // 获取返回结果，放到mks数组中
             // title: res.data[i].title,
              id: res.data[i].id,
              latitude: res.data[i].location.lat,
              longitude: res.data[i].location.lng,
              iconPath: "../../images/toilet.png", //图标路径
              width: 30,
              height: 30
            })
            points[i] = res.data[i];
          }
          mks.push({ // 获取返回结果，放到mks数组中 
            latitude: that.data.latitude,
            longitude: that.data.longitude,
            iconPath: "../../images/location.png", //图标路径
            width: 30,
            height: 30
          })
         // var latitude = that.data.latitude;
         // var longitude = that.data.longitude;
          that.setData({ //设置markers属性，将搜索结果显示在地图中
            markers: mks,
           // latitude: latitude,
          //  longitude: longitude
          })
          var fromPoint = {"latitude": that.data.latitude, "longitude": that.data.longitude};
          calculateDistance(that, fromPoint, points)
        },
        fail: function (res) {
          console.log(res);
        }
      });
    })  
  },
  showModal: function (event) {
    //console.log(event.markerId);
    var i = event.markerId;
    // 显示遮罩层
    var animation = wx.createAnimation({
      duration: 200,
      timingFunction: "linear",
      delay: 0
    })
    this.animation = animation
    animation.translateY(300).step()
    this.setData({
      animationData: animation.export(),
      showModalStatus: true
    })
    setTimeout(function () {
      animation.translateY(0).step()
      this.setData({
        animationData: animation.export()
      })
    }.bind(this), 200)
  },

  hideModal: function () {
    // 隐藏遮罩层
    var animation = wx.createAnimation({
      duration: 200,
      timingFunction: "linear",
      delay: 0
    })
    this.animation = animation
    animation.translateY(300).step()
    this.setData({
      animationData: animation.export(),
    })
    setTimeout(function () {
      animation.translateY(0).step()
      this.setData({
        animationData: animation.export(),
        showModalStatus: false
      })
    }.bind(this), 200)
  }

})
function getCurrentLocation(obj) {
  return new Promise(function (resolve, reject) {
  wx.getSetting({
    success(res) {
      if (!res.authSetting["scope.userLocation"]) {
         wx.showModal({
           title: '授权提示',
           content: '您关闭了获取当前位置的授权，请去设置授权！',
         })
      } else {
        wx.getLocation({
          type: "wgs84",
          success: function (res) {
            resolve(res),
            obj.setData({
              'longitude': res.longitude,
              'latitude': res.latitude,
              'iconPath': "../../images/location.png",
              "scale": 16
            })
          },
        })
      }
    }
  })
  })
}

function calculateDistance(obj, fromPoint, points) {
  var toPoints = [];
  points.forEach(function (item, index) {
    toPoints[index] = {"latitude": item.location.lat, "longitude": item.location.lng};
  })
  qqmapsdk.calculateDistance({
    //mode: 'driving',//可选值：'driving'（驾车）、'walking'（步行），不填默认：'walking',可不填
    //from参数不填默认当前地址
    //获取表单提交的经纬度并设置from和to参数（示例为string格式）
    from: fromPoint || '', //若起点有数据则采用起点坐标，若为空默认当前地址
    to: toPoints, //终点坐标
    success: function (res) {//成功后的回调
      var res = res.result;
      var dis = [];
      for (var i = 0; i < res.elements.length; i++) {
        points[i]["distance"] = res.elements[i].distance;
      }
      points.sort(compare("distance"));
    },
    fail: function (error) {
      console.error(error);
    }
  })
}
function compare(property){
  return function (a, b) {
    var value1 = a[property];
    var value2 = b[property];
    return value1 - value2;
  }
}



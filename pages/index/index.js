//index.js
//获取应用实例
const util = require('../../utils/util.js')
const app = getApp()
const qqmapsdk = app.globalData.qqmapsdk
Page({
  onLoad: function () {     
    
  },
  onShow: function () {
    var that = this;
    getCurrentLocation(that);  
    // 调用接口
    qqmapsdk.search({
      keyword: 'WC',  //搜索关键词
      success: function (res) { //搜索成功后的回调
        var mks = []
        for (var i = 0; i < res.data.length; i++) {
          mks.push({ // 获取返回结果，放到mks数组中
            title: res.data[i].title,
            id: res.data[i].id,
            latitude: res.data[i].location.lat,
            longitude: res.data[i].location.lng,
            iconPath: "../../images/toilet.png", //图标路径
            width: 25,
            height: 25
          })
        }
        mks.push({ // 获取返回结果，放到mks数组中 
          latitude: that.data.latitude,
          longitude: that.data.longitude,
          iconPath: "../../images/location.png", //图标路径
          width: 30,
          height: 30
        })
        that.setData({ //设置markers属性，将搜索结果显示在地图中
          markers: mks
        })
      },
      fail: function (res) {
        console.log(res);
      }
    });
  },
  regionchange:function(){
    getCurrentLocation(this);
  }
})
function getCurrentLocation(obj) {
  wx.getSetting({
    success(res) {
      if (!res.authSetting["scope.userLocation"]) {
         wx.showModal({
           title: '授权提示',
           content: '您关闭了获取当前位置的授权，请去设置授权！',
         })
      } else {
          getLocation(obj);
      }
    }
  })
}
function getLocation(obj) {
  wx.getLocation({
    type: "wgs84",
    success: function (res) {
      obj.setData({
        'longitude': res.longitude,
        'latitude': res.latitude,
        'iconPath': "../../images/location.png",
        "scale": 16
      })
    },
  })
}



module.exports = {
  navTheme: "dark", // theme for nav menu
  primaryColor: "#1890FF", // primary color of ant design
  layout: "topmenu", // nav menu position: sidemenu or topmenu
  contentWidth: "Fluid", // layout of content: Fluid or Fixed, only works when layout is topmenu
  fixedHeader: true, // sticky header
  autoHideHeader: false, // auto hide header
  fixSiderbar: false, // sticky siderbar
  menu: {
    disableLocal: false
  },
  title: "WorkFlow",
  pwa: true,
  // Your custom iconfont Symbol script Url
  // eg：//at.alicdn.com/t/font_1039637_btcrd5co4w.js
  // 注意：如果需要图标多色，Iconfont 图标项目里要进行批量去色处理
  // Usage: https://github.com/ant-design/ant-design-pro/pull/3517
  iconfontUrl: "",
  socket:false,
  analysisCode:{
    baidu:{
      dev:'58d78ea7c93cb209226ec9664582e24d',
      stage:'84472774bbe62621da6e8e8b7e0d0cf4',
      prod:'227eb6bd1994a6ec9d1c48b1e20c6fc6',
    }
  }
};



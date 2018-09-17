/*
  样式替换在webpack中进行，所以修改此文件后请重新 npm start
  ant 默认样式地址
  https://github.com/ant-design/ant-design/blob/master/components/style/themes/default.less
 */

// const publicUrl =  (process.env.FLOW === 'XTEST' || process.env.FLOW === 'PROD') ? 'webapps/npms-web' : '';

const theme = {
    //"font-size-base": '14px', // 默认字号
    //"text-color": '#232322', // 字体颜色

    "primary-color": '#f4a034', // 主色 凸显色
    "layout-header-background": "#fff", // 布局头部 和 侧栏 背景颜色
};
module.exports = theme;

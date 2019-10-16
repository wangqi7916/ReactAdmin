const {override, fixBabelImports, addLessLoader} = require('customize-cra');

module.exports = override( 
  // 针对antd 实现按需打包：根据import
  fixBabelImports('import', {
    libraryName: 'antd',
    libraryDirectory: 'es', 
    style: true,
  }),
  addLessLoader({
    javascriptEnabled: true,
    modifyVars: {'@primary-color': '#1DA57A'},
  }),
);
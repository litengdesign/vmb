/*
 * @Author: Liteng
 * @Description: Description
 * @Date: 2020-07-03 09:13:24
 * @LastEditors: Liteng
 * @LastEditTime: 2020-09-28 22:19:51
 */
// 默认配置
export const environment = {
  production: false,
  Origin: 'http://106.15.239.187:5106',
  APITest: 'http://beidou.dahuasurvey.com:5406',
  API: 'http://beidou.dahuasurvey.com:5300',
  APIAutoDeform: 'http://beidou.dahuasurvey.com:8090', // 变形监测
  APISmartLocation: 'http://beidou.dahuasurvey.com:5300', // 智能位置
  APICheck: 'http://47.103.92.191:8080', // 香港打卡
  APITidal: 'http://beidou.dahuasurvey.com:5900', // 潮位云
  clientId: 'YCPipFrontEnd_publish',
  APIHdi: 'http://10.9.53.82:8092', // 安全隐患检查单
  APIHdiIframeOrigin: 'https://hdi.cccc-cdc.com', // 安全隐患URL
};

// 工程管理配置
export const environmentProject = {
  production: false,
  evnName: 'dev',
  Origin: 'http://beidou.dahuasurvey.com:5300',
};

// 变形监测配置
export const environmentAutomonitor = {
  production: false,
  evnName: 'dev',
  Origin: 'http://beidou.dahuasurvey.com:8090',
};

// 运砂量方
export const environmentVolum = {
  production: false,
  evnName: 'dev',
  Origin: 'http://beidou.dahuasurvey.com:5600',
};

// 香港打卡
export const environmentCheck = {
  production: false,
  evnName: 'dev',
  Origin: 'http://47.103.92.191:8080',
};




/*
 * @Author: Liteng
 * @Description: Description
 * @Date: 2020-07-03 09:13:24
 * @LastEditors: Liteng
 * @LastEditTime: 2020-09-28 17:06:24
 */
export const environment = {
  production: true,
  Origin: 'http://106.15.239.187:5106',
  APITest: 'http://10.9.53.103:5406',
  API: 'http://10.9.53.103:5300',
  APIAutoDeform: 'http://10.9.53.103:8090', // 变形监测
  APISmartLocation: 'http://10.9.53.103:5300', // 智能位置
  APICheck: 'http://47.103.92.191:8080', // 香港打卡
  APITidal: 'http://10.9.53.103:5900', // 潮位云
  clientId: 'YCPipFrontEnd_publish',
  APIHdi: 'http://10.9.53.82:8092', // 安全隐患检查单
  APIHdiIframeOrigin: 'https://hdi.cccc-cdc.com', // 安全隐患URL
};
// 系统设置
export const environmentPip = {
  production: true,
  Origin: 'http://106.15.239.187:5106',
}
// 工程管理配置
export const environmentProject = {
  production: true,
  Origin: 'http://10.9.53.103:5300',
};

// 变形监测配置
export const environmentAutomonitor = {
  production: true,
  Origin: 'http://10.9.53.103:8090',
};

// 运砂量方
export const environmentVolum = {
  production: true,
  Origin: 'http://10.9.53.103:5600',
};

// 香港打卡
export const environmentCheck = {
  production: true,
  Origin: 'http://47.103.92.191:8080',
};




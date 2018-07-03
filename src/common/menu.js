import { isUrl } from '../utils/utils';
import { formatterMenu } from '../utils/utils';

const menuData = [{
  name: '首页',
  icon: 'user',
  path: 'home',
}, {
  name: '订单',
  icon: 'user',
  path: 'order',
}, {
  name: '订单详情',
  icon: 'user',
  path: 'orderDetail',
}, {
  name: '我的',
  icon: 'user',
  path: 'mine',
}, {
  name: '我的卡',
  icon: 'user',
  path: 'mineQR',
}, {
  name: '餐厅详情',
  icon: 'user',
  path: 'restaurantInfo',
}, {
  name: '提交订单',
  icon: 'user',
  path: 'postOrder',
}, {
  name: '订餐',
  icon: 'user',
  path: 'orderDinner',
}, {
  name: '地址选择',
  icon: 'user',
  path: 'selectAddress',
}, {
  name: '支付结果',
  icon: 'user',
  path: 'payResult',
}, {
  name: '清除cookie',
  icon: 'user',
  path: 'clearCookie',
}];

export const getMenuData = () => formatterMenu(menuData);

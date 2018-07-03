import { stringify } from 'qs';
import request from '../utils/request';
import portUrl from '../common/portUrl.js';

// 查询订单支付成功与否
export async function checkPayOk(params) {
  return request(`${portUrl.urlRoot + portUrl.urlPort}pass/pay?${stringify(params)}`);
}

// 查询订单信息
export async function getOrderInfo(params) {
  return request(`${portUrl.urlRoot + portUrl.urlPort}order/info?${stringify(params)}`);
}
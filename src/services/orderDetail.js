import { stringify } from 'qs';
import request from '../utils/request';
import portUrl from '../common/portUrl.js';

// 查询订单信息
export async function getOrderInfo(params) {
  return request(`${portUrl.urlRoot + portUrl.urlPort}order/info?${stringify(params)}`);
}

// 查询订单商户信息
export async function getShopInfo(params) {
  return request(`${portUrl.urlRoot + portUrl.urlPort}order/info/merchant/info?${stringify(params)}`);
}

// 查询订单明细
export async function getOrderDetail(params) {
  return request(`${portUrl.urlRoot + portUrl.urlPort}order/detail/list?${stringify(params)}`);
}

// 查询订单客户信息
export async function getCustomerInfo(params) {
  return request(`${portUrl.urlRoot + portUrl.urlPort}order/info/customer/address?${stringify(params)}`);
}

// 查询订单餐别信息
export async function getMealInfo(params) {
  return request(`${portUrl.urlRoot + portUrl.urlPort}order/info/meal?${stringify(params)}`);
}

// 查询订单流状态
export async function getOrderStreamType(params) {
  return request(`${portUrl.urlRoot + portUrl.urlPort}order/info/stream/status?${stringify(params)}`);
}

// 查询订单流日志
export async function getOrderStreamList(params) {
  return request(`${portUrl.urlRoot + portUrl.urlPort}order/stream/log/list?${stringify(params)}`);
}

// 查询退款信息
export async function getRefundInfo(params) {
  return request(`${portUrl.urlRoot + portUrl.urlPort}order/refund/list?${stringify(params)}`);
}
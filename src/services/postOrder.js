import { stringify } from 'qs';
import request from '../utils/request';
import portUrl from '../common/portUrl.js';

// 查询用户默认地址
export async function getUserAddress(params) {
  return request(`${portUrl.urlRoot + portUrl.urlPort}customer/address/default?${stringify(params)}`);
}

// 添加新的用户地址
export async function addAddress(params) {
  return request(portUrl.urlRoot + portUrl.urlPort + 'customer/address', {
    method: 'POST',
    type: 'from',
    body: params,
  });
}

// 提交订单
export async function postOrder(params) {
  return request(portUrl.urlRoot + portUrl.urlPort + 'order/info', {
    method: 'POST',
    type: 'from',
    body: params,
  });
}

// 付款
export async function payOrder(params) {
  return request(portUrl.urlRoot + portUrl.urlPort + 'pass/pay', {
    method: 'POST',
    type: 'from',
    body: params,
  });
}

// 取消订单
export async function cancelOrder(params) {
  return request(portUrl.urlRoot + portUrl.urlPort + 'order/info/cancel', {
    method: 'PUT',
    type: 'from',
    body: params,
  });
}

// 确认取餐
export async function sureTakeMeal(params) {
  return request(portUrl.urlRoot + portUrl.urlPort + 'logistics/info/takemeal', {
    method: 'PUT',
    type: 'from',
    body: params,
  });
}
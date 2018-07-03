import { stringify } from 'qs';
import request from '../utils/request';
import portUrl from '../common/portUrl.js';

// 查询订单列表
export async function getOrderList(params) {
  return request(`${portUrl.urlRoot + portUrl.urlPort}order/info/page?${stringify(params)}`);
}
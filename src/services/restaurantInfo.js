import { stringify } from 'qs';
import request from '../utils/request';
import portUrl from '../common/portUrl.js';

// 查询餐厅信息
export async function getShopInfo(params) {
  return request(`${portUrl.urlRoot + portUrl.urlPort}merchant/info?${stringify(params)}`);
}

// 查询餐厅业务列表
export async function getShopBusinessList(params) {
  return request(`${portUrl.urlRoot + portUrl.urlPort}merchant/business/list?${stringify(params)}`);
}
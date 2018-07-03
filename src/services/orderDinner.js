import { stringify } from 'qs';
import request from '../utils/request';
import portUrl from '../common/portUrl.js';

// 查询餐厅业务（餐别）
export async function getShopBusiness(params) {
  return request(`${portUrl.urlRoot + portUrl.urlPort}merchant/business/meals?${stringify(params)}`);
}getShopBusinessIntroduce

// 查询餐厅全部业务
export async function getShopBusinessIntroduce(params) {
  return request(`${portUrl.urlRoot + portUrl.urlPort}merchant/business?${stringify(params)}`);
}

// 获取点餐分类列表
export async function getShopCategory(params) {
  return request(`${portUrl.urlRoot + portUrl.urlPort}commodity/category/list?${stringify(params)}`);
}

// 查询排菜列表
export async function getShopMeal(params) {
  return request(`${portUrl.urlRoot + portUrl.urlPort}commodity/plan/list?${stringify(params)}`);
}
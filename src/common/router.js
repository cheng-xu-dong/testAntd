import { createElement } from 'react';
import dynamic from 'dva/dynamic';
import pathToRegexp from 'path-to-regexp';
import { getMenuData } from './menu';
import portUrl from './portUrl.js';

let routerDataCache;

// 遍历模块是否已经加载，如果没有加载则加载，加载过后则不再加载
const modelNotExisted = (app, model) => (
  // eslint-disable-next-line
  !app._models.some(({ namespace }) => {
    return namespace === model.substring(model.lastIndexOf('/') + 1);
  })
);

// wrapper of dynamic
const dynamicWrapper = (app, models, component) => {
  // () => require('module')
  // transformed by babel-plugin-dynamic-import-node-sync
  if (component.toString().indexOf('.then(') < 0) {
    models.forEach((model) => {
      if (modelNotExisted(app, model)) {
        // eslint-disable-next-line
        app.model(require(`../models/${model}`).default);
      }
    });
    return (props) => {
      if (!routerDataCache) {
        routerDataCache = getRouterData(app);
      }
      return createElement(component().default, {
        ...props,
        routerData: routerDataCache,
      });
    };
  }
  // () => import('module')
  return dynamic({
    app,
    models: () => models.filter(
      model => modelNotExisted(app, model)).map(m => import(`../models/${m}.js`)
    ),
    // add routerData prop
    component: () => {
      if (!routerDataCache) {
        routerDataCache = getRouterData(app);
      }
      return component().then((raw) => {
        const Component = raw.default || raw;
        return props => createElement(Component, {
          ...props,
          routerData: routerDataCache,
        });
      });
    },
  });
};

// dynamic(app, model, component )
// 第一个参数为挂载的对象，就是你要将这个router挂载到哪个实例上。
// 第二个参数为这个router所需要的model。
// 第三个参数为这个router的组件。

function getFlatMenuData(menus) {
  let keys = {};
  menus.forEach((item) => {
    if (item.children) {
      keys[item.path] = { ...item };
      keys = { ...keys, ...getFlatMenuData(item.children) };
    } else {
      keys[item.path] = { ...item };
    }
  });
  return keys;
}

export const getRouterData = (app) => {
  const routerConfig = {};

  // 根路由加载顶层组件以及model
  routerConfig[portUrl.indexUrl + '/'] = {component: dynamicWrapper(app, ['user'], () => import('../layouts/BasicLayout'))}

  // 首页
  routerConfig[portUrl.indexUrl + '/home'] = {component: dynamicWrapper(app, ['home'], () => import('../routes/Home'))}

  // 订单
  routerConfig[portUrl.indexUrl + '/order'] = {component: dynamicWrapper(app, ['order'], () => import('../routes/Order'))}

  // 订单详情
  routerConfig[portUrl.indexUrl + '/orderDetail'] = {component: dynamicWrapper(app, ['orderDetail', 'postOrder'], () => import('../routes/OrderDetail'))}

  // 我的
  routerConfig[portUrl.indexUrl + '/mine'] = {component: dynamicWrapper(app, [], () => import('../routes/Mine'))}

  // 我的
  routerConfig[portUrl.indexUrl + '/mineQR'] = {component: dynamicWrapper(app, [], () => import('../routes/MineQR'))}

  // 餐厅详情
  routerConfig[portUrl.indexUrl + '/restaurantInfo'] = {component: dynamicWrapper(app, ['restaurantInfo'], () => import('../routes/RestaurantInfo'))}

  // 订餐
  routerConfig[portUrl.indexUrl + '/orderDinner'] = {component: dynamicWrapper(app, ['orderDinner'], () => import('../routes/OrderDinner'))}

  // 提交订单
  routerConfig[portUrl.indexUrl + '/postOrder'] = {component: dynamicWrapper(app, ['postOrder'], () => import('../routes/PostOrder'))}

  // 地址选择
  routerConfig[portUrl.indexUrl + '/selectAddress'] = {component: dynamicWrapper(app, ['postOrder'], () => import('../routes/SelectAddress'))}

  // 支付结果
  routerConfig[portUrl.indexUrl + '/payResult'] = {component: dynamicWrapper(app, ['payResult', 'postOrder'], () => import('../routes/PayResult'))}

  // 清除cookie
  routerConfig[portUrl.indexUrl + '/clearCookie'] = {component: dynamicWrapper(app, [], () => import('../routes/ClearCookie'))}
  
  // Get name from ./menu.js or just set it in the router data.
  const menuData = getFlatMenuData(getMenuData());

  // Route configuration data
  // eg. {name,authority ...routerConfig }
  const routerData = {};
  // The route matches the menu
  Object.keys(routerConfig).forEach((path) => {
    // Regular match item name
    // eg.  router /user/:id === /user/chen
    const pathRegexp = pathToRegexp(path);
    const menuKey = Object.keys(menuData).find(key => pathRegexp.test(`${portUrl.indexUrl}/${key}`));
    let menuItem = {};
    // If menuKey is not empty
    if (menuKey) {
      menuItem = menuData[menuKey];
    }
    let router = routerConfig[path];
    // If you need to configure complex parameter routing,
    // https://github.com/ant-design/ant-design-pro-site/blob/master/docs/router-and-nav.md#%E5%B8%A6%E5%8F%82%E6%95%B0%E7%9A%84%E8%B7%AF%E7%94%B1%E8%8F%9C%E5%8D%95
    // eg . /list/:type/user/info/:id
    router = {
      ...router,
      name: router.name || menuItem.name,
      authority: router.authority || menuItem.authority,
    };
    routerData[path] = router;
  });

  return routerData;
};

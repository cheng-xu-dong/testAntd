import React from 'react';
import DocumentTitle from 'react-document-title';
import { connect } from 'dva';
import { Route, Redirect, Switch, routerRedux } from 'dva/router';
import { Button, Toast } from 'antd-mobile';
import classNames from 'classnames';
import { getRoutes, getQueryString, setCookie, encryptByDES } from '../utils/utils';
import Authorized from '../utils/Authorized';
import { getMenuData } from '../common/menu';
import portUrl from '../common/portUrl.js';
import styles from './BasicLayout.less';

const { AuthorizedRoute } = Authorized;

class BasicLayout extends React.PureComponent {
  componentWillMount() {
    const That = this;

    this.props.dispatch({
      type: 'global/getUserInfo',
      payload: {
        That
      }
    });
  }

  componentDidMount() {
    let eti_number = getQueryString(this.props.location.search, 'eti_number');

    if (eti_number) {
      setCookie('microrestaurant_eti_number', eti_number);
    }
  }

  // 登录成功后在地址为根路径时则自动跳转至导航的第一个节点的页面
  getBashRedirect = (menu) => {
    let url = '';

    const bashRedirect = menu[0];
    if (bashRedirect) {
      if (bashRedirect.children) {
        url += '/' + bashRedirect.children[0].path;
      } else {
        url += '/' + bashRedirect.path;
      }
    }
    // According to the url parameter to redirect
    // 这里是重定向的,重定向到 url 的 redirect 参数所示地址
    const urlParams = new URL(window.location.href);
    const redirect = urlParams.searchParams.get('redirect');
    // Remove the parameters in the url
    if (redirect) {
      urlParams.searchParams.delete('redirect');
      window.history.replaceState(null, 'redirect', urlParams.href);
    } else {
      return portUrl.indexUrl + url;
    }
    return redirect;
  }

  render() {
    const {
      routerData, match, location
    } = this.props;

    const { userInfo } = this.props.global;

    const bashRedirect = this.getBashRedirect(getMenuData());

    let layout = (
          <div style={{ height: '100%' }}>
            {
              userInfo ? (
                <Switch>
                  {
                    getRoutes(match.path, routerData).map(item =>
                      (
                        <AuthorizedRoute
                          key={item.key}
                          path={item.path}
                          component={item.component}
                          exact={item.exact}
                          authority={item.authority}
                        />
                      )
                    )
                  }
                  <Redirect exact from={portUrl.indexUrl} to={bashRedirect} />
                </Switch>
              ) : ''
            }
          </div>
        )

    return (
      <DocumentTitle title="微餐厅">
        {layout}
      </DocumentTitle>
    );
  }
}

export default connect(({ global }) => ({
  global,
}))(BasicLayout);

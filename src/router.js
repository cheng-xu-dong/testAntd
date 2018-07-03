import React from 'react';
import { routerRedux, Switch } from 'dva/router';
import { LocaleProvider } from 'antd-mobile';
import { getRouterData } from './common/router';
import Authorized from './utils/Authorized';
import styles from './index.less';
import portUrl from './common/portUrl.js';

const { ConnectedRouter } = routerRedux;
const { AuthorizedRoute } = Authorized;

function RouterConfig({ history, app }) {
  const routerData = getRouterData(app);

  const BasicLayout = routerData[portUrl.indexUrl + '/'].component;
  return (
    <LocaleProvider>
      <ConnectedRouter history={history}>
        <Switch>
          <AuthorizedRoute
            path={portUrl.indexUrl + "/"}
            render={props => <BasicLayout {...props} />}
            authority={['admin', 'user', 'NULL', 'guest']}
            redirectPath={portUrl.indexUrl + "/"}
          />
        </Switch>
      </ConnectedRouter>
    </LocaleProvider>
  );
}

export default RouterConfig;

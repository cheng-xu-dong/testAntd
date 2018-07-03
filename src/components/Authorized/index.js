// import Authorized from './Authorized';
import AuthorizedRoute from './AuthorizedRoute';
import Secured from './Secured';
import check from './CheckPermissions.js';

/* eslint-disable import/no-mutable-exports */
let CURRENT = 'NULL';

let AuthorizedObj = {};

AuthorizedObj.Secured = Secured;
AuthorizedObj.AuthorizedRoute = AuthorizedRoute;
AuthorizedObj.check = check;

/**
 * use  authority or getAuthority
 * @param {string|()=>String} currentAuthority
 */
const renderAuthorize = (currentAuthority) => {
  if (currentAuthority) {
    if (currentAuthority.constructor.name === 'Function') {
      CURRENT = currentAuthority();
    }
    if (currentAuthority.constructor.name === 'String') {
      CURRENT = currentAuthority;
    }
  } else {
    CURRENT = 'NULL';
  }
  return AuthorizedObj;
};

export { CURRENT };
export default renderAuthorize;

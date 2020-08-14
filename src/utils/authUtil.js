import _ from "lodash";
import FormEvent from "../components/common/FormEvents";
// import { COOKIE_WHITELIST } from './cookie'
// import * as userPermissionUtil from './userPermissionUtil';
// import * as userInfoUtil from './userInfoUtil';
// import * as userProfileUtil from './userProfileUtil';

/**
 * 麻烦大家在这里维护
 * 【不需要移除的缓存】
 *         和
 * 【全局变量、函数的删除】
 */
function cleanAllStorageButExclude() {
  // const needBakLicenseeMap = ['CRM_INTL_TYPE', 'CRM_INTL_TYPE_USER', 'logo', COOKIE_WHITELIST];
  // const map = {};
  // _.forEach(needBakLicenseeMap, (key) => {
  //   const storageVal = localStorage.getItem(key);
  //   if (!_.isEmpty(storageVal)) {
  //     _.set(map, key, storageVal)
  //   }
  // })
  localStorage.clear();
  // _.forEach(map, (val, key) => {
  //   localStorage.setItem(key, val);
  // })

  // delete window.FC_CRM_USERID;
  // delete window.FC_CRM_SUBORDINATES;
  // delete window.FC_CRM_PARENT_SUBORDINATES;
  // delete window.FC_CRM_TERRITORY_CUSTOMER_IDS;

  // delete window.CALL_BACKDATE_LIMIT;

  // delete window.CALLBACK_FROM_STORE;

  // delete window.fc_permission;
  // delete window.SEGMENTATION_PRODUCT_LEVEL;
  // delete window.ADD_SEGMENTATION_ONLY;
  // delete window.EDIT_SEGMENTATION;

  // delete window.SEGMENTATION_AUTHORITY;

  // delete window.DCR_CREATE_CUSTOMER_RULE;
  // delete window.DCR_EDIT_CUSTOMER_RULE;

  // delete window.CURRENT_ACTIVE_TERRITORY;

  cleanInterval();
  cleanFormEvents();
  // delete window.ENABLE_ACCOUNT_AUTHORIZATION; //不需要处理不同租户的启用
}

// 清除轮询定时器
function cleanInterval() {
  // 删除通知轮询定时器
  window.clearInterval(window.POLLING_NOTIFICATION_INTERVAL);
  delete window.POLLING_NOTIFICATION_INTERVAL;
}
// 清除订阅事件
function cleanFormEvents() {
  FormEvent.unsubscribeAll();
}

export default {
  // backLicenseeAccount,
  // rollBackLicenseeAccount,
  cleanAllStorageButExclude
};

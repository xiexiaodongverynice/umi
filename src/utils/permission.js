import _ from "lodash";

const TAB_PERMISSION_PREFIX = "tab.";
const USER_PERMISSION = "userPermission";

export const setPermission = permission => {
  if (permission === undefined) {
    permission = [];
  }
  localStorage.setItem(USER_PERMISSION, JSON.stringify(permission));
};

export const getPermission = () => {
  const localPermissionJson = localStorage.getItem(USER_PERMISSION);
  if (localPermissionJson) {
    return JSON.parse(localPermissionJson);
  }
  return {};
};

export const cleanLocalStorage = () => {
  localStorage.removeItem(USER_PERMISSION);
  delete window.fc_permission;
};

//* 判断菜单的是否有权限
export function hasPermissionMenu(menu) {
  const permission = getPermission();
  return menu.filter(item => {
    const permissionKey = TAB_PERMISSION_PREFIX + item.api_name;
    const tabPermission = _.get(permission, permissionKey);
    const hiddenDevices = _.get(item, "hidden_devices", []);
    // If permission is not allowed, Go on.
    // if (tabPermission && tabPermission === 2 && _.indexOf(hiddenDevices, 'cellphone') === -1) {
    //   return item;
    // }
    if (
      _.eq(_.get(permission, `tab.${item.api_name}`), 2) &&
      _.indexOf(hiddenDevices, "PC") < 0
    ) {
      return item;
    }
    return false;
  });
}

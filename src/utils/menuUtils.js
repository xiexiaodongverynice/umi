import _ from "lodash";
import { hasPermissionMenu } from "./permission";
import { arrayToTree } from "./index";

// 将有权限的菜单数据 组合成菜单数组
export function getMenuData(menu) {
  const hasPremissionMenu = hasPermissionMenu(menu);
  const dataTree = arrayToTree(
    _.sortBy(hasPremissionMenu, ["display_order", "create_time"]),
    "api_name",
    "p_api_name"
  );
  const menuData = dataTree.map(item => {
    // debugger;
    if (item.children && item.children.some(child => child.label)) {
      return {
        path: `/${item.api_name}`,
        name: `${item.label}`,
        children: item.children.map(child => ({
          path: `/${item.api_name}/${child.api_name}`,
          name: `${child.label}`,
          exact: true
        }))
      };
    }
    return {
      path: `${item.api_name}`,
      name: `${item.label}`
    };
  });
  return menuData;
}

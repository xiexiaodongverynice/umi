import _ from "lodash";
import router from "umi/router";
import { basePathPrefix } from "@/utils/config";
import { initGlobalWindowData } from "@/utils/windowUtil";
import { getMenuData } from "../config/menu";
import { getToken } from "@/utils/index";

function formatter(data) {
  _.forEach(data, item => {
    // const deepItem = _.cloneDeep(item);
    if (item.path) {
      if (item.path !== "/" && !_.startsWith(item.path, "/user")) {
        // 针对/和user的不需要转
        // data.push(deepItem)
        _.set(item, "path", `${basePathPrefix}${item.path}`);
      }
      if (_.has(item, "redirect")) {
        // data.push(deepItem)
        _.set(item, "redirect", `${basePathPrefix}${item.redirect}`);
      }
      if (item.routes) {
        formatter(item.routes);
      }
    }
  });
}

export function patchRoutes(routes) {
  // console.log("patchRoutes======+>", patchRoutes);
  // formatter(routes);
  getMenuData().map(item => {
    if (!_.startsWith(`${item.alias}`, "/")) {
      routes.unshift({ path: `/${item.alias}`, redirect: `${item.path}` });
    } else {
      routes.unshift({ path: `${item.alias}`, redirect: `${item.path}` });
    }
  });
  // console.warn(routes);
}

// 用于改写把整个应用 render 到 dom 树里的方法。
export function render(oldRender) {
  const { hash } = location;
  const token = getToken(hash);
  if (token) {
    localStorage.setItem("token", token);
  }
  // loginWithToken
  // console.log("render======+>", hash);
  setTimeout(oldRender, 1000);
}

// 用于在初始加载和路由切换时做一些事情。
export function onRouteChange({ location, routes, action }) {
  // bacon(location.pathname);
  // console.log("onRouteChange===>", location, routes, action);

  // https://github.com/umijs/umi-plugin-tongji
  // window._hmt.push(['_trackEvent', category, action, opt_label, opt_value]);
  const { _hmt } = window;
  if (_hmt) {
    _hmt.push(["_trackPageview", `/#${location.pathname}`]);
    // _hmt.push(['_trackEvent', 'IosDoctor', 'click', '来康医生IOS版', 'opt_value']);
  }
}

//
// export function rootContainer(container) {
//   // const DvaContainer = require('@tmp/DvaContainer').default;
//   // return React.createElement(DvaContainer, null, container);
// }

// 修改传给路由组件的 props。// 给props增加新的参数，比如全局变量之类
export function modifyRouteProps(props, { route }) {
  initGlobalWindowData();
  const query = _.get(props, "location.query");
  const path = _.get(route, "path");
  if (
    !_.startsWith(path, "/iframe") &&
    !_.startsWith(path, "/user") &&
    path !== "/"
  ) {
    if (!window.TOKEN) {
      router.push("/user/login");
    }
  }
  const token = _.get(query, "token");
  if (token) {
    localStorage.setItem("token", token);
  }
  if (_.startsWith(path, "/iframe")) {
    _.set(props, "iframe", true);
    try {
      window.SSL = JSON.parse(_.get(query, "ssl", "true"));
    } catch (e) {
      console.error(e);
      window.SSL = true;
    }

    const layoutParams = _.get(query, "layout");
    let layout = {};
    if (!_.isEmpty(layoutParams)) {
      try {
        layout = JSON.parse(layoutParams);
      } catch (e) {
        console.error("转换layout失败，layout=%s", layoutParams);
      }
    }
    window.IFRAME = true;
    window.LAYOUT = layout;
  }
  // console.log("modifyRouteProps===>", props, route);

  return props; // { ...props, foo: 'bar' };
}

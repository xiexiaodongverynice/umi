/* eslint no-useless-escape:0 import/prefer-default-export:0 */
const reg = /(((^https?:(?:\/\/)?)(?:[-;:&=\+\$,\w]+@)?[A-Za-z0-9.-]+(?::\d+)?|(?:www.|[-;:&=\+\$,\w]+@)[A-Za-z0-9.-]+)((?:\/[\+~%\/.\w-_]*)?\??(?:[-\+=&;%@.\w_]*)#?(?:[\w]*))?)$/;

const isUrl = path => reg.test(path);

const isAntDesignPro = () => {
  if (ANT_DESIGN_PRO_ONLY_DO_NOT_USE_IN_YOUR_PRODUCTION === "site") {
    return true;
  }

  return window.location.hostname === "preview.pro.ant.design";
}; // 给官方演示站点用，用于关闭真实开发环境不需要使用的特性

const isAntDesignProOrDev = () => {
  const { NODE_ENV } = process.env;

  if (NODE_ENV === "development") {
    return true;
  }

  return isAntDesignPro();
};

export function rand(len = 8) {
  let text = "";
  const possible =
    "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
  for (let i = 0; i < len; ) {
    text += possible.charAt(Math.floor(Math.random() * possible.length));
    i += 1;
  }
  return text;
}

export function callAnotherFunc(fnFunction, vArgument, pArgument = {}) {
  try {
    if (_.isFunction(fnFunction)) {
      return fnFunction(vArgument, pArgument);
    } else {
      return false;
    }
  } catch (e) {
    // consoleUtil.error('[error]发现错误', fnFunction, vArgument, pArgument);
    return false;
  }
}

export { isAntDesignProOrDev, isAntDesignPro, isUrl };

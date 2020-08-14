import component from "./zh-CN/component";
import globalHeader from "./zh-CN/globalHeader";
import menu from "./zh-CN/menu";
import pwa from "./zh-CN/pwa";
import settingDrawer from "./zh-CN/settingDrawer";
import settings from "./zh-CN/settings";
import login from "./zh-CN/login";
import form from "./zh-CN/form";
import table from "./zh-CN/table";

import * as localeUtil from "../utils/localeUtil";

const locales = localeUtil.getAppIntlItem('zh_CN');

export default {
  "reset": "重置",
  "search": "搜索",
  "years": "年",
  "months": "个月",
  "days": "天",
  "hours": "小时",
  "minutes": "分钟",
  "second": "秒",
  "ok": "确定",
  "navBar.lang": "语言",
  "layout.user.link.help": "帮助",
  "layout.user.link.privacy": "隐私",
  "layout.user.link.terms": "条款",
  "app.preview.down.block": "下载此页面到本地项目",
  ...globalHeader,
  ...menu,
  ...settingDrawer,
  ...settings,
  ...pwa,
  ...component,
  ...login,
  ...form,
  ...table,
  ...locales
};

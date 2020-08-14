import component from "./zh-TW/component";
import globalHeader from "./zh-TW/globalHeader";
import menu from "./zh-TW/menu";
import pwa from "./zh-TW/pwa";
import settingDrawer from "./zh-TW/settingDrawer";
import settings from "./zh-TW/settings";
import login from "./zh-TW/login";
import form from "./zh-TW/form";
import table from "./zh-TW/table";

import * as localeUtil from "../utils/localeUtil";

const locales = localeUtil.getAppIntlItem('zh_TW');

export default {
  "ok": "確定",
  "navBar.lang": "語言",
  "layout.user.link.help": "幫助",
  "layout.user.link.privacy": "隱私",
  "layout.user.link.terms": "條款",
  "app.preview.down.block": "下載此頁面到本地項目",
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

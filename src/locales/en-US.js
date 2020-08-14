import _ from 'lodash';
import component from "./en-US/component";
import globalHeader from "./en-US/globalHeader";
import menu from "./en-US/menu";
import pwa from "./en-US/pwa";
import settingDrawer from "./en-US/settingDrawer";
import settings from "./en-US/settings";
import login from "./en-US/login";
import form from "./en-US/form";
import table from "./en-US/table";
import * as localeUtil from "../utils/localeUtil";

const locales = localeUtil.getAppIntlItem('en_US');
console.log('en-us',locales)
export default {
  "reset": "Reset",
  "search": "Search",
  "years": "years",
  "months": "months",
  "days": "days",
  "hours": "hours",
  "minutes": "minutes",
  "second": "second",
  "ok": "OK",
  "navBar.lang": "Languages",
  "layout.user.link.help": "Help",
  "layout.user.link.privacy": "Privacy",
  "layout.user.link.terms": "Terms",
  "app.preview.down.block": "Download this page to your local project",
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

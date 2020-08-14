/**
 * Created by wans on 10/11/2017.
 * http://www.unicode.org/cldr/charts/28/supplemental/language_plural_rules.html#zh
 * @flow
 */


import _ from 'lodash';
import { getLocale } from 'umi/locale';

// 推荐在入口文件全局设置 locale
import consoleUtil from './consoleUtil';

const LOCALES = 'workflow_locales';
const LOCALES_TYPE = 'umi_locale';
// 01/02/2018 - TAG: 用户手动设置的语言类型
const LOCALES_TYPE_USER = 'LOCALES_TYPE_USER';

export const setIntlSetting = (intl={}) => {
  consoleUtil.log('setIntlSetting')
  localStorage.setItem(LOCALES, JSON.stringify(intl));
};

export const getLocales = () => {
  const localCrmIntlJson = localStorage.getItem(LOCALES);
  if (localCrmIntlJson) {
    return JSON.parse(localCrmIntlJson);
  } else {
    return {};
  }
};

// 通过指定的key，获取方言数据缓存
export const getAppIntlItem = (itemCode) => {
  const locales = getLocales();
  return _.get(locales, itemCode);
};



// 默认初始化方言
export const initIntlSetting = () => {
  // const crmIntlType = getLOCALES_TYPE();
  // changeLOCALES_TYPE(crmIntlType);
};

// 修改缓存的方言类型
export function changeLocale(locale=getLocale()) {
  const currentLocale =  _.replace(locale, '_', '-');
  localStorage.setItem(LOCALES_TYPE, currentLocale);
  console.log('currentLocale==>',currentLocale)
  // setLocale(currentLocale,false);
}

// 清除方言缓存，保留方言类型，只清除数据
export const cleanLocalStorage = () => {
  localStorage.removeItem(LOCALES);
  // delete window.fc_permission;
};

// Link：https://github.com/sindresorhus/query-string#readme
import _ from "lodash";
import queryString from "query-string";
// import BIPowerSettingUtil from "./BIPowerSettingUtil";
// import consoleUtil from '../utils/consoleUtil';
// import storage from 'storageUtil';
// const queryString = require('query-string');
// import queryString from 'query-string';

function parse(searchString) {
  return queryString.parse(searchString);
}

function stringify(searchParam) {
  // consoleUtil.log(searchParam);
  return queryString.stringify(searchParam);
}

function getArgsFromSHref(searchString, parameter, needParse = false) {
  if (_.isEmpty(searchString)) {
    return null;
  }
  const parsed = parse(searchString);
  // consoleUtil.log(parsed);
  const args = _.get(parsed, parameter);
  if (needParse && args) {
    // consoleUtil.log('args===>', args)
    return JSON.parse(args);
  }
  return args;
}

function getToken(searchString) {
  const arr = searchString.split("?")[1];
  if (arr) {
    const args = arr.split("=");
    return args[0] === "token" ? args[1] : null;
  }
  return null;
}

// 将过滤条件转化成实际数据
function formatter(
  search = {},
  itemData = {},
  currentComponentQueryFilter = []
) {
  // const searchTemp = _.cloneDeep(search);

  return _.mapValues(search, value => {
    if (_.startsWith(value, "__") && _.endsWith(value, "__")) {
      // 通过setting全局变量
      return null;
    }
    if (_.startsWith(value, "{{") && _.endsWith(value, "}}")) {
      // 通过record字段属性
      const compiledTitle = _.template(value);
      // TODO 目前仅支持模版，不支持js方式
      return compiledTitle(itemData);
    }
    if (_.startsWith(value, "%%") && _.endsWith(value, "%%")) {
      // 通过过滤器参数
      const searchField = _.trim(value, "%");
      const searchValue = _.get(
        _.find(currentComponentQueryFilter, { field: searchField }),
        "value"
      );
      // consoleUtil.log('searchField===>',searchField,searchValue);
      return searchValue;
    }
    return value;
  });
  // return _.zipObject(_.mapKeys(search),searchValue)
}

export default { parse, stringify, formatter, getArgsFromSHref, getToken };

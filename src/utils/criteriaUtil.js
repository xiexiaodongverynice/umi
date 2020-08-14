/**
 * Created by xinli on 2017/12/19.
 */
import _ from 'lodash';
export const processCriterias = (criterias = [], t, p) => {
  const processed = criterias.map((x) => {
    return {
      ...x,
      value: processCriteriaValues(x.value, t, p),
    };
  }).filter(x => !_.isEmpty(x.value) && _.indexOf(x.value, undefined) < 0); // 去掉value为空的查询条件，避免后台接口报错
  return processed;
};

export const processCriteriaValues = (value = [], t, p) => {
  if (_.isArray(value)) {
    return value.map((x) => {
      if (_.isObject(x) && x.expression) {
        if (x.expression.indexOf('return') >= 0) { // 使用函数
          return new Function('t', 'p', x.expression)(t, p);
        } else { // 直接使用eval表达式
          const evaled = eval(x.expression);
          if (typeof evaled === 'function') {
            return evaled();
          } else {
            return evaled;
          }
        }
      } else {
        return x;
      }
    });
  } else if (_.isObject(value) && value.expression) {
    if (value.expression.indexOf('return') >= 0) {
      return [].concat(new Function('t', 'p', value.expression)(t, p));
    } else {
      const evaled = eval(value.expression);
      if (typeof evaled === 'function') {
        return [].concat(evaled());
      } else {
        return [].concat(evaled);
      }
    }
  } else {
    // 无法解析
    return [];
  }
};


import _ from "lodash";
import moment from "moment";
import { formatMessage } from "umi-plugin-react/locale";
import { processDefaultFieldValue } from "./criteriaUtil";
import FormEvent from "@/utils/FormEvent";

/**
 * 数组格式转树状结构
 * @param   {array}     array
 * @param   {String}    id
 * @param   {String}    pid
 * @param   {String}    children
 * @return  {Array}
 */
const arrayToTree = (array, id = "id", pid = "pid", children = "children") => {
  const data = _.cloneDeep(array);
  const result = [];
  const hash = {};
  const dataIndex = "kg";
  data.forEach((item, index) => {
    if (data[index][id]) {
      hash[data[index][id]] = data[index];
    } else if (pid) {
      hash[dataIndex + index] = data[index];
    } else {
      // hash['first'] = data[index];
      hash.first = data[index];
    }
  });

  data.forEach(item => {
    const hashVP = hash[item[pid]];
    if (hashVP) {
      if (!hashVP[children]) {
        hashVP[children] = [];
      }
      hashVP[children].push(item);
    } else {
      result.push(item);
    }
  });
  return result;
};

export function rand(len = 8) {
  let text = "";
  const possible =
    "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
  for (let i = 0; i < len; i = +1) {
    text += possible.charAt(Math.floor(Math.random() * possible.length));
    // i += 1;
  }
  return text;
}

export function callAnotherFunc(fnFunction, vArgument, pArgument = {}) {
  try {
    if (_.isFunction(fnFunction)) {
      return fnFunction(vArgument, pArgument);
    }
    return false;
  } catch (e) {
    console.error("[error]发现错误", fnFunction, vArgument, pArgument);
    return false;
  }
}


export const formatDate = date => {
  return moment(date).format("YYYY-MM-DD HH:mm:ss");
};

export const toTimeStamp = date => {
  return moment(date).valueOf();
};
const millsToTime = (mills) =>{
  if (!mills) {
    return "";
  }
  const s = mills / 1000;
  if (s < 60) {
    return `${s.toFixed(0)  } ${formatMessage({ id: 'second', defaultMessage: '秒' })}`
  }
  const m = s / 60;
  if (m < 60) {
    return `${m.toFixed(0)  }  ${formatMessage({ id: 'minutes', defaultMessage: '分钟' })}`
  }
  const h = m / 60;
  if (h < 24) {
    return `${h.toFixed(0)  }  ${formatMessage({ id: 'hours', defaultMessage: '小时' })}`
  }
  const d = h / 24;
  if (d < 30) {
    return `${d.toFixed(0)  }  ${formatMessage({ id: 'days', defaultMessage: '天' })}`
  }
  const month = d / 30;
  if (month < 12) {
    return `${month.toFixed(0)  }  ${formatMessage({ id: 'months', defaultMessage: '个月' })}`
  }
  const year = month / 12;
  return `${year.toFixed(0)  }  ${formatMessage({ id: 'year', defaultMessage: '年' })}`

};
const durationMinuteTime = (StatusMinute) => {
  if (StatusMinute == null || StatusMinute == undefined) {
    return;
  }
  const day = parseInt(StatusMinute / 60 / 24);
  const hour = parseInt(StatusMinute / 60 % 24);
  const min = parseInt(StatusMinute % 60);
  StatusMinute = '';
  if (day > 0) {
    StatusMinute = `${day}天`;
  }
  if (hour > 0) {
    StatusMinute += `${hour}小时`;
  }
  if (min > 0) {
    StatusMinute += `${parseFloat(min)}分钟`;
  }
  return StatusMinute;
};
export const getToken = searchString => {
  const arr = searchString.split("?")[1];
  if (arr) {
    const args = arr.split("=");
    return args[0] === "token" ? args[1] : null;
  }
  return null;
};

export { arrayToTree, millsToTime,durationMinuteTime };

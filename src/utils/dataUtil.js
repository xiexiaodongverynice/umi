/**
 * Created by wans on 2018/04/13.
 */
import _ from "lodash";
import { callAnotherFunc } from "./utils";
import consoleUtil from "../utils/consoleUtil";
import * as criteriaUtil from "./criteriaUtil";

const Papa = require("papaparse");
const json2csv = require("json2csv");
// const Json2csvParser = require('json2csv').Parser;

export function dealDataByDataSourceType(
  myDatas,
  fields,
  fieldNames,
  dataSourceType
) {
  // consoleUtil.log('dataSourceType---columns', dataSourceType, fields, fieldNames);
  const fieldss = [];
  _.forEach(fields, (field, index) => {
    let value = field;
    const label = fieldNames[index];
    const fieldObj = { label, value };
    if (_.isObject(field)) {
      const { key, expression } = field;
      // label = key;
      value = row => callAnotherFunc(new Function("t", expression), row);
      _.set(fieldObj, "value", value);
      // _.set(fieldObj,'label',label);
      _.set(fieldObj, "stringify", true);
    }
    fieldss.push(fieldObj);
  });
  // consoleUtil.log('fieldss==========>',fieldss);
  try {
    const opts = {
      // data: myDatas,
      fields: fieldss,
      fieldNames,
      quotes: ""
    };

    // const json2csvParser = new Json2csvParser(opts);
    // const resultStr = json2csvParser.parse(myDatas);

    // consoleUtil.log(resultStr);
    const resultStr = json2csv.parse(myDatas, opts);
    const result = Papa.parse(resultStr);
    // consoleUtil.log(result);
    return _.get(result, "data");
  } catch (err) {
    // Errors are thrown for bad options, or if the data is empty and no fields are provided.
    // Be sure to provide fields if it is possible that your data array will be empty.
    consoleUtil.error(err);
  }

  return [];
}

export function buildQueryDefaultFilterCriteria(_input = {}, props = {}) {
  let defaultCriteria = [];
  const filters = _.find(_.get(_input, "area"), { id: "filters" });
  if (!_.isEmpty(filters)) {
    const filterColumnList = _.get(filters, "columnList");

    // TODO 此处应该有更加详细的解析，比如 operator属性
    // _.forEach(filterColumnList, (filterColumn) => {
    //   const filterCriteria = _.get(filterColumn, 'complexFilter.filters');
    //   defaultCriteria = _.concat(defaultCriteria, filterCriteria);
    // });
    defaultCriteria = _.concat(defaultCriteria, filterColumnList);
  }
  const processCriteriaParams = {
    criteria: defaultCriteria,
    props
  };
  return criteriaUtil.processCriteria(processCriteriaParams);
}
export function buildQueryDefaultFilterGroupBy(_input = {}) {
  const defaultFilterGroupBy = [];
  const areaRow = _.find(_.get(_input, "area"), { id: "area_row" });
  const areaColumn = _.find(_.get(_input, "area"), { id: "area_column" });
  const areaRowColumnList = _.get(areaRow, "columnList", []);
  const areaColumnColumnList = _.get(areaColumn, "columnList", []);
  const areaColumnFields = _.concat(
    [],
    areaRowColumnList,
    areaColumnColumnList
  );

  if (!_.isEmpty(areaColumnFields)) {
    // TODO 此处应该有更加详细的解析，比如 operator属性
    _.forEach(areaColumnFields, column => {
      const groupBy = {
        field: _.get(column, "name", _.get(column, "caption")), // 此处功能需要修正，统一使用name字段
        label: _.get(column, "name", _.get(column, "caption"))
      };

      const operator = _.get(column, "aggregator");
      if (!_.isEmpty(operator)) {
        _.set(groupBy, "operator", operator);
      }
      if (!_.isEmpty(groupBy)) {
        defaultFilterGroupBy.push(groupBy);
      }
    });
  }

  return defaultFilterGroupBy;
}

export function buildQueryDefaultFilterOrders(_input = {}, otherParams = {}) {
  const sortField = _.get(
    otherParams,
    "sortField",
    _.get(_input, "orderBy", "update_time")
  );
  const sortOrder = _.get(
    otherParams,
    "sortOrder",
    _.get(_input, "order", "desc")
  );
  const defaultFilterOrders = [];
  const orders = _.get(_input, "orders");
  if (!_.isEmpty(orders)) {
    _.forEach(orders, order => {
      const orderName = _.get(order, "name");
      let orderSorting = _.get(order, "order");
      if (orderName === sortField) {
        orderSorting = sortOrder;
      }
      defaultFilterOrders.push({
        field: orderName, // _.get(order, 'name'),
        sorting: orderSorting // _.get(order, 'order'),
      });
    });
    return defaultFilterOrders;
  } else {
    return {
      orderBy: sortField, // _.get(otherParams, 'sortField', _.get(_input, 'orderBy', 'update_time')),
      order: sortOrder // _.get(otherParams, 'sortOrder', _.get(_input, 'order', 'desc')),
    };
  }
}

export function buildQueryDataDeal({
  componentDataSource = [],
  currentComponentQueryFilter = [],
  otherFilter = [],
  otherParams = {},
  props = {}
}) {
  let currentCriteria = [];
  const {
    dataFromId,
    dataFormType,
    customRelationQueryField,
    groupBy,
    _input,
    supportFilter = false
  } = componentDataSource;

  // 处理默认过滤器
  if (supportFilter) {
    const defaultCriteria = buildQueryDefaultFilterCriteria(_input, props);
    currentCriteria = currentCriteria
      .concat(defaultCriteria)
      .concat(currentComponentQueryFilter)
      .concat(otherFilter);
  }

  let queryDataDeal = {
    joiner: "and",
    groupBy,
    customRelationQueryField,
    criteria: currentCriteria,
    pageSize: _.get(otherParams, "pageSize", _.get(_input, "limitNum", 1000)),
    pageNo: _.get(otherParams, "pageNo", 0),
    objectApiName: dataFromId
  };
  // 处理group by 字段集合
  const groupByQueryFields = buildQueryDefaultFilterGroupBy(_input);
  if (!_.isEmpty(groupByQueryFields)) {
    _.set(queryDataDeal, "groupBy.query_fields", groupByQueryFields);
  }

  // 处理排序功能

  const orders = buildQueryDefaultFilterOrders(_input, otherParams);

  if (!_.isEmpty(orders)) {
    if (_.isArray(orders)) {
      _.set(queryDataDeal, "orders", orders);
      // _.set(queryDataDeal, 'orderBy', _.keys(orders)[0]);
      // _.set(queryDataDeal, 'order', _.values(orders)[0]);
    } else if (_.isObject(orders)) {
      queryDataDeal = Object.assign(queryDataDeal, orders);
    }
  }

  return queryDataDeal;
}

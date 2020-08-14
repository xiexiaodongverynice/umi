import _ from "lodash";
import * as storageUtil from "@/utils/storageUtil";

export function loadAllObject() {
  const object_all_describe = storageUtil.get("object_all_describe");
  return object_all_describe;
}

export function getObjectDescribeItem({ object_api_name }) {
  const object_all_describe = loadAllObject();
  const object_describe_item = _.chain(object_all_describe)
    .filter(x => x.api_name === object_api_name)
    .head()
    .value();
  return object_describe_item;
}

export function getObjectDescribeField({ object_api_name, field_api_name }) {
  const object_describe_item = getObjectDescribeItem({ object_api_name });
  const object_describe_fields_list = _.get(object_describe_item, "fields");
  const object_describe_field = _.chain(object_describe_fields_list)
    .filter(x => x.api_name === field_api_name)
    .head()
    .value();
  return object_describe_field;
}

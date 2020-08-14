import React from 'react';
import _ from 'lodash';
import { formatMessage } from "umi-plugin-react/locale";
import { Form, Input, Modal, Select } from "antd";

const FormItem = Form.Item;
const { TextArea } = Input;
const { Option } = Select;

const formItemLayout = {
  labelCol: {
    span: 6,
  },
  wrapperCol: {
    span: 14,
  },
};

const modal = ({
  categoryList={},
  item = {},
  onOk,
  form: {
    getFieldDecorator,
    validateFields,
    getFieldsValue,
  },
  ...modalProps
}) => {

  const categoryOptions = _.map(_.keys(categoryList),(categoryId)=>{
    return <Option key={categoryId} value={categoryId}>{_.get(_.get(categoryList,categoryId),'label')}</Option>
  })
  const handleOk = () => {
    validateFields((errors) => {
      if (errors) {
        return;
      }
      const data = {
        ...getFieldsValue(),
        id: item.id,
      };
      onOk(data);
    });
  };

  const handleValidEncryptionJson = (rule, value = '{}', callback) => {
    if (_.startsWith(value, '[')) {
      callback('不支持数组');
    }
    if (!isJSON(value)) {
      callback('请输入正确的json字符串');
    }
    // Note: 必须总是返回一个 callback，否则 validateFieldsAndScroll 无法响应
    callback();
  };

  function isJSON(str) {
    if (typeof str === 'string') {
      try {
        if (str.indexOf('{') > -1) {
          return true;
        } else {
          return false;
        }
      } catch (e) {
        // console.log(e);
        return false;
      }
    }
    return false;
  }
  const modalOpts = {
    ...modalProps,
    onOk: handleOk,
  };

  return (
    <Modal {...modalOpts}>
      <Form layout="horizontal">
        <FormItem label="流程分类" hasFeedback {...formItemLayout}>
          {getFieldDecorator('category_id', {
            initialValue: _.get(item,'category_id'),
            rules: [
              {
                required: true,
                min: 2,
                message:'Please select workflow category'
              },
            ],
          })(
            <Select
              size="default"
              placeholder="请选择"
              style={{ width: "100%" }}
              filterOption={(input, option) => option.props.children.toLowerCase().indexOf(input.toLowerCase()) >= 0}
            >
              <Option value=''>请选择</Option>
              {
               !_.isEmpty(categoryOptions)&& categoryOptions
              }
            </Select>,
          )}
        </FormItem>
        {/*<FormItem label="关联业务对象" hasFeedback {...formItemLayout}>
          {getFieldDecorator('ref_object_api_name', {
            initialValue: _.get(item,'ref_object_api_name'),
            rules: [
              {
                required: true,
              },
            ],
          })(<Input />)}
        </FormItem>*/}
       {/* <FormItem label="备注" hasFeedback {...formItemLayout}>
          {getFieldDecorator('description', {
            initialValue:_.get(JSON.parse( _.get(item,'metaInfo','{}')),'description'),
            rules: [
              {
                required: false,
              },
            ],
          })(<TextArea
            placeholder="请输入数组，不要太长了"
            autosize={{ minRows: 2, maxRows: 6 }}
          />)}
        </FormItem>*/}
      </Form>
    </Modal>
  );
};
export default Form.create()(modal);

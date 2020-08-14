import React from 'react';
import _ from 'lodash';
import { formatMessage } from "umi-plugin-react/locale";
import { Form, Input, Modal,Drawer } from 'antd';

const modal = ({
  item = {},
  onOk,
  form: {
    getFieldDecorator,
    validateFields,
    getFieldsValue,
  },
  ...modalProps
}) => {
  const handleOk = () => {

  };
  const modalOpts = {
    ...modalProps,
    onOk: handleOk,
  };

  return (
    <Modal {...modalOpts}>
      <iframe
        src="https://www.baidu.com"
        frameBorder="0"
        width="100%"
        height="100%"
      />
    </Modal>
  );
};
export default Form.create()(modal);

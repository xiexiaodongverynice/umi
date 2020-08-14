import React, { PureComponent } from 'react';
import { formatMessage } from "umi-plugin-react/locale";
import { Row, Col, Form, Input, Select, Icon, Button, InputNumber, DatePicker } from 'antd';
import styles from './DataFilter.less';
import NodeSettingForm from "../AcNodeSetting/NodeSettingForm";

const FormItem = Form.Item;
const { Option } = Select;

@Form.create()
class DataFilter extends PureComponent {
  state={
    expandForm: false,
    operatorList: {
      name: 'contains',
      key: '==',
    },
  }
  handleFields = (fields) => {
    return fields;
  };

  handleSubmit = (e) => {
    const { onFilterChange } = this.props;
    e.preventDefault();
    this.props.form.validateFields((err, values) => {
      onFilterChange(_.omitBy(values,_.isUndefined), this.state.operatorList);
    });
  };


  handleFormReset = () => {
    const { form, onFilterChange } = this.props;
    form.resetFields();
    onFilterChange({});
  };

  renderSimpleForm() {
    const { getFieldDecorator } = this.props.form;
    return (
      <Form layout="inline" onSubmit={this.handleSubmit}>
        <Row gutter={{ md: 8, lg: 24, xl: 48 }}>
          <Col md={8} sm={24}>
            <FormItem label="模型名称">
              {getFieldDecorator('name',{
              })(
                <Input placeholder="请输入关键字" allowClear/>
              )}
            </FormItem>
          </Col>
          <Col md={8} sm={24}>
            <FormItem label="标识Key">
              {getFieldDecorator('key',{
              })(
                <Input placeholder="请输入完整标识Key" allowClear/>
              )}
            </FormItem>
          </Col>
          <Col md={8} sm={24}>
            <span className={styles.submitButtons}>
              <Button type="primary" htmlType="submit" >查询</Button>
              <Button style={{ marginLeft: 8 }} onClick={this.handleFormReset}>重置</Button>
            </span>
          </Col>
        </Row>
      </Form>
    );
  }

  render() {
    return (
      <div className={styles.tableListForm}>
        {this.renderSimpleForm()}
      </div>
    );
  }
}
export default DataFilter;

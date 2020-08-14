import React, { PureComponent } from "react";
import _ from 'lodash';
import { formatMessage } from "umi-plugin-react/locale";
import { Button, Col, Form, Input, Row, Switch } from "antd";
import styles from "./DataFilter.less";

const FormItem = Form.Item;
// const { Option } = Select;

@Form.create()
class DataFilter extends PureComponent {
  state={
    // expandForm: false,
    operatorList: {
      name: 'contains',
      // process_key: 'contains',
      // latest:'=='
    },
  };

  onLatestChange=()=>{
    setTimeout(this.handleSubmit, 100);
  };

  handleSubmit = (e) => {
    const { operatorList } = this.state;
    const { onFilterChange } = this.props;
    if (e) e.preventDefault();
    const { form } = this.props;
    form.validateFields((err, values) => {

      console.log(values);
      if(!values.latest) _.set(values,'latest',undefined);
      const filterData = _.omitBy(values,_.isUndefined);
      console.log(filterData);
      onFilterChange(filterData, operatorList);
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
          <Col md={6} sm={24}>
            <FormItem label="任务名称">
              {getFieldDecorator('name',{
              })(
                <Input placeholder="请输入关键字" allowClear />
              )}
            </FormItem>
          </Col>
          {/*<Col md={6} sm={24}>
            <FormItem label="标识Key">
              {getFieldDecorator('process_key',{
              })(
                <Input placeholder="请输入完整标识Key" allowClear />
              )}
            </FormItem>
          </Col>
          <Col md={2} sm={24}>
            <FormItem label="">
              {getFieldDecorator('latest',{
                initialValue:true
              })(
                <Switch checkedChildren="最新" unCheckedChildren="全部" defaultChecked onChange={this.onLatestChange} />
              )}
            </FormItem>
          </Col>*/}
          <Col md={8} sm={24}>
            <span className={styles.submitButtons}>
              <Button type="primary" htmlType="submit">查询</Button>
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


import React, { PureComponent } from "react";
import _ from 'lodash';
import { formatMessage } from "umi-plugin-react/locale";
import { Button, Col, Form, Input, Row, Select, Switch } from "antd";
import styles from "./DataFilter.less";
import {statusOptions,approvalResultOptions} from "../../../utils/acStatusOptions";

const FormItem = Form.Item;
const { Option } = Select;

@Form.create()
class DataFilter extends PureComponent {
  state={
    // expandForm: false,
    operatorList: {
      title: 'contains',
      status: '==',
      approval_flow_result: '==',
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
            <FormItem label={formatMessage({id:"table.column.name"})}>
              {getFieldDecorator('title',{
              })(
                <Input placeholder={formatMessage({id:"table.placeholder.keyword"})} allowClear />
              )}
            </FormItem>
          </Col>
          <Col md={4} sm={24}>
            <FormItem label={formatMessage({id:"table.column.status"})}>
              {getFieldDecorator('status',{
                initialValue:""
              })(
                <Select>
                  <Option value="">{formatMessage({id:"table.option.status.selected"})}</Option>
                  {
                    statusOptions.map(option=>{
                      return <Option key={`${option.value}-option.value`} value={option.value}>{formatMessage({id:option.label})}</Option>
                    })
                  }
                </Select>
              )}
            </FormItem>
          </Col>
          <Col md={6} sm={24}>
            <FormItem label={formatMessage({id:"table.column.approvalFlowResult"})}>
              {getFieldDecorator('approval_flow_result',{
                initialValue:""
              })(
                <Select>
                  <Option value="">{formatMessage({id:"table.option.status.selected"})}</Option>
                  {
                    approvalResultOptions.map(option=>{
                      return <Option key={`${option.value}-option.value`} value={option.value}>{formatMessage({id:option.label})}</Option>
                    })
                  }
                </Select>
              )}
            </FormItem>
          </Col>
          <Col md={6} sm={24}>
            <span className={styles.submitButtons}>
              <Button type="primary" htmlType="submit">{formatMessage({id:"search"})}</Button>
              <Button style={{ marginLeft: 8 }} onClick={this.handleFormReset}>{formatMessage({id:"reset"})}</Button>
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


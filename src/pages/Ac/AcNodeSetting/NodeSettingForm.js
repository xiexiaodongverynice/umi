import React from "react";
import _ from 'lodash';
import { formatMessage } from "umi-plugin-react/locale";
import { Badge, Button, message, Form, Icon, Input, Popconfirm, Select, Switch, Tooltip, Col, Row } from "antd";
import MsgConfigFormItem from "./MsgConfigFormItem";

const FormItem = Form.Item;
const { Option } = Select;

const formItemLayout = {
  labelCol: { span: 4 },
  wrapperCol: { span: 18 },
};
const formItemLayout2 = {
  labelCol: { span: 8 },
  wrapperCol: { span: 8 },
};

const formTailLayout = {
  labelCol: { span: 4 },
  wrapperCol: { span: 10, offset: 8 },
};
@Form.create()
class NodeSettingForm extends React.Component {
  state = {
  };

  onChange=(e)=>{
    console.log('onchange==>',e)
  }

  handleSubmit = (e) => {
    const { record,onOk } = this.props;
    e.preventDefault();
    if(_.isEmpty(record)){
      message.error('请选择节点');
      return;
    }
    this.props.form.validateFields((err, values) => {
      if (err){
        return;
      }
      onOk(values)
    });
  };

  componentWillReceiveProps(nextProps) {
    if (this.props.record.nodeId !== nextProps.record.nodeId) {
      this.props.form.resetFields();
    }
  }

  handleFormReset = () => {
    const { form, record } = this.props;
    // if(_.isEmpty(record)){
    //   message.error('请选择节点');
    //   return;
    // }
    form.resetFields();
  };

  render() {
    const { form: { getFieldDecorator,getFieldValue }, record, loading } = this.props;
    return (
      <Form onSubmit={this.handleSubmit}>
        <FormItem
          {...formItemLayout}
          label="节点名称"
        >
          {_.get(record,'title','请选择节点')}
        </FormItem>
        <FormItem
          {...formItemLayout}
          label={
            <span>
              节点类型&nbsp;
              <Tooltip title="多实例循环节点：会签节点">
                <Icon type="question-circle-o" />
              </Tooltip>
            </span>}
        >
          {_.isEmpty(record)?'请选择节点':_.has(record,'loopCharacteristics')?'多实例循环节点':'普通审批节点'}
        </FormItem>
        <Row>
          <Col span={6} offset={2}>
            <FormItem
              {...formItemLayout2}
              label={
                <span>
                  节点加签&nbsp;
                  <Tooltip title={`是否允许审批人加签，目前只有会签节点可以加签；当前节点：${_.isEmpty(record)?'不可加签':_.has(record,'loopCharacteristics')?'可加签':'不可加签'}`}>
                    <Icon type="question-circle-o" />
                  </Tooltip>
                </span>
               }
            >
              {getFieldDecorator('allowAddExecution', {
                initialValue: _.get(record, 'allowAddExecution', false),
                valuePropName: 'checked',
              })(
                <Switch checkedChildren="允许" unCheckedChildren="禁止" disabled={!_.has(record,'loopCharacteristics')} />,
              )}
            </FormItem>
          </Col>
          <Col span={6}>
            <FormItem
              {...formItemLayout2}
              label={
                <span>
                  通知配置&nbsp;
                  <Tooltip title={`是否允许审批人加签，目前只有会签节点可以加签；当前节点：${_.isEmpty(record)?'不可加签':_.has(record,'loopCharacteristics')?'可加签':'不可加签'}`}>
                    <Icon type="question-circle-o" />
                  </Tooltip>
                </span>
              }
            >
              {getFieldDecorator('addExecutionConfig', {
                initialValue: _.get(record, 'addExecutionConfig',[]),
                rules: [{ required: false, message: 'Please setting' }],
              })(
                <MsgConfigFormItem disabled={!getFieldValue('allowAddExecution')||!_.has(record,'loopCharacteristics')} />
              )}
            </FormItem>
          </Col>
        </Row>

        <Row>
          <Col span={6} offset={2}>
            <FormItem
              {...formItemLayout2}
              label={
                <span>
              节点委托&nbsp;
                  <Tooltip title="是否允许委托其他人审批">
                    <Icon type="question-circle-o" />
                  </Tooltip>
                </span>
              }
            >
              {getFieldDecorator('allowDelegate', {
                initialValue: _.get(record, 'allowDelegate', false),
                valuePropName: 'checked',
              })(
                <Switch checkedChildren={formatMessage({ id: 'form.placeholder.switch.on', defaultMessage: '允许' })} unCheckedChildren={formatMessage({ id: 'form.placeholder.switch.off', defaultMessage: '禁止' })}  />,
              )}
            </FormItem>
          </Col>
          <Col span={6}>
            <FormItem
              {...formItemLayout2}
              label={
                <span>
                  通知配置&nbsp;
                  <Tooltip title={`是否允许审批人加签，目前只有会签节点可以加签；当前节点：${_.isEmpty(record)?'不可加签':_.has(record,'loopCharacteristics')?'可加签':'不可加签'}`}>
                    <Icon type="question-circle-o" />
                  </Tooltip>
                </span>
              }
            >
              {getFieldDecorator('delegateConfig', {
                initialValue: _.get(record, 'delegateConfig',[]),
                rules: [{ required: false, message: 'Please setting' }],
              })(
                <MsgConfigFormItem disabled={!getFieldValue('allowDelegate')} />
              )}
            </FormItem>
          </Col>

        </Row>

        <FormItem
          {...formItemLayout}
          label={
            <span>
              未找到审批人时&nbsp;
              <Tooltip
                title={<span dangerouslySetInnerHTML={{ __html: "" +
                    "0：默认，报错返回，这也是系统的默认处理方式<br\/>" +
                    "1：自动通过<br\/>" +
                    "2：转交给管理员" }}
                />}
              >
                <Icon type="question-circle-o" />
              </Tooltip>
            </span>
          }
        >
          {getFieldDecorator('notFoundAssigneeExecutionWay', {
            initialValue: _.get(record, 'notFoundAssigneeExecutionWay',0),
            rules: [{
              required: true,
              message: 'Please select not found assignee execution way',
            }],
          })(
            <Select
              size="default"
              placeholder="请选择"
              // style={{ width: "100%" }}
              filterOption={(input, option) => option.props.children.toLowerCase().indexOf(input.toLowerCase()) >= 0}
            >
              <Option value={0}>默认</Option>
              <Option value={1}>自动通过</Option>
              <Option value={2}>转交给管理员</Option>
            </Select>,
          )}
        </FormItem>
        {
          getFieldValue('notFoundAssigneeExecutionWay') === 2
          &&
          <FormItem
            {...formItemLayout}
            label='选择管理员'
          >
            {getFieldDecorator('defaultApprovalAssignee', {
              initialValue: _.get(record, 'defaultApprovalAssignee'),
              rules: [{
                required: true,
                message: 'Please select default approval assignee',
              }],
            })(
              <Select
                size="default"
                placeholder="请选择"
                // style={{ width: "100%" }}
                filterOption={(input, option) => option.props.children.toLowerCase().indexOf(input.toLowerCase()) >= 0}
              >
                <Option value="0">转交给管理员</Option>
                <Option value="1" disabled>其他</Option>
              </Select>,
            )}
          </FormItem>
          }

        <FormItem {...formTailLayout}>
          <Button type="primary" htmlType="submit" size="large" loading={!_.isEmpty(record)&&loading}> 保存 </Button>
          <Button style={{ marginLeft: '20px' }} size="large" onClick={this.handleFormReset}>重置</Button>
        </FormItem>
      </Form>
    );
  }
}


export default NodeSettingForm;

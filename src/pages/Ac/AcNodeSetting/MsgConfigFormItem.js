import React from "react";
import _ from 'lodash';
import { formatMessage } from "umi-plugin-react/locale";
import {
  Badge,
  Button,
  message,
  Form,
  Icon,
  Input,
  Popconfirm,
  Select,
  Switch,
  Tooltip,
  Col,
  Row,
  Drawer,
  Divider
} from "antd";

const {TextArea}=Input;

const formItemLayout = {
  labelCol: { span: 6 },
  wrapperCol: { span: 14 },
};
@Form.create()
class MsgConfigFormItem extends React.Component {
  state = {
    visible: false,
  };

  componentWillMount() {
    this.props.form.resetFields();
  }

  showDrawer = () => {
    this.setState({
      visible: true,

    });
  };

  onClose = () => {
    this.setState({
      visible: false,
    });
    // this.props.form.resetFields();
  };


  handleSubmit = (e) => {
    const { form,type,onChange } = this.props;
    e.preventDefault();
    // if(_.isEmpty(record)){
    //   message.error('请选择节点');
    //   return;
    // }
    form.validateFields((err, values) => {
      if (err){
        return;
      }
      const data = [
        {
          type:'email',
          active:_.get(values,'email_active',false),
          title:_.get(values,'email_title',''),
          content:_.get(values,'email_content',''),
        },{
          type:'alert',
          active:_.get(values,'alert_active',false),
          title:_.get(values,'alert_title',''),
          content:_.get(values,'alert_content',''),
        },{
          type:'todo',
          active:_.get(values,'todo_active',false),
          todoType:_.get(values,'todo_type',''),
          title:_.get(values,'todo_title',''),
          content:_.get(values,'todo_content',''),
        }
      ]


      onChange(data);
      this.onClose();
    });
  };

  // componentWillReceiveProps(nextProps) {
  //   if (this.props.record.nodeId !== nextProps.record.nodeId) {
  //     this.props.form.resetFields();
  //   }
  // }

  handleFormReset = () => {
    const { form, record } = this.props;
    // if(_.isEmpty(record)){
    //   message.error('请选择节点');
    //   return;
    // }
    form.resetFields();
  };

  render() {
    const { form: { getFieldDecorator,getFieldValue },disabled, value,record, loading } = this.props;
    return (
      <div>
        <Button type="primary" onClick={this.showDrawer} disabled={disabled}>
          <Icon type="control" /> 配置
        </Button>
        <Drawer
          title={formatMessage({ id: 'form.title.msgConfig', defaultMessage: '通知配置' })}
          width={620}
          onClose={this.onClose}
          visible={this.state.visible}
          bodyStyle={{ paddingBottom: 80 }}
        >
          <Form {...formItemLayout}>
            <Form.Item label={formatMessage({ id: 'form.label.send_email', defaultMessage: '发送邮件' })}>
              {getFieldDecorator('email_active', {
                initialValue: _.get(_.find(value,{type:'email'}), 'active', false),
                // rules: [{ required: true, message: 'Please enter user name' }],
                valuePropName: 'checked',
              })(<Switch checkedChildren={formatMessage({ id: 'form.placeholder.switch.on', defaultMessage: '允许' })} unCheckedChildren={formatMessage({ id: 'form.placeholder.switch.off', defaultMessage: '禁止' })}  />,)}
            </Form.Item>
            <Form.Item label={formatMessage({ id: 'form.label.title', defaultMessage: '标题' })}>
              {getFieldDecorator('email_title', {
                initialValue: _.get(_.find(value,{type:'email'}), 'title', ''),
                rules: [{ required: getFieldValue('email_active'), message: 'Please enter title' }],
              })(<Input placeholder="Please enter title" disabled={!getFieldValue('email_active')} />)}
            </Form.Item>
            <Form.Item label={formatMessage({ id: 'form.label.content', defaultMessage: '内容' })}>
              {getFieldDecorator('email_content', {
                initialValue: _.get(_.find(value,{type:'email'}), 'content', ''),
                rules: [{ required: getFieldValue('email_active'), message: 'Please enter content' }],
              })(<TextArea
                placeholder="Please enter content"
                autosize={{ minRows: 2, maxRows: 6 }}
                disabled={!getFieldValue('email_active')}
              />)}
            </Form.Item>
            <Divider />
            <Form.Item label={formatMessage({ id: 'form.label.send_alert', defaultMessage: '发送站内信' })}>
              {getFieldDecorator('alert_active', {
                initialValue: _.get(_.find(value,{type:'alert'}), 'active', false),
                // rules: [{ required: false, message: 'Please enter user name' }],
                valuePropName: 'checked',
              })(<Switch checkedChildren={formatMessage({ id: 'form.placeholder.switch.on', defaultMessage: '允许' })} unCheckedChildren={formatMessage({ id: 'form.placeholder.switch.off', defaultMessage: '禁止' })}  />,)}
            </Form.Item>
            <Form.Item label={formatMessage({ id: 'form.label.title', defaultMessage: '标题' })}>
              {getFieldDecorator('alert_title', {
                initialValue: _.get(_.find(value,{type:'alert'}), 'title', ''),
                rules: [{ required: getFieldValue('alert_active'), message: 'Please enter title' }],
              })(<Input placeholder="Please enter title" disabled={!getFieldValue('alert_active')} />)}
            </Form.Item>
            <Form.Item label={formatMessage({ id: 'form.label.content', defaultMessage: '内容' })}>
              {getFieldDecorator('alert_content', {
                initialValue: _.get(_.find(value,{type:'alert'}), 'content', ''),
                rules: [{ required: getFieldValue('alert_active'), message: 'Please enter content' }],
              })(<TextArea
                placeholder="Please enter content"
                autosize={{ minRows: 2, maxRows: 6 }}
                disabled={!getFieldValue('alert_active')}
              />)}
            </Form.Item>
            <Divider />
            <Form.Item label={formatMessage({ id: 'form.label.send_todo', defaultMessage: '发送站内待办' })}>
              {getFieldDecorator('todo_active', {
                initialValue: _.get(_.find(value,{type:'todo'}), 'active', false),
                // rules: [{ required: false, message: 'Please enter user name' }],
                valuePropName: 'checked',
              })(<Switch checkedChildren={formatMessage({ id: 'form.placeholder.switch.on', defaultMessage: '允许' })} unCheckedChildren={formatMessage({ id: 'form.placeholder.switch.off', defaultMessage: '禁止' })}  />,)}
            </Form.Item>
            <Form.Item label={formatMessage({ id: 'form.label.todo_type', defaultMessage: '待办类型' })}>
              {getFieldDecorator('todo_type', {
                initialValue: _.get(_.find(value,{type:'todo'}), 'todoType', ''),
                rules: [{ required: getFieldValue('todo_active'), message: 'Please enter todo type' }],
              })(<Input placeholder="Please enter type" disabled={!getFieldValue('todo_active')} />)}
            </Form.Item>
            <Form.Item label={formatMessage({ id: 'form.label.title', defaultMessage: '标题' })}>
              {getFieldDecorator('todo_title', {
                initialValue: _.get(_.find(value,{type:'todo'}), 'title', ''),
                rules: [{ required: getFieldValue('todo_active'), message: 'Please enter title' }],
              })(<Input placeholder="Please enter title" disabled={!getFieldValue('todo_active')} />)}
            </Form.Item>
            <Form.Item label={formatMessage({ id: 'form.label.content', defaultMessage: '内容' })}>
              {getFieldDecorator('todo_content', {
                initialValue: _.get(_.find(value,{type:'todo'}), 'content', ''),
                rules: [{ required: getFieldValue('todo_active'), message: 'Please enter content' }],
              })(<TextArea
                placeholder="Please enter content"
                autosize={{ minRows: 2, maxRows: 6 }}
                disabled={!getFieldValue('todo_active')}
              />)}
            </Form.Item>
          </Form>
          <div
            style={{
              position: 'absolute',
              right: 0,
              bottom: 0,
              width: '100%',
              borderTop: '1px solid #e9e9e9',
              padding: '10px 16px',
              background: '#fff',
              textAlign: 'right',
            }}
          >
            <Button onClick={this.onClose} style={{ marginRight: 8 }}>
              Cancel
            </Button>
            <Button onClick={this.handleSubmit} type="primary">
              Submit
            </Button>
          </div>
        </Drawer>
      </div>

    );
  }
}


export default MsgConfigFormItem;

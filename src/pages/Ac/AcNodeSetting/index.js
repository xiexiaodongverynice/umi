import React, { PureComponent } from "react";
import _ from 'lodash';
import { connect } from "dva";
import { Card, Button, Layout, Radio, Tag, Row, Col, Checkbox, Select, Spin } from "antd";
import router from "umi/router";
import { formatMessage } from "umi-plugin-react/locale";
import styles from "./index.less";
import Ellipsis from "../../../components/Ellipsis";
import NodeSettingForm from './NodeSettingForm';
import PageHeaderLayout from "../../../layouts/PageHeaderLayout";

const { Sider, Content } = Layout;
const nameSpace = "acNodeSettingManage";
// @Form.create()
@connect(({ acNodeSettingManage, loading }) => ({
  acNodeSettingManage,
  loading: loading.models.acNodeSettingManage
}))

class Index extends PureComponent {
  state = {
    nodeRecordOnSelect:{}
  };

  componentDidMount = () => {
    this.fetchData();
  };

  componentWillReceiveProps(nextProps) {
    const nodeId = _.get(this.props,'record.nodeId');
    const nexNodeId = _.get(nextProps,'record.nodeId');
    if (nodeId !== nexNodeId) {
      this.props.form.resetFields();
    }
  }

  fetchData=()=>{
    const { dispatch, location, acNodeSettingManage:{ object_describe_api_name :objectDescribeApiName} } = this.props;
    const id = _.get(location,'query.id');
    dispatch({
      type: `${nameSpace}/fetch`,
      payload: {
        id:_.toString(id)
      },
    });
  };

  radioOnChange = (e) => {
    const { acNodeSettingManage:{ list:nodeList } } = this.props;
    const nodeRecordOnSelect = _.find(nodeList,{nodeId:e.target.value});
    this.setState({
      nodeRecordOnSelect
    })
  };

  onOkHandle=(values)=>{
    const { nodeRecordOnSelect } = this.state;
    const { dispatch,location } = this.props;
    const id = _.get(location,'query.id');
    const dealData = {
      "allow_add_execution":values.allowAddExecution,
      "add_execution_config":values.addExecutionConfig,
      // "allow_delete_execution":values.allowDelegate,
      "allow_delegate":values.allowDelegate,
      "delegate_config":values.delegateConfig,
      "not_found_assignee_execution_way":values.notFoundAssigneeExecutionWay,
      "default_approval_assignee":""
    }
    if(_.has(values,'defaultApprovalAssignee')){
      _.set(dealData,'default_approval_assignee',values.defaultApprovalAssignee)
    }
    console.log(values)
    dispatch({
      type: `${nameSpace}/save`,
      payload: {
        id,
        nodeId:nodeRecordOnSelect.nodeId,
        dealData
      },
      callback:()=>{
        this.fetchData();
      }
    });
  }

  render() {
    const radioStyle = {
      display: 'block',
      height: '30px',
      lineHeight: '30px',
      border: 'none',
      borderRadius: '4px'
    };
    const { nodeRecordOnSelect } = this.state;
    const { acNodeSettingManage:{ list:nodeList },loading } = this.props;
    const nodeElements =  _.map(_.filter(nodeList,{type:1}),(node)=>{
      return <Row style={{paddingTop:'10px'}} key={node.nodeId}>
        <Col span={8}>
          <Button style={{background:'#1890FF', color:'#fff'}} disabled>审批</Button>
        </Col>
        <Col span={12}>
          <Radio.Button value={node.nodeId} style={radioStyle}><Ellipsis className={styles.item} lines={1} tooltip>{node.title}</Ellipsis></Radio.Button>
        </Col>
      </Row>
    })
    return (
      <PageHeaderLayout
        title="节点设置"
        action={<Button style={{ marginLeft: "5px" }} size="large" onClick={()=>{router.goBack()}}>返回</Button>}
      >
        <Card bordered>
          <div className={styles.tableList}>
            <div>
              <Layout style={{padding:'20px',background:'#fff'}}>
                <Sider theme='light' style={{borderRight:'1px solid #ececec', padding:'10px'}} width="10px">
                  <div>
                    {nodeRecordOnSelect&&(
                      <div style={{padding:'5px',border: '1px solid #A3DBF4', background: '#F0F7FB', borderRadius: '4px'}}>
                        <span>已选择流程节点：</span>
                        <Ellipsis className={styles.item} lines={1} tooltip>
                          {nodeRecordOnSelect.title}
                        </Ellipsis>
                      </div>
                    )}
                  </div>
                  <div>
                    <Radio.Group defaultValue="a" buttonStyle="solid" style={{width:'100%'}} onChange={this.radioOnChange}>
                      <Row style={{paddingTop:'10px'}}>
                        <Col span={8}>
                          <Button style={{background:'#33CC66', color:'#fff'}} disabled>开始</Button>
                        </Col>
                        <Col span={12}>
                          <Radio.Button value="" style={{background:'#fff',border:'none'}} disabled>开始节点</Radio.Button>
                        </Col>
                      </Row>
                      {
                        _.isEmpty(nodeElements)&&loading
                        &&
                        <Spin />
                      }
                      {
                        nodeElements
                      }

                      <Row style={{paddingTop:'10px'}}>
                        <Col span={8}>
                          <Button style={{background:'#F2F2F2'}} disabled>结束</Button>
                        </Col>
                        <Col span={12}>
                          <Radio.Button value="" disabled style={{background:'#fff',border:'none'}}>结束节点</Radio.Button>
                        </Col>
                      </Row>
                    </Radio.Group>
                  </div>
                </Sider>
                <Content style={{padding:'10px'}}>
                  <NodeSettingForm record={nodeRecordOnSelect} onOk={this.onOkHandle} loading={loading} />
                </Content>
              </Layout>
            </div>

          </div>
        </Card>
      </PageHeaderLayout>
    );
  }
}
export default Index;

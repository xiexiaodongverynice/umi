import React, { PureComponent } from "react";
import _ from 'lodash';
import { formatMessage } from "umi-plugin-react/locale";
import { connect } from "dva";
import {
  Card,
  Button, Tabs, Modal, Col, Row
} from "antd";
import moment from "moment";
import styles from "./index.less";
import * as storageUtil from "@/utils/storageUtil";

import DataList from "./DataList";

const { TabPane } = Tabs;

const nameSpace = "sysNotices";

@connect(({ sysNotices, loading }) => ({
  sysNotices,
  loading: loading.models.sysNotices
}))
class Index extends PureComponent {
  state = {
    queryDataDeal: [],
    activeKey:'all',
    noticeModalVisible:false,
    currentItem:{}
  };

  componentDidMount = () => {
    const { dispatch } = this.props;
    dispatch({
      type: "global/changeLayoutCollapsed",
      payload: {
        isShowTerritoryTree: false, // 是否显示架构选择树
        isShowRevisionHistory: false, // 是否显示更新历史时间轴
        territoryTreeCollapsed: false, // 是否默认展开架构选择树
        revisionHistoryCollapsed: false, // 是否默认展开更新历史时间轴
        renderPageTitle: '通知列表'
      }
    });

    const {
      sysNotices: { object_describe_api_name: objectApiName, pagination },
      loading
    } = this.props;

    const dataDeal = {
      needRelationQuery: true,
      joiner: "and",
      objectApiName,
      orders:[{
        field:'status',
        sorting:'asc'
      },{
        field:'create_time',
        sorting:'desc'
      }],
      pageSize: pagination.pageSize,
      pageNo: pagination.current,
    };
    this.setState({ queryDataDeal: dataDeal, }, () => {
      this.queryRecordList();
    });
  };

  queryRecordList = () => {
    const { queryDataDeal,activeKey } = this.state;
    const criterias = [
      {
        field: 'owner',
        operator: '==', //
        value: [storageUtil.get("userId")]
      },
      activeKey==='all'||{
        field: 'status',
        operator: '==', //
        value: [activeKey==='read'?'1':'0']
      }
    ];

    const {
      sysNotices: { object_describe_api_name: object_api_name },
      dispatch
    } = this.props;

    dispatch({
      type: `${nameSpace}/fetch`,
      payload: { dealData: {...queryDataDeal,criterias}, object_api_name }
    });
  };


  changeTab=(activeKey) =>{
    this.setState({activeKey},()=>{
      this.queryRecordList();
    })
  }


  changeNoticeModalVisible=(currentItem)=>{
    const {noticeModalVisible}= this.state;
    this.setState({noticeModalVisible:!noticeModalVisible,currentItem})
  }

  render() {
    const {
      sysNotices: {
        list,
        pagination
      },
      dispatch,
      loading: dataLoading,
    } = this.props;

    const { noticeModalVisible,currentItem } = this.state;

    const listProps = {
      pagination,
      dataSource: list,
      loading: dataLoading,
      onChange: (page,pageSize) => {
        const { queryDataDeal } = this.state;
        _.set(queryDataDeal, "pageNo", page);

        this.setState({ queryDataDeal }, () => {
          this.queryRecordList();
        });
      },
      onClick:(item)=>{
        const { id,status,version, } = item;
        const { activeKey } = this.state;

        this.changeNoticeModalVisible(item);

        if(status==='1'){
          return;
        }
        const dealData = {
          id,
          version,
          status:'1'
        };
        if (dispatch) {
          dispatch({
            type: "global/changeNoticeReadState",
            payload: {dealData,object_api_name:'alert'},
            callback:()=>{
              this.queryRecordList()
            }
          });
        }
      }
    };

    const modalProps = {
      visible: noticeModalVisible,
      maskClosable: false,
      width: 650,
      title: currentItem.name,
      wrapClassName: "vertical-center-modal",
      okType:formatMessage({
        id: "ok"
      }),
      footer:(
        <Row justify="start">
          <Col span={12} style={{textAlign:"left"}}>
            {
                _.get(currentItem, 'create_by__r.name')
              }
            &nbsp;
            {formatMessage({id: "component.globalHeader.send-on"})}
            &nbsp;
            {
                moment(currentItem.create_time).format('YYYY-MM-DD HH:mm:ss')
              }
          </Col>
          <Col span={12}>
            <Button type="primary" onClick={()=>this.changeNoticeModalVisible({})}>{formatMessage({id: "ok"})}</Button>
          </Col>
        </Row>
      ),
      onCancel: () => {
        this.changeNoticeModalVisible({});
      }
    };


    return (
      <Card bordered>
        <Tabs defaultActiveKey="all" onChange={this.changeTab}>
          <TabPane tab={formatMessage({id: "component.globalHeader.all"})} key="all">
            <DataList {...listProps} />
          </TabPane>
          <TabPane tab={formatMessage({id: "component.globalHeader.unread"})} key="unread">
            <DataList {...listProps} />
          </TabPane>
          <TabPane tab={formatMessage({id: "component.globalHeader.read"})} key="read">
            <DataList {...listProps} />
          </TabPane>
        </Tabs>

        {
          noticeModalVisible&&
            <Modal {...modalProps}>
              <span dangerouslySetInnerHTML={{__html:`${currentItem.content}`}} />
            </Modal>
        }
      </Card>
    );
  }
}
export default Index;

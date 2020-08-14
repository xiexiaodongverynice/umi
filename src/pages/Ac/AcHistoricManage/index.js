import React, { PureComponent } from "react";
import _ from 'lodash';
import { connect } from "dva";
import { Card, Button,Popconfirm } from "antd";
import router from "umi/router";
import { formatMessage } from "umi-plugin-react/locale";
import PageHeaderLayout from "../../../layouts/PageHeaderLayout";
import styles from "./index.less";
import DataList from "./DataList";
import DataModal from "./DataModal";
import BusinessChangeDataModal from "./BusinessChangeDataModal";

const nameSpace = "acHistoricManage";

@connect(({ acHistoricManage, loading }) => ({
  acHistoricManage,
  loading: loading.models.acHistoricManage
}))


class Index extends PureComponent {
  state = {
    businessKey: null,
  };

  componentDidMount = () => {
    const { dispatch, location, acHistoricManage:{ object_describe_api_name :objectDescribeApiName} } = this.props;
    const id = _.get(location,'query.id');
    const procInstId = _.get(location,'query.procInstId');
    this.setState({businessKey:_.toString(id)},()=>{
      this.fetchData(procInstId);
    })
  };

  static getDerivedStateFromProps(nextProps, preState) {
    const {  location  } = nextProps;
    const idNext = _.get(location,'query.id');
    if (_.isEqual(nextProps.value, preState.value)) {
      return null;
    }
    // const result = nextProps.value;
    const result = nextProps.value.map((item,index) => ({
      ...item,
      key: `NEW_TEMP_ID_${index}`,
    }));
    return {
      data: result,
      value: nextProps.value,
    };
  }

  fetchData=(procInstId,callback)=>{
    const { businessKey } = this.state;
    const { dispatch } = this.props;
    dispatch({
      type: `${nameSpace}/fetch`,
      payload: {
        dealData:{businessKey,procInstId}
      },
      callback
    });
  };

  showChangeHistoricModalVisible=()=>{
    const { dispatch } = this.props;
    dispatch({
      type: `${nameSpace}/showModal`,
      payload: {
        modalVisible: true
      }
    });
  }

  showChangeBusinessHistoricModalVisible=()=>{
    const { dispatch } = this.props;
    dispatch({
      type: `${nameSpace}/showModal`,
      payload: {
        businessModalVisible: true
      }
    });
  }

  render() {
    const { acHistoricManage:{ list,businessList,instanceHistoricList,modalVisible,businessModalVisible }, dispatch,loading: dataLoading } = this.props;

    const listProps = {
      pagination:{},
      dataSource: list,
      loading: dataLoading,
      onChange: page => {
        const { queryDataDeal } = this.state;
        _.set(queryDataDeal, "pageSize", page.pageSize);
        _.set(queryDataDeal, "pageNo", page.current);

        this.setState({ queryDataDeal }, () => {
          this.queryRecordList();
        });
      },
    };
    const modalProps = {
      item: _.get(list,'0.procInstId'),
      instanceHistoricList,
      visible: modalVisible,
      maskClosable: false,
      width: 750,
      confirmLoading: dataLoading,
      title: formatMessage({id:'table.pageTitle.selectApprovalHistory'}),
      wrapClassName: "vertical-center-modal",
      onOk: procInstId => {
        dispatch({
          type: `${nameSpace}/hideModal`,
          payload: { modalVisible: false }
        });

        this.fetchData(procInstId,()=>{

        });

      },
      onCancel: () => {
        dispatch({
          type: `${nameSpace}/hideModal`,
          payload: { modalVisible: false }
        });
      }
    };
    const businessModalProps = {
      item: _.get(list,'0.businessKey'),// _.get(this.props.location,'query.id')
      businessList,
      visible: businessModalVisible,
      maskClosable: false,
      width: 900,
      confirmLoading: dataLoading,
      title: formatMessage({id:'table.pageTitle.selectSubmitHistory'}),
      wrapClassName: "vertical-center-modal",
      onOk: businessKey => {
        const that = this;
        dispatch({
          type: `${nameSpace}/hideModal`,
          payload: { businessModalVisible: false }
        });
        this.setState({businessKey},()=>{
          that.fetchData();
          router.replace({
            pathname: window.IFRAME?'/iframe/approval_historic_list':'/ac/ac_history_list',
            query: {
              id:businessKey
            },
          });
        })
      },
      onCancel: () => {
        dispatch({
          type: `${nameSpace}/hideModal`,
          payload: { businessModalVisible: false }
        });
      }
    };

    return (
      <PageHeaderLayout
        title={formatMessage({id:'table.pageTitle.approvalHistory'})}
        action={<Button style={{ marginLeft: "5px" }} size="large" onClick={()=>{router.goBack()}}>{formatMessage({id:'table.button.back'})}</Button>}
      >
        <Card bordered>
          <div className={styles.tableListOperator}>
            {
                  !_.isEmpty(businessList)&&false
                  &&<Button
                    icon="switcher"
                    type="primary"
                    onClick={() => this.showChangeBusinessHistoricModalVisible()}
                  >
                    {formatMessage({id:'table.button.switchSubmitApprovalHistory'})}({_.size(businessList)}）
                    </Button>
            }
            {
            !_.isEmpty(instanceHistoricList)&&false
              &&
                <Button
                  icon="appstore"
                  type="primary"
                  onClick={() => this.showChangeHistoricModalVisible()}
                >
                  {formatMessage({id:'table.button.switchCurrentApprovalHistory'})}({_.size(instanceHistoricList)}）
                </Button>
            }
          </div>
          <div style={{ padding: 24, background: '#fff', minHeight: 525 }}>
            <DataList {...listProps} />
          </div>
          {modalVisible && <DataModal {...modalProps} />}
          {businessModalVisible && <BusinessChangeDataModal {...businessModalProps} />}
        </Card>
      </PageHeaderLayout>
    );
  }
}
export default Index;

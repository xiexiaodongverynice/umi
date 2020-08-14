import React, { PureComponent } from "react";
import _ from 'lodash';
import { connect } from "dva";
import { formatMessage } from "umi-plugin-react/locale";
import {
  Card,
  Button} from "antd";
import Zmage from 'react-zmage';
import styles from "./index.less";
import DataList from "./DataList";
import DataFilter from "./DataFilter";
import DataModal from "./DataModal";
import DeployModal from "./DeployProcessModal";
import { baseURL,api } from "@/utils/config";

const nameSpace = "acProcessManage";
// @Form.create()
@connect(({ acProcessManage, loading }) => ({
  acProcessManage,
  loading: loading.models.acProcessManage
}))
class Index extends PureComponent {
  state = {
    queryDataDeal: []
  };

  componentDidMount = () => {
    const {
      dispatch,
      acProcessManage: { object_describe_api_name: objectApiName, pagination },
      loading
    } = this.props;
    const dataDeal = {
      joiner: "and",
      criterias: [
        {
          field: 'latest',
          operator: '==', //
          value: [true]
        }
      ],
      orderBy: "update_time",
      order: "desc",
      pageSize: pagination.pageSize,
      pageNo: pagination.current
    };
    this.setState({ queryDataDeal: dataDeal }, () => {
      this.queryRecordList();
    });
    this.fetchWorkflowCategory();

  };

  showDeployModalVisible = () => {
    const { dispatch } = this.props;
    dispatch({
      type: `${nameSpace}/showModal`,
      payload: {
        deployModalVisible: true
      }
    });
  };

  queryRecordList = () => {
    const { queryDataDeal } = this.state;
    const {
      acProcessManage: { object_describe_api_name: object_api_name },
      dispatch
    } = this.props;
    dispatch({
      type: `${nameSpace}/fetch`,
      payload: { dealData: queryDataDeal, object_api_name }
    });
  };

  fetchWorkflowCategory=()=>{
    const { dispatch } = this.props;
    dispatch({
      type: `${nameSpace}/fetchCategory`,
      payload: {}
    });
  }

  render() {
    const {
      acProcessManage: {
        categoryList,
        list,
        modalVisible,
        deployModalVisible,
        modalType,
        currentItem,
        pagination
      },
      dispatch,
      loading: dataLoading
    } = this.props;

    const dataFilterProps = {
      // isMotion,
      filter: {
        ...location.query
      },
      onFilterChange: (filterData, operatorList) => {
        const { queryDataDeal } = this.state;
        const filterCriteria = [];
        _.forEach(_.keys(filterData), filterDataKey => {
          const filterDataValue = _.get(filterData, filterDataKey);
          if (filterDataValue !== undefined && filterDataValue !== "") {
            filterCriteria.push({
              field: filterDataKey,
              operator: _.get(operatorList, filterDataKey, "=="), //
              value: [filterDataValue]
            });
          }
        });

        _.set(queryDataDeal, "criterias", filterCriteria);
        _.set(queryDataDeal, "pageSize", 5);
        _.set(queryDataDeal, "pageNo", 1);

        this.setState({ queryDataDeal }, () => {
          this.queryRecordList();
        });
      },
      onSearch(fieldsValue) {
        console.log("onSearch", fieldsValue);
      },
      onAdd() {}
    };

    const listProps = {
      pagination,
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
      onDeleteItem: id => {
        dispatch({
          type: `${nameSpace}/delete`,
          payload: { id },
          callback: this.queryRecordList
        });
      },
      onEditItem: item => {
        dispatch({
          type: `${nameSpace}/showModal`,
          payload: {
            modalType: 'update',
            currentItem: item,
            modalVisible: true
          },
          callback: this.queryRecordList
        });
      },
      onActivateItem: item => { // 激活流程
        dispatch({
          type: `${nameSpace}/activate`,
          payload: { id: item.id,processId:_.get(item,'process_id') },
          callback: this.queryRecordList
        });
      },
      onSuspendItem: item => { // 挂起流程
        dispatch({
          type: `${nameSpace}/suspend`,
          payload: { processId:_.get(item,'process_id') },
          callback: this.queryRecordList
        });
      },
      onDeployItem: item => {
        dispatch({
          type: `${nameSpace}/deploy`,
          payload: { id: item.id },
          callback: this.queryRecordList
        });
      },
      onImageView:item=>{
        const {path} = api.ac.process.image;
        const token = localStorage.getItem('token');
        const url = _.replace(`${baseURL}${path}?token=${token}`,'{procDefId}',item.process_id);
        Zmage.browsing({ alt:'找不到图片啦',src:url,controller:{download:true} })
      },
      onXmlDownload:item=>{
        const {path} = api.ac.process.xml;
        const token = localStorage.getItem('token');
        const url = _.replace(`${baseURL}${path}?token=${token}`,'{procDefId}',item.process_id);
        window.open(url,"_target");
      },
      onConvertToModel:(item)=>{
        dispatch({
          type: `${nameSpace}/convertToModel`,
          payload: { id: item.id },
          callback: this.queryRecordList
        });
      }
    };

    const modalProps = {
      item: currentItem,
      categoryList,
      visible: modalVisible,
      maskClosable: false,
      width: 650,
      confirmLoading: dataLoading,
      title: `${modalType === "create" ? "新建空白模版" : "编辑"}`,
      wrapClassName: "vertical-center-modal",
      onOk: data => {

        _.set(data, 'category_id', _.get(data, 'category_id'));
        _.set(data, 'ref_object_api_name', _.get(data, 'ref_object_api_name'));
        _.set(data, 'description', _.get(data, 'description'));

        _.set(data, 'id', _.get(currentItem, 'id'));
        _.set(data, 'process_id', _.get(currentItem, 'process_id'));
        _.set(data, 'version', _.get(currentItem, 'version'));

        dispatch({
          type: `acProcessManage/${modalType}`,
          payload: { dealData: data },
          callback: () => {
            dispatch({
              type: `${nameSpace}/hideModal`,
              payload: { modalVisible: false }
            });
            this.queryRecordList();
          }
        });
      },
      onCancel: () => {
        dispatch({
          type: `${nameSpace}/hideModal`,
          payload: { modalVisible: false }
        });
      }
    };

    const deployModalProps = {
      item: currentItem,
      categoryList,
      visible: deployModalVisible,
      maskClosable: false,
      width: 650,
      confirmLoading: dataLoading,
      title: '部署流程',
      footer:null,
      wrapClassName: "vertical-center-modal",
      onOk: data => {
        dispatch({
          type: `${nameSpace}/hideModal`,
          payload: { deployModalVisible: false }
        });
        if(_.isEmpty(data)){
          this.queryRecordList();
        }else{
          dispatch({
            type: `${nameSpace}/showModal`,
            payload: {
              modalType: 'update',
              currentItem: data,
              modalVisible: true
            },
            callback: this.queryRecordList
          });
        }
      },
      onCancel: () => {
        dispatch({
          type: `${nameSpace}/hideModal`,
          payload: { deployModalVisible: false }
        });
      }
    };

    return (
      <Card bordered>
        <div className={styles.tableList}>
          <div className={styles.tableListForm}>
            <DataFilter {...dataFilterProps} />
          </div>
          <div className={styles.tableListOperator}>
            <Button
              icon="upload"
              type="primary"
              onClick={() => this.showDeployModalVisible()}
            >
              流程部署
            </Button>
          </div>
          <DataList {...listProps} />
          {modalVisible && <DataModal {...modalProps} />}
          {deployModalVisible && <DeployModal {...deployModalProps} />}
        </div>
      </Card>
    );
  }
}
export default Index;

import React, { Component } from "react";
import { Tag, message, Button, Modal } from "antd";
import { connect } from "dva";
import _ from 'lodash';
import router from "umi/router";
import { formatMessage } from "umi-plugin-react/locale";
import groupBy from "lodash/groupBy";
import moment from "moment";
import NoticeIcon from "../NoticeIcon";
import styles from "./index.less";
import DrawerComponent from '../DrawerComponent'
import TodoListView from './TodoListView'
import * as fieldDescribe from "@/utils/fieldDescribe";

class GlobalHeaderRight extends Component {
  state={
    todoDrawerVisible:false,
    noticeModalVisible:false,
    taskTypeOptions:[]
  }

  componentDidMount() {

    const fcTodoTaskTypeFD = fieldDescribe.getObjectDescribeField({
      object_api_name:'fc_todo',
      field_api_name:'task_type'
    });

    const statusOptions  = _.get(fcTodoTaskTypeFD||{}, "options",[]);
    this.setState({taskTypeOptions:statusOptions})

    const { dispatch } = this.props;
    if (dispatch) {
      dispatch({
        type: "global/fetchNotices"
      });
    }
  }

  changeReadState = (clickedItem,callback) => {
    const { id,type,version, } = clickedItem;
    const { dispatch } = this.props;

    // Modal.info({
    //   title: clickedItem.title,
    //   content: (
    //     <span dangerouslySetInnerHTML={{__html:`<html>${clickedItem.content}</html>`}} />
    //   ),
    //   onOk() {},
    // });

    // if(type==='notification'){
    //   this.changeNoticeModalVisible(clickedItem);
    // }
    const dealData = {
      id,
      version,
      status:type==='notification'?'1':'done'
    };
    if (dispatch) {
      dispatch({
        type: "global/changeNoticeReadState",
        payload: {dealData,object_api_name:{'notification':'alert','event':'fc_todo','todo':'fc_todo','done':'fc_todo'}[type]},
        callback:()=>{
          if(callback)callback()
        }
      });
    }

  };

  handleNoticeClear = (title, key) => {
    const { dispatch,notices } = this.props;

    const dealData = _.map(_.filter(notices,{type:key}),(item)=>{
      return  {
        id:item.id,
        version:item.version,
        status:key==='notification'?'1':'done'
      }
    });
    if (dispatch) {
      dispatch({
        type: "global/clearNotices",
        payload: {dealData:{data:dealData},object_api_name:{'notification':'alert','event':'fc_todo'}[key]},
        callback:()=>{
          message.success(
            `${formatMessage({
              id: "component.noticeIcon.cleared"
            })} ${title}`
          );
        }
      });
    }
  };

  getNoticeData = () => {
    const { notices = [] } = this.props;

    if (notices.length === 0) {
      return {};
    }

    const newNotices = notices.map(notice => {
      const newNotice = { ...notice };

      if (newNotice.datetime) {
        newNotice.datetime = moment(notice.datetime).fromNow();
      }

      if (newNotice.id) {
        newNotice.key = newNotice.id;
      }

      if (newNotice.extra && newNotice.status) {
        const {taskTypeOptions}=this.state;
        const taskTypeOption = _.find(taskTypeOptions,{value:newNotice.extra});
        const formatExtra = formatMessage( {id:`option.fc_todo.${newNotice.extra}`,defaultMessage: _.get(taskTypeOption,'label',newNotice.extra)});

        const color = _.get(taskTypeOption,'color',{
          // TODO 如果租户管理端支持color的话，那么这里就写活了
          remove_u_t: "red",
          related_u_t: "blue",
        }[newNotice.status]);
        newNotice.extra = (
          <Tag
            color={color}
            style={{
              marginRight: 0
            }}
          >
            {formatExtra}
          </Tag>
        );
      }

      return newNotice;
    });
    return groupBy(newNotices, "type");
  };

  getUnreadData = noticeData => {
    const unreadMsg = {};
    Object.keys(noticeData).forEach(key => {
      const value = noticeData[key];

      if (!unreadMsg[key]) {
        unreadMsg[key] = 0;
      }

      if (Array.isArray(value)) {
        unreadMsg[key] = value.filter(item => !item.read).length;
      }
    });
    return unreadMsg;
  };

  handleNoticeMore=(tabProps, event)=>{
    const { tabKey } = tabProps;
    if(tabKey==='notification'){
      router.push({
        pathname: '/sys_notification',
        query: {},
      });
    }else{
      this.changeTodoDrawerVisible();
    }
  };

  changeTodoDrawerVisible=()=>{
    const {todoDrawerVisible}= this.state;
    this.setState({todoDrawerVisible:!todoDrawerVisible,})
  }

  changeNoticeModalVisible=(currentItem)=>{
    const {noticeModalVisible}= this.state;
    this.setState({noticeModalVisible:!noticeModalVisible,currentItem})
  }

  render() {
    const { todoDrawerVisible,noticeModalVisible,currentItem={} } = this.state;
    const { currentUser, fetchingNotices,fetchingMoreNotices, onNoticeVisibleChange,unreadCount,unreadNoticeCount,unreadTodoCount } = this.props;
    const noticeData = this.getNoticeData();

    const drawerModalProps = {
      visible: todoDrawerVisible,
      closable:true,
      // maskClosable:false,
      placement:'right',
      width:'40%',
      onClose: () => {
        this.changeTodoDrawerVisible();
      },
    };

    // const modalProps = {
    //   visible: noticeModalVisible,
    //   maskClosable: false,
    //   width: 650,
    //   title: currentItem.title,
    //   wrapClassName: "vertical-center-modal",
    //   okType:formatMessage({
    //     id: "ok"
    //   }),
    //   footer:(<Button type="primary" onClick={()=>this.changeNoticeModalVisible({})}>OK</Button>),
    //   onCancel: () => {
    //     this.changeNoticeModalVisible({});
    //   }
    // };

    return (
      <>
        {
          todoDrawerVisible &&
          <DrawerComponent {...drawerModalProps}>
            <TodoListView
              onItemClick={(item,callback) => {
              this.changeReadState(item,callback);
            }}
            />
          </DrawerComponent>
          }

        {/*{
          noticeModalVisible&&
            <Modal {...modalProps}>
              <span dangerouslySetInnerHTML={{__html:`${currentItem.content}`}} />
            </Modal>
        }*/}

        <NoticeIcon
          className={styles.action}
          count={currentUser && currentUser.unreadCount}
          onItemClick={item => {
            this.changeReadState(item);
          }}
          loading={fetchingNotices}
          clearText={formatMessage({
            id: "component.noticeIcon.clear"
          })}
          viewMoreText={formatMessage({
            id: "component.noticeIcon.view-more"
          })}
          onClear={this.handleNoticeClear}
          onPopupVisibleChange={onNoticeVisibleChange}
          onViewMore={this.handleNoticeMore}
          clearClose
        >
          <NoticeIcon.Tab
            tabKey="notification"
            count={unreadNoticeCount}
            list={noticeData.notification}
            title={formatMessage({
              id: "component.globalHeader.notification"
            })}
            emptyText={formatMessage({
              id: "component.globalHeader.notification.empty"
            })}
            showViewMore
          />
          <NoticeIcon.Tab
            tabKey="event"
            title={formatMessage({
              id: "component.globalHeader.event"
            })}
            emptyText={formatMessage({
              id: "component.globalHeader.event.empty"
            })}
            count={unreadTodoCount}
            list={noticeData.event}
            showViewMore
            showCheckbox
            allowClickItem={false}
          />
        </NoticeIcon>
      </>
    );
  }
}

export default connect(({ user, global, loading }) => ({
  currentUser: user.currentUser,
  collapsed: global.collapsed,
  fetchingMoreNotices: loading.effects["global/fetchMoreNotices"],
  fetchingNotices: loading.effects["global/fetchNotices"],
  notices: global.notices,
  unreadCount:global.unreadCount,
  unreadNoticeCount:global.unreadNoticeCount,
  unreadTodoCount:global.unreadTodoCount,
}))(GlobalHeaderRight);

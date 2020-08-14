import { Badge, Icon, PageHeader, Spin, Tabs, Tag } from "antd";
import React, { Component } from "react";
import _ from "lodash";
import { StickyContainer, Sticky } from 'react-sticky';
import { formatMessage } from "umi-plugin-react/locale";
import { connect } from "dva";
import moment from 'moment';
import groupBy from "lodash/groupBy";
import * as storageUtil from "../../utils/storageUtil";
import styles from "./index.less";
import NoticeList from "../NoticeIcon/NoticeList";
import * as fieldDescribe from "@/utils/fieldDescribe";

const { TabPane } = Tabs;

class TodoListView extends Component {

  static defaultProps = {
    onItemClick: () => {},
    onPopupVisibleChange: () => {},
    onTabChange: () => {},
    onClear: () => {},
    onViewMore: () => {},
    loading: false,
    clearClose: false,
    emptyImage:
      "https://gw.alipayobjects.com/zos/rmsportal/wAhyIChODzsoKIOBHcBk.svg"
  };

  state = {
    taskTypeOptions:[],
    todo:{
      pageNo: 1,
      pageSize: 10,
      hasMore: true,
    },
    done:{
      pageNo: 1,
      pageSize: 10,
      hasMore:true
    }
  };


  componentDidMount() {
    this.queryDataList('todo');

    const fcTodoTaskTypeFD = fieldDescribe.getObjectDescribeField({
      object_api_name:'fc_todo',
      field_api_name:'task_type'
    });

    const statusOptions  = _.get(fcTodoTaskTypeFD||{}, "options",[]);
    this.setState({taskTypeOptions:statusOptions})
  }

  queryDataList=(type='todo',loadMore=false,pageNo)=>{
    const that = this;
    const { dispatch } = this.props;
    const currentPageNo = pageNo||(that.state[type].pageNo+loadMore||1);
    if (dispatch) {
      const dealData =
        {
          "criterias": [
            {
              "field": "owner",
              "operator": "in",
              "value": [
                storageUtil.get('userId')
              ]
            },
            {
              "field": "status",
              "operator": "==",
              "value": [
                type
              ]
            }
          ],
          needRelationQuery: false,
          joiner: "and",
          objectApiName: "fc_todo",
          orders:[{
            field:'create_time',
            sorting:'desc'
          }],
          pageNo: currentPageNo,
          pageSize: that.state[type].pageSize,
        }
      ;
      dispatch({
        type: "global/fetchTodoList",
        payload:{dealData,type,loadMore},
        callback:(pageCount)=>{
          if(currentPageNo===pageCount||pageCount===0){
            _.set(that.state[type],'hasMore',false);
          }
          _.set(that.state[type],'pageNo',currentPageNo);
        }
      });
    }
  }

  onItemClick = (item, tabProps) => {
    const { onItemClick } = this.props;
    if (onItemClick) {
      onItemClick(item, ()=>{
        this.queryDataList('todo',false,1);
      });
    }
  };


  // onTabChange = tabType => {
  //   const { onTabChange } = this.props;
  //   const that = this;
  //   // _.set(that.state[tabType],'pageNo',1);
  //   if (onTabChange) {
  //     onTabChange(tabType);
  //   }
  // };


  getTodoData = () => {
    const { todoList = [],doneList=[] } = this.props;
    if (todoList.length === 0&&doneList.length===0) {
      return {};
    }

    const newTodoList = [...todoList,...doneList].map(todo => {
      const newTodo = { ...todo };

      if (newTodo.datetime) {
        newTodo.datetime = moment(todo.datetime).fromNow();
      }

      if (newTodo.id) {
        newTodo.key = newTodo.id;
      }

      if (newTodo.extra && newTodo.status) {
        const {taskTypeOptions}=this.state;
        const taskTypeOption = _.find(taskTypeOptions,{value:newTodo.extra});
        const formatExtra = formatMessage( {id:`option.fc_todo.${newTodo.extra}`,defaultMessage: _.get(taskTypeOption,'label',newTodo.extra)});

        const color = _.get(taskTypeOption,'color',{
          // TODO 如果租户管理端支持color的话，那么这里就写活了
          remove_u_t: "red",
          related_u_t: "blue",
        }[newTodo.status]);

        newTodo.extra = (
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

      return newTodo;
    });
    return groupBy(newTodoList, "type");
  };

  handleInfiniteOnLoad = (type,itemProps) => {
    this.queryDataList(type,true);
  }

  render() {
    const { fetchingTodoList:loading, } = this.props;
    const { todo,done } = this.state;
    const todoData = this.getTodoData();
    // console.log(todoData)
    const renderTabBar = (props, DefaultTabBar) => (
      <Sticky bottomOffset={64}>
        {({ style, }) => (
          <DefaultTabBar {...props} style={{ ...style, zIndex: 1, background: '#fff', }} />
        )}
      </Sticky>
    );

    return (
      <StickyContainer>
        <PageHeader
          style={{
            // border: '1px solid rgb(235, 237, 240)',
            padding:'0 0',
          }}
          // onBack={() => null}
          title={formatMessage({
            id: "component.globalHeader.todo-list",
          })}
          // subTitle="This is a subtitle"
        />
        <Tabs defaultActiveKey="todo" renderTabBar={renderTabBar} style={{ height: '100%' }} onChange={(activeKey)=>this.queryDataList(activeKey,false,1)}>
          <TabPane
            tab={formatMessage({
              id: "component.globalHeader.todo"
            })}
            key="todo"
          >
            <NoticeList
              clearText={formatMessage({
                id: "component.noticeIcon.clear"
              })}
              viewMoreText={formatMessage({
                id: "component.noticeIcon.view-more"
              })}
              emptyText={formatMessage({
                id: "component.globalHeader.event.empty"
              })}
              data={todoData.todo}
              // onClear={() => this.onClear(title, tabKey)}
              onClick={item => this.onItemClick(item, this.props)}
              onViewMore={event => this.handleInfiniteOnLoad('todo', event)}
              showClear={false}
              showViewMore
              showCheckbox
              showDrawer
              allowClickItem={false}
              loading={loading}
              hasMore={todo.hasMore}
            />
          </TabPane>
          <TabPane
            tab={formatMessage({
              id: "component.globalHeader.done"
            })}
            key="done"
          >
            <NoticeList
              clearText={formatMessage({
                id: "component.noticeIcon.clear"
              })}
              viewMoreText={formatMessage({
                id: "component.noticeIcon.view-more"
              })}
              data={todoData.done}
              emptyText={formatMessage({
                id: "component.noticeIcon.empty"
              })}
              // onClear={() => this.onClear(title, tabKey)}
              onClick={item => this.onItemClick(item)}
              onViewMore={event => this.handleInfiniteOnLoad('done', event)}
              showClear={false}
              showViewMore
              // showCheckbox
              showDrawer
              allowClickItem={false}
              loading={loading}
              hasMore={done.hasMore}
            />
          </TabPane>
        </Tabs>
      </StickyContainer>
    );
  }
}

export default connect(({ user, global, loading }) => ({
  currentUser: user.currentUser,
  collapsed: global.collapsed,
  fetchingMoreTodoList: loading.effects["global/fetchMoreTodoList"],
  fetchingTodoList: loading.effects["global/fetchTodoList"],
  // todos: global.todos,
  todoList: global.todoList,
  doneList: global.doneList
}))(TodoListView);

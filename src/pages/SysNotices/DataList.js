import React from 'react';
import { Icon, List, Avatar, Pagination, Badge } from "antd";
import moment from 'moment';
import Ellipsis from '../../components/Ellipsis';
import styles from './DataList.less';

const DataList = ({ onChange,onClick,dataSource,pagination,...tableProps }) => {
  return (
    <div>
      <List
        className={styles.list}
        {...tableProps}
        itemLayout="vertical"
        size="large"
        dataSource={dataSource}
        renderItem={item => (
          <List.Item
            key={item.name}
            className={styles.item}
            // extra={
            //   <Icon type="right" />
            // }
            actions={
              [moment(item.create_time).format('YYYY-MM-DD HH:mm:ss')]
            }
            onClick={() => onClick ? onClick(item):null}
          >
            <List.Item.Meta
              avatar={
                <Badge dot={item.status==='0'}>
                  <Avatar src="https://gw.alipayobjects.com/zos/rmsportal/ThXAXghbEsBCCSDihZxY.png" />
                </Badge>
              }
              title={item.name}
              // description={<Ellipsis lines={1}>{item.content}</Ellipsis>}
            />
            <Ellipsis lines={1}><span dangerouslySetInnerHTML={{__html:`${item.content}`}} /></Ellipsis>
          </List.Item>
        )}
      />
      <div className={styles.bottomBar}>
        <Pagination onChange={onChange} {...pagination} />
      </div>
    </div>
  );
};

export default DataList;

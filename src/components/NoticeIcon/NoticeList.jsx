import { Avatar, Checkbox, List } from "antd";
import React from "react";
import classNames from "classnames";
import styles from "./NoticeList.less";

const NoticeList = ({
  data = [],
  onClick,
  onClear,
  title,
  onViewMore,
  emptyText,
  showClear = true,
  clearText,
  viewMoreText,
  showViewMore = false,
  showCheckbox = false,
  allowClickItem = true,
  showDrawer = false, // 新增属性，用来控制列表大小
  loading=false,
  hasMore=true,
}) => {
  if (data.length === 0) {
    return (
      <>
        <div className={styles.notFound}>
          <img
            src="https://gw.alipayobjects.com/zos/rmsportal/sAuJeJzSKbUmHfBQRzmZ.svg"
            alt="not found"
          />
          <div>{emptyText}</div>
        </div>
        <div className={styles.bottomBar}>
          {showViewMore && hasMore ? (
            <div
              onClick={e => {
            if (onViewMore) {
              onViewMore(e);
            }
          }}
            >
              {viewMoreText}
            </div>
      ) : null}
        </div>
      </>
    );
  }

  return (
    <div>
      <List
        className={styles.list}
        style={showDrawer?null:{maxHeight:400}}
        dataSource={data}
        renderItem={(item, i) => {
          const itemCls = classNames(styles.item, {
            [styles.read]: item.read,
          }); // eslint-disable-next-line no-nested-ternary

          const leftIcon = item.avatar ? (
            typeof item.avatar === "string" ? (
              <Avatar className={styles.avatar} src={item.avatar} />
            ) : (
              <span className={styles.iconElement}>{item.avatar}</span>
            )
          ) : null;
          const leftCheckBox = showCheckbox?(
            <Checkbox onChange={() => onClick && onClick(item)} style={{paddingRight:10}} defaultChecked={item.read} />
          ):null;

          return (
            <List.Item
              className={itemCls}
              key={item.key || i}
              onClick={() => onClick && allowClickItem ? onClick(item):null}
              style={!allowClickItem?{cursor:'auto'}:{}}
            >
              {leftCheckBox}
              <List.Item.Meta
                className={styles.meta}
                avatar={leftIcon}
                title={
                  <div className={styles.title}>
                    {item.title}
                    <div className={styles.extra}>{item.extra}</div>
                  </div>
                }
                description={
                  <div>
                    <div className={styles.description}>{item.description}</div>
                    <div className={styles.datetime}>{item.datetime}</div>
                  </div>
                }
              />
            </List.Item>
          );
        }}
        loading={loading}
      />
      <div className={styles.bottomBar}>
        {showClear ? (
          <div onClick={onClear}>
            {clearText} {title}
          </div>
        ) : null}
        {showViewMore&&hasMore ? (
          <div
            onClick={e => {
              if (onViewMore) {
                onViewMore(e);
              }
            }}
          >
            {viewMoreText}
          </div>
        ) : null}
      </div>
    </div>
  );
};

export default NoticeList;

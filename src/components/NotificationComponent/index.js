import React from "react";
import _ from "lodash";
import { notification, Button, Icon } from "antd";
import router from "umi/router";

const NotificationComponent = ({
  type,
  message,
  description,
  callback = () => {},
  duration = 4.5,
  icon = {},
  close = () => {},
  btn = {},
  key
}) => {
  let button = "";
  const { tag, go, title, type: btnType } = btn;
  if (tag === "Button") {
    button = (
      <Button
        onClick={() => {
          notification.close(key);
          if (go) router.push(go);
        }}
        type={btnType}
      >
        {title}
      </Button>
    );
  }
  if (type === "open") {
    return notification.open({
      key,
      message,
      description,
      duration,
      icon: (
        <Icon
          type={_.get(icon, "type")}
          style={{ color: _.get(icon, "color") }}
        />
      ),
      onClick: () => {
        callback();
      },
      btn: button,
      onClose: close
    });
  } else if (type === "close") {
    return notification.close(key);
  }
};

export default NotificationComponent;

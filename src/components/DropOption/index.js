import React from 'react';
import { Dropdown, Button, Icon, Menu } from 'antd';

const DropOption = ({ onMenuClick, menuOptions = [], buttonStyle = {}, dropdownProps, dropdownStyle = (
  <Button style={{ border: 'none', ...buttonStyle }}>
    <Icon style={{ marginRight: 2 }} type="bars" />
    <Icon type="down" />
  </Button>
) }) => {
  const menu = menuOptions.map(item => <Menu.Item key={item.key}>{item.name}</Menu.Item>);
  return (
    <Dropdown
      overlay={<Menu onClick={onMenuClick}>{menu}</Menu>}
      {...dropdownProps}
    >
      {dropdownStyle}
    </Dropdown>);
};
export default DropOption;

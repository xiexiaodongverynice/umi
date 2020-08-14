import React, { PureComponent } from "react";
import { Drawer } from "antd";

class Index extends PureComponent {
  constructor(props){
    super(props);
    this.state = {
      visible: props.visible,
      preVisible: props.visible
    };
  }

  static getDerivedStateFromProps(nextProps, preState) {

    if(nextProps.visible&& preState.preVisible && !preState.visible){
      return {
        visible: false,
        preVisible: false
      }
    }
    if(nextProps.visible&& !preState.preVisible && !preState.visible){
      return {
        visible: true,
        preVisible: true
      }
    }

    return null;
  }


  // showDrawer = () => {
  //   this.setState({
  //     visible: true,
  //   });
  // };

  handleClose = () => {
    const { onClose }= this.props;
    this.setState({
      visible: false,
    });
    if(onClose) onClose()
  };

  render() {
    const { title, placement='right',style, children, onClose, ...modalProps } = this.props;
    const { visible } = this.state;

    const modalOpts = {
      ...modalProps,
      onClose: this.handleClose,
    };

    return (
      <Drawer
        title={title}
        placement={placement}
        {...modalOpts}
        visible={visible}
        style={{
          paddingTop: 64,
          ...style
        }}
      >
        {children}
      </Drawer>
    );
  }
}
export default Index

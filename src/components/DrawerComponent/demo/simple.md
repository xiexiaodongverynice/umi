---

---

简单的使用。

````jsx
const { modalVisible } = this.props;// this.state;
const drawerModalProps = {
      visible: modalVisible,
      closable:true,
      placement:'right',
      width:'30%',
      onClose: () => {
        this.props.dispatch({
          type: `${nameSpace}/hideModal`,
          payload: { modalVisible: false }
        });
      },
    };
    
     {profileModalVisible &&
          <DrawerComponent {...drawerModalProps}>
            <Button>
              body button action
            </Button>
          </DrawerComponent>
      }
    
````

import React from "react";
import { Button, Card, Result } from "antd";

/**
 * 错误捕获处理组件
 */
export default class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false };
  }

  componentDidCatch(error, info) {
    this.setState({ hasError: true });
  }

  unstable_handleError() {
    this.setState({ hasError: true });
  }

  render() {
    const { hasError } = this.state;
    if (hasError) {
      return (
        <Card>
          <Result
            status="warning"
            title="There's a problem here"
            extra={
              <Button type="primary" key="console" onClick={() => this.setState({ hasError: false })}>
                Hidden
              </Button>
            }
          />
        </Card>);
    }
    const { children } = this.props;
    return children;
  }
}

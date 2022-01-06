class App {
  constructor($app) {
    this.state = {
      isRoot: false,
      nodes: [],
      depth: [],
    };

    this.breadcrumb = new Breadcrumb({
      $app,
      initialState: this.state.depth,
    });

    this.nodes = new Nodes({
      $app,
      initialState: {
        isRoot: this.state.isRoot,
        nodes: this.state.nodes,
      },
      onClick: (node) => {
        if (node.type === "DIRECTORY") {
        } else if (node.type === "FILE") {
        }
      },
    });
  }

  // App 컴포넌트에도 setState 함수 정의하기
  setState(nextState) {
    this.state = nextState;
    this.breadcrumb.setState(this.state.depth);
    this.nodes.setState({
      isRoot: this.state.isRoot,
      nodes: this.state.nodes,
    });
  }
}

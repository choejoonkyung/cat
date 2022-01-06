class App {
  constructor($app) {
    this.state = {
      isRoot: false,
      nodes: [],
      depth: [],
    };

    new Breadcrumb({
      $app,
      initialState: this.state.depth,
    });

    new Nodes({
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
}

import { request } from "../../utils/api.js";
import Breadcrumb from "../Breadcrumb/Breadcrumb.js";
import Nodes from "../Nodes/Nodes.js";
import ImageView from "../ImageView/ImageView.js";

class App {
  constructor($app) {
    this.state = {
      isRoot: true,
      nodes: [],
      depth: [],
      selectedFilePath: null,
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
      onClick: async (node) => {
        try {
          if (node.type === "DIRECTORY") {
            const nextNodes = await request(node.id);
            this.setState({
              ...this.state,
              depth: [...this.state.depth, node],
              nodes: nextNodes,
              isRoot: false,
            });
          } else if (node.type === "FILE") {
            this.setState({
              ...this.state,
              selectedFilePath: node.filePath,
            });
          }
        } catch (e) {}
      },
      onBackClick: async () => {
        try {
          const nextState = { ...this.state };
          nextState.depth.pop();

          const prevNodeId =
            nextState.depth.length === 0
              ? null
              : nextState.depth[nextState.depth.length - 1].id;

          if (prevNodeId === null) {
            const rootNodes = await request();
            this.setState({
              ...nextState,
              isRoot: true,
              nodes: rootNodes,
            });
          } else {
            const prevNodes = await request(prevNodeId);
            this.setState({
              ...nextNodes,
              isRoot: false,
              nodes: prevNodes,
            });
          }
        } catch (e) {}
      },
    });

    this.imageView = new ImageView({
      $app,
      initialState: this.state.selectedNodeImage,
    });

    this.init();
  }

  // App 컴포넌트에도 setState 함수 정의하기
  setState(nextState) {
    this.state = nextState;
    this.breadcrumb.setState(this.state.depth);
    this.nodes.setState({
      isRoot: this.state.isRoot,
      nodes: this.state.nodes,
    });
    this.imageView.setState(this.state.selectedFilePath);
  }

  async init() {
    try {
      const rootNodes = await request();
      this.setState({
        ...this.state,
        isRoot: true,
        nodes: rootNodes,
      });
    } catch (e) {
      console.log(e);
      throw new Error(`무언가 잘못 되었습니다! ${e.message}`);
    }
  }
}

export default App;

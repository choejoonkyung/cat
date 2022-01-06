import { request } from "../../utils/api.js";
import Breadcrumb from "../Breadcrumb/Breadcrumb.js";
import Nodes from "../Nodes/Nodes.js";

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
      throw new Error(`무언가 잘못 되었습니다! ${e.message}`);
    }
  }
}

export default App;

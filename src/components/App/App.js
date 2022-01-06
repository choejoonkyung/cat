import { request } from "../../utils/api.js";
import Breadcrumb from "../Breadcrumb/Breadcrumb.js";
import Nodes from "../Nodes/Nodes.js";
import ImageView from "../ImageView/ImageView.js";
import Loading from "../Loading/Loading.js";

class App {
  constructor($app) {
    this.state = {
      isRoot: true,
      nodes: [],
      depth: [],
      selectedFilePath: null,
      isLoading: true,
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
            this.setState({
              ...this.state,
              isLoading: true,
            });
            const nextNodes = await request(node.id);
            this.setState({
              ...this.state,
              depth: [...this.state.depth, node],
              nodes: nextNodes,
              isRoot: false,
              isLoading: false,
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
          this.setState({
            ...this.state,
            isLoading: true,
          });
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
              isLoading: false,
            });
          } else {
            const prevNodes = await request(prevNodeId);
            this.setState({
              ...nextNodes,
              isRoot: false,
              nodes: prevNodes,
              isLoading: false,
            });
          }
        } catch (e) {}
      },
    });

    this.imageView = new ImageView({
      $app,
      initialState: this.state.selectedNodeImage,
    });

    this.loading = new Loading({ $app, initialState: this.state.isLoading });

    this.init();
  }

  setState(nextState) {
    this.state = nextState;
    this.loading.setState(this.state.isLoading);
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
        isLoading: false,
      });
    } catch (e) {
      console.log(e);
      throw new Error(`무언가 잘못 되었습니다! ${e.message}`);
    }
  }
}

export default App;

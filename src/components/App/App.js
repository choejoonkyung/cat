import { request } from "../../utils/api.js";
import Breadcrumb from "../Breadcrumb/Breadcrumb.js";
import Nodes from "../Nodes/Nodes.js";
import ImageView from "../ImageView/ImageView.js";
import Loading from "../Loading/Loading.js";

const cache = {};

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
      onClick: (index) => {
        if (index === null) {
          this.setState({
            ...this.state,
            depth: [],
            nodes: cache.root,
            isRoot: true,
          });
          return;
        }

        if (index === this.state.depth.length - 1) {
          return;
        }

        const nextState = { ...this.state };
        const nextDepth = this.state.depth.slice(0, index + 1);

        this.setState({
          ...nextState,
          depth: nextDepth,
          nodes: cache[nextDepth[nextDepth.length - 1].id],
        });
      },
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
            if (cache[node.id]) {
              this.setState({
                ...this.state,
                depth: [...this.state.depth, node],
                nodes: cache[node.id],
                isLoading: false,
                isRoot: false,
              });
            } else {
              const nextNodes = await request(node.id);
              this.setState({
                ...this.state,
                depth: [...this.state.depth, node],
                nodes: nextNodes,
                isLoading: false,
                isRoot: false,
              });
              cache[node.id] = nextNodes;
            }
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
            this.setState({
              ...nextState,
              isRoot: true,
              nodes: cache.root,
            });
          } else {
            this.setState({
              ...nextState,
              isRoot: false,
              nodes: cache[prevNodeId],
            });
          }
        } catch (e) {}
      },
    });

    this.imageView = new ImageView({
      $app,
      initialState: this.state.selectedNodeImage,
      onClose: () => {
        this.setState({
          ...this.state,
          selectedFilePath: null,
        });
      },
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
      // 캐시에 추가
      cache.root = rootNodes;
    } catch (e) {
      console.log(e);
      throw new Error(`무언가 잘못 되었습니다! ${e.message}`);
    }
  }
}

export default App;

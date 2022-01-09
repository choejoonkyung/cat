class Nodes {
  constructor({ $app, initialState, onClick, onBackClick }) {
    this.state = initialState;
    this.$target = document.createElement("ul");
    this.onClick = onClick;
    this.onBackClick = onBackClick;
    $app.appendChild(this.$target);
    this.render();

    this.$target.addEventListener("click", (e) => {
      const $node = e.target.closest(".Node");
      if ($node) {
        const { nodeId } = $node.dataset;

        if (!nodeId) {
          this.onBackClick();
          return;
        }

        const selectedNode = this.state.nodes.find(
          (node) => node.id === nodeId
        );

        if (selectedNode) {
          this.onClick(selectedNode);
        }
      }
    });
  }

  setState(nextState) {
    this.state = nextState;
    this.render();
  }

  render() {
    if (this.state.nodes) {
      const nodesTemplate = this.state.nodes
        .map((node) => {
          const iconPath =
            node.type === "FILE"
              ? "./assets/file.png"
              : "./assets/directory.png";

          return `
            <li class="Node" data-node-id="${node.id}">
              <img src="${iconPath}" />
              <p>${node.name}</p>
            </li>
          `;
        })
        .join("");

      this.$target.innerHTML = !this.state.isRoot
        ? `<li class="Node"><img src="/assets/prev.png"></li>${nodesTemplate}`
        : nodesTemplate;
    }

    // this.$target.querySelectorAll(".Node").forEach(($node) => {
    //   $node.addEventListener("click", () => {
    //     const { nodeId } = $node.dataset;
    //     if (!nodeId) {
    //       this.onBackClick();
    //     }
    //     const selectedNode = this.state.nodes.find(
    //       (node) => node.id === nodeId
    //     );
    //     if (selectedNode) {
    //       this.onClick(selectedNode);
    //     }
    //   });
    // });
  }
}

export default Nodes;

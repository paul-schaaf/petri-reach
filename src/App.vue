<template>
  <div>
    <button id="show-modal" @click="showModal = true">
      Show required format
    </button>
    <modal v-if="showModal" @close="showModal = false">
      <template v-slot:header>
        <h3>Required Format</h3>
      </template>
    </modal>
  </div>
  <div style="display: flex; justify-content: center">
    <input
      type="file"
      @change="onFile"
      style="width: 180px; margin-top: 20px"
    />
  </div>
  <div
    style="width: 100%; display: flex; justify-content: center; margin-top: 20px"
  >
    <svg style="display: block" width="1200"></svg>
  </div>
</template>

<script lang="ts">
import { defineComponent, onMounted, ref } from "vue";
import dagreD3 from "dagre-d3";
import * as d3 from "d3";

import Modal from "./Modal.vue";
import { buildReachabilityGraph } from "./graphBuilding";

export default defineComponent({
  name: "App",
  components: {
    Modal
  },
  setup() {
    const onFile = (ev: any) => {
      const file = ev.target.files[0];
      const fr = new FileReader();
      fr.onload = () => {
        const arrows = buildReachabilityGraph(JSON.parse(fr.result as string));
        const g = new dagreD3.graphlib.Graph()
          .setGraph({ rankdir: "LR" })
          .setDefaultEdgeLabel(function() {
            return {};
          });
        const added: { [k: string]: boolean } = {};
        arrows.forEach(({ from, to, transition }) => {
          if (!added[from]) {
            g.setNode(from, { label: from });
            added[from] = true;
          }
          if (!added[to]) {
            g.setNode(to, { label: to });
            added[to] = true;
          }
          g.setEdge(from, to, { label: transition });
        });

        const render = new dagreD3.render();
        const svg = d3.select("svg"),
          svgGroup = svg.append("g");

        render(d3.select("svg g") as any, g as any);

        const xCenterOffset =
          (((svg.attr("width") as unknown) as number) - g.graph().width!) / 2;
        svgGroup.attr("transform", "translate(" + xCenterOffset + ", 20)");
        svg.attr("height", g.graph().height! + 40);
      };

      fr.readAsText(file);
    };

    return { onFile, showModal: ref(false) };
  }
});
</script>

<style lang="scss">
#app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
  margin-top: 60px;
}

g.type-TK > rect {
  fill: #00ffd0;
}

text {
  font-weight: 300;
  font-family: "Helvetica Neue", Helvetica, Arial, sans-serif;
  font-size: 14px;
}

.node rect {
  stroke: #999;
  fill: #fff;
  stroke-width: 1.5px;
}

.edgePath path {
  stroke: #333;
  stroke-width: 1.5px;
}
</style>

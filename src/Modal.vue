<!-- template for the modal component -->
<template type="text/x-template" id="modal-template">
  <transition name="modal">
    <div class="modal-mask">
      <div class="modal-wrapper">
        <div class="modal-container">

          <div class="modal-header">
            <slot name="header">
              default header
            </slot>
          </div>

          <div class="modal-body">
                  <p>File type must be JSON. Example:</p>
      <p>
      <pre>
      <code style="width: 500px; display:inline-block; text-align: left" ref="jsonRef" class="json">
{
  "nodes": {
    "s1": {
      "capacity": null, #null to make capacity infinite 
      "tokens": 1
    },
    "s2": {
      "capacity": null,
      "tokens": 0
    },
    "s3": {
      "capacity": null,
      "tokens": 0
    }
  },
  "transitions": {
    "t1": {
      "from": [["s1", 1]], #input nodes with tokens/node
      "to": [["s2", 2]]  #output nodes with tokens/node
    },
    "t2": {
      "from": [["s2", 2]],
      "to": [["s1", 1]]
    },
    "t3": {
      "from": [["s2", 1]],
      "to": [["s3", 1]]
    },
    "t4": {
      "from": [["s2", 1], ["s3", 1]],
      "to": [["s1", 1]]
    }
  }
}
      </code>
      </pre>
      </p>
          </div>

          <div class="modal-footer">
            <slot name="footer">
              <button class="modal-default-button" @click="$emit('close')">
                OK
              </button>
            </slot>
          </div>
        </div>
      </div>
    </div>
  </transition>
</template>

<script lang="ts">
import { defineComponent, onMounted, ref } from "vue";
import hljs from 'highlight.js/lib/core';
import json from 'highlight.js/lib/languages/json';
import 'highlight.js/styles/atelier-lakeside-dark.css';

hljs.registerLanguage('json', json);

export default defineComponent({
  name: "Modal",
  setup() {
    const jsonRef = ref(null);
    onMounted(() => {
      console.log(jsonRef.value);
      hljs.highlightBlock(jsonRef.value as unknown as HTMLElement);
    })

    return { jsonRef };
  }
})
</script>

<style lang="scss" scoped>
#app {
  padding: 1rem;
}

.modal-mask {
  position: fixed;
  z-index: 9998;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-color: rgba(0, 0, 0, 0.5);
  display: table;
  transition: opacity 0.3s ease;
}

.modal-wrapper {
  display: table-cell;
  vertical-align: middle;
}

.modal-container {
  width: 600px;
  margin: 0px auto;
  padding: 20px 30px;
  background-color: #fff;
  border-radius: 2px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.33);
  transition: all 0.3s ease;
  font-family: Helvetica, Arial, sans-serif;
}

.modal-header h3 {
  margin-top: 0;
  color: #42b983;
}

.modal-body {
  margin: 20px 0;
  width: 100%;
}

.modal-default-button {
  display: block;
  margin-top: 1rem;
}
.modal-enter {
  opacity: 0;
}

.modal-leave-active {
  opacity: 0;
}

.modal-enter .modal-container,
.modal-leave-active .modal-container {
  -webkit-transform: scale(1.1);
  transform: scale(1.1);
}
</style>


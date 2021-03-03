import { cloneDeep } from "lodash-es";
export interface Transition {
  from: [string, number][];
  to: [string, number][];
}

const nodesToString = (nodes: { [k: string]: {capacity: number, tokens: number} }) => Object.values(nodes)
  .map(v => "" + v.tokens)
  .join(",");

export const buildReachabilityGraph = (source: any) => {
  const nodes = source["nodes"];
  const transitions = source["transitions"];
  const initialValues = Object.fromEntries(
    Object.keys(nodes).map(n => [n, {capacity: nodes[n].capacity, tokens: nodes[n].tokens}])
  );
  const visited: { [k: string]: boolean } = {};
  const arrows: {from: string, to:string}[] = [];
  buildGraph(initialValues, arrows, visited, transitions);
  return arrows;
};

const buildGraph = (from: {
  [k: string]: {
      capacity: any;
      tokens: any;
  };
}, arrows: {from: string, to:string}[], visited: { [k: string]: boolean }, transitions: any) => {
  const fromString = nodesToString(from);
  visited[fromString] = true;

  getTransitionsFromState(transitions, from).forEach(t => {
    const newState = executeTransition(from, transitions[t]);
    const newStateString = nodesToString(newState);

    arrows.push({from: fromString, to: newStateString});

    if (!visited[newStateString]) {
      buildGraph(newState, arrows, visited, transitions);
    }
  });
}

export const getTransitionsFromState = (
  transitions: { [k: string]: Transition },
  state: { [k: string]: { capacity: number; tokens: number } }
) => {
  return Object.keys(transitions).filter(t => 
      transitions[t].from.every(f => state[f[0]].tokens >= f[1]) &&
      transitions[t].to.every(
        t => state[t[0]].capacity >= t[1] + state[t[0]].tokens
      )
  );
};

export const executeTransition = (
  state: { [k: string]: { capacity: number; tokens: number } },
  transition: Transition
) => {
  const newState = cloneDeep(state);
  transition.from.forEach(f => {
    newState[f[0]].tokens -= f[1];
  });
  transition.to.forEach(t => {
    newState[t[0]].tokens += t[1];
  });
  return newState;
};

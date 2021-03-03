import {
  buildReachabilityGraph,
  executeTransition,
  getTransitionsFromState,
  Transition
} from "./graphBuilding";

const state: { [k: string]: { capacity: number; tokens: number } } = {
  s1: {
    capacity: 5,
    tokens: 0
  },
  s2: {
    capacity: 4,
    tokens: 3
  },
  s3: {
    capacity: 1,
    tokens: 1
  },
  s4: {
    capacity: 10,
    tokens: 3
  }
};

test("executeTransition", () => {
  const transition: Transition = {
    from: [["s3", 1]],
    to: [
      ["s2", 1],
      ["s1", 4],
      ["s4", 4]
    ]
  };

  const expectedNewState: {
    [k: string]: { capacity: number; tokens: number };
  } = {
    s1: {
      capacity: 5,
      tokens: 4
    },
    s2: {
      capacity: 4,
      tokens: 4
    },
    s3: {
      capacity: 1,
      tokens: 0
    },
    s4: {
      capacity: 10,
      tokens: 7
    }
  };
  const actualNewState = executeTransition(state, transition);

  expect(actualNewState).toEqual(expectedNewState);
});

describe("getTransitionsFromState", () => {
  test("getTransitionsFromState - no_capacity_single", () => {
    const transitions: { [k: string]: Transition } = {
      t1: {
        from: [["s2", 1]],
        to: [["s3", 2]]
      }
    };

    const actualTransitions = getTransitionsFromState(transitions, state);

    expect(actualTransitions.length).toBe(0);
  });

  test("getTransitionsFromState - no_capacity_multiple", () => {
    const transitions: { [k: string]: Transition } = {
      t1: {
        from: [["s2", 1]],
        to: [["s3", 2]]
      },
      t2: {
        from: [["s3", 1]],
        to: [["s4", 10]]
      },
      t3: {
        from: [["s3", 1]],
        to: [["s4", 3]]
      }
    };

    const actualTransitions = getTransitionsFromState(transitions, state);

    expect(actualTransitions).toEqual(["t3"]);
  });

  test("getTransitionsFromState - no_tokens_single", () => {
    const transitions: { [k: string]: Transition } = {
      t1: {
        from: [["s1", 2]],
        to: [["s4", 2]]
      }
    };

    const actualTransitions = getTransitionsFromState(transitions, state);

    expect(actualTransitions.length).toBe(0);
  });

  test("getTransitionsFromState - no_tokens_multiple", () => {
    const transitions: { [k: string]: Transition } = {
      t1: {
        from: [["s2", 4]],
        to: [["s3", 0]]
      },
      t2: {
        from: [["s3", 2]],
        to: [["s4", 0]]
      },
      t3: {
        from: [["s3", 1]],
        to: [["s4", 0]]
      }
    };

    const actualTransitions = getTransitionsFromState(transitions, state);

    expect(actualTransitions).toEqual(["t3"]);
  });

  test("getTransitionsFromState - no_tokens_mixed", () => {
    const transitions: { [k: string]: Transition } = {
      t1: {
        from: [["s2", 4]],
        to: [["s3", 0]]
      },
      t2: {
        from: [["s3", 2]],
        to: [["s4", 0]]
      },
      t3: {
        from: [["s3", 1]],
        to: [["s4", 0]]
      },
      t4: {
        from: [["s2", 1]],
        to: [["s3", 2]]
      },
      t5: {
        from: [["s3", 1]],
        to: [["s4", 10]]
      },
      t6: {
        from: [["s3", 1]],
        to: [["s4", 3]]
      }
    };

    const actualTransitions = getTransitionsFromState(transitions, state);

    expect(actualTransitions).toEqual(["t3", "t6"]);
  });
});

describe("buildReachabilityGraph", () => {
  test("buildReachabilityGraph", () => {
    const source = {
      nodes: {
        s1: {
          capacity: Infinity,
          tokens: 1
        },
        s2: {
          capacity: Infinity,
          tokens: 0
        },
        s3: {
          capacity: Infinity,
          tokens: 0
        }
      },
      transitions: {
        t1: {
          from: [["s1", 1]],
          to: [["s2", 2]]
        },
        t2: {
          from: [["s2", 2]],
          to: [["s1", 1]]
        },
        t3: {
          from: [["s2", 1]],
          to: [["s3", 1]]
        },
        t4: {
          from: [
            ["s2", 1],
            ["s3", 1]
          ],
          to: [["s1", 1]]
        }
      }
    };
    const arrows = buildReachabilityGraph(source);
    const expectedArrows = [
      { from: "1,0,0", to: "0,2,0" },
      { from: "0,2,0", to: "1,0,0" },
      { from: "0,2,0", to: "0,1,1" },
      { from: "0,1,1", to: "0,0,2" },
      { from: "0,1,1", to: "1,0,0" }
    ];
    expect(expectedArrows.length).toEqual(arrows.length);
    expect(arrows).toEqual(expect.arrayContaining(expectedArrows));
  });
});

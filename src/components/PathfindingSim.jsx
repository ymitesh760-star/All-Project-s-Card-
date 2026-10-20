import React, { useState, useEffect, useCallback, useRef } from "react";
import { Play, RotateCcw, Zap } from "lucide-react";

const ROWS = 6;
const COLS = 11;
const START = { r: 2, c: 1 };
const TARGET = { r: 2, c: 9 };

export default function PathfindingSim({ interactive = true, compact = false }) {
  const [grid, setGrid] = useState([]);
  const [algorithm, setAlgorithm] = useState("A*");
  const [isSimulating, setIsSimulating] = useState(false);
  const [metrics, setMetrics] = useState({
    visited: 28,
    pathLength: 9,
    time: "1.4ms"
  });
  const animTimeoutRef = useRef([]);

  const initGrid = useCallback(() => {
    animTimeoutRef.current.forEach(clearTimeout);
    animTimeoutRef.current = [];
    setIsSimulating(false);

    const initialGrid = [];
    for (let r = 0; r < ROWS; r++) {
      const row = [];
      for (let c = 0; c < COLS; c++) {
        const isStart = r === START.r && c === START.c;
        const isTarget = r === TARGET.r && c === TARGET.c;
        const isWall =
          (c === 4 && r >= 1 && r <= 4) ||
          (c === 7 && r >= 0 && r <= 3);

        row.push({
          r,
          c,
          isStart,
          isTarget,
          isWall: !isStart && !isTarget && isWall,
          isVisited: false,
          isPath: false
        });
      }
    }
    setGrid(initialGrid);
  }, []);

  useEffect(() => {
    initGrid();
    return () => {
      animTimeoutRef.current.forEach(clearTimeout);
    };
  }, [initGrid]);

  const toggleWall = (r, c) => {
    if (!interactive || isSimulating) return;
    if ((r === START.r && c === START.c) || (r === TARGET.r && c === TARGET.c)) return;
    setGrid((prev) =>
      prev.map((row, ri) =>
        row.map((cell, ci) => {
          if (ri === r && ci === c) {
            return { ...cell, isWall: !cell.isWall, isVisited: false, isPath: false };
          }
          return cell;
        })
      )
    );
  };

  const runSimulation = () => {
    if (isSimulating) return;
    setIsSimulating(true);

    // Reset visited and path
    setGrid((prev) =>
      prev.map((row) =>
        row.map((cell) => ({
          ...cell,
          isVisited: false,
          isPath: false
        }))
      )
    );

    const t0 = performance.now();
    const visitedNodes = [];
    const queue = [{ r: START.r, c: START.c, g: 0, parent: null }];
    const visitedSet = new Set([`${START.r}-${START.c}`]);
    const parents = new Map();
    const dr = [-1, 0, 1, 0];
    const dc = [0, 1, 0, -1];
    let endNode = null;

    while (queue.length > 0) {
      if (algorithm === "A*") {
        queue.sort((a, b) => {
          const hA = Math.abs(a.r - TARGET.r) + Math.abs(a.c - TARGET.c);
          const hB = Math.abs(b.r - TARGET.r) + Math.abs(b.c - TARGET.c);
          return a.g + hA * 1.2 - (b.g + hB * 1.2);
        });
      } else if (algorithm === "Dijkstra") {
        queue.sort((a, b) => a.g - b.g);
      }

      const curr = queue.shift();
      visitedNodes.push(curr);

      if (curr.r === TARGET.r && curr.c === TARGET.c) {
        endNode = curr;
        break;
      }

      for (let i = 0; i < 4; i++) {
        const nr = curr.r + dr[i];
        const nc = curr.c + dc[i];
        const key = `${nr}-${nc}`;

        if (
          nr >= 0 &&
          nr < ROWS &&
          nc >= 0 &&
          nc < COLS &&
          !visitedSet.has(key)
        ) {
          const cell = grid[nr]?.[nc];
          if (cell && !cell.isWall) {
            visitedSet.add(key);
            parents.set(key, curr);
            queue.push({ r: nr, c: nc, g: curr.g + 1, parent: curr });
          }
        }
      }
    }

    const t1 = performance.now();
    const latency = Math.max(0.5, t1 - t0).toFixed(1) + "ms";

    // Reconstruct shortest path
    const pathNodes = [];
    let p = endNode;
    while (p) {
      pathNodes.unshift(p);
      const parentKey = `${p.r}-${p.c}`;
      p = parents.get(parentKey);
    }

    // Animate visited cells
    visitedNodes.forEach((node, idx) => {
      const t = setTimeout(() => {
        setGrid((prev) =>
          prev.map((row, ri) =>
            row.map((cell, ci) => {
              if (ri === node.r && ci === node.c) {
                return { ...cell, isVisited: true };
              }
              return cell;
            })
          )
        );

        // If last visited reached, animate shortest path
        if (idx === visitedNodes.length - 1) {
          if (pathNodes.length > 0 && endNode) {
            pathNodes.forEach((pNode, pIdx) => {
              const pt = setTimeout(() => {
                setGrid((prevG) =>
                  prevG.map((row, ri) =>
                    row.map((cell, ci) => {
                      if (ri === pNode.r && ci === pNode.c) {
                        return { ...cell, isPath: true };
                      }
                      return cell;
                    })
                  )
                );

                if (pIdx === pathNodes.length - 1) {
                  setIsSimulating(false);
                  setMetrics({
                    visited: visitedNodes.length,
                    pathLength: pathNodes.length,
                    time: latency
                  });
                }
              }, pIdx * 35);
              animTimeoutRef.current.push(pt);
            });
          } else {
            setIsSimulating(false);
            setMetrics({
              visited: visitedNodes.length,
              pathLength: 0,
              time: latency
            });
          }
        }
      }, idx * 22);
      animTimeoutRef.current.push(t);
    });
  };

  return (
    <div className={`clean-pathfinding-box ${compact ? "compact" : ""}`}>
      {/* Simulator Control Header */}
      <div className="sim-top-row">
        <div className="sim-title-group">
          <span className="sim-tag">INTERACTIVE GRAPH LAB</span>
          <span className="sim-algo-formula">
            {algorithm === "A*" ? "A* Search (Manhattan Distance)" : algorithm === "Dijkstra" ? "Dijkstra (Uniform Cost)" : "Breadth-First Search (Queue)"}
          </span>
        </div>

        <div className="sim-btn-group">
          <div className="algo-switch-pills">
            {["A*", "Dijkstra", "BFS"].map((algo) => (
              <button
                key={algo}
                type="button"
                onClick={() => setAlgorithm(algo)}
                disabled={isSimulating}
                className={`algo-switch-btn ${algorithm === algo ? "active" : ""}`}
              >
                {algo}
              </button>
            ))}
          </div>

          <button
            type="button"
            onClick={runSimulation}
            disabled={isSimulating}
            className="sim-play-btn"
            title="Run algorithm animation"
          >
            <Play size={12} fill="currentColor" />
            <span>{isSimulating ? "Running..." : "Simulate"}</span>
          </button>

          <button
            type="button"
            onClick={initGrid}
            disabled={isSimulating}
            className="sim-reload-btn"
            title="Reset maze"
          >
            <RotateCcw size={12} />
          </button>
        </div>
      </div>

      {/* Grid Canvas */}
      <div className="sim-canvas-area">
        <div className="sim-grid-frame">
          {grid.map((row, r) =>
            row.map((cell, c) => {
              let cellClass = "clean-cell";
              if (cell.isStart) cellClass += " start";
              else if (cell.isTarget) cellClass += " target";
              else if (cell.isPath) cellClass += " path";
              else if (cell.isVisited) cellClass += " visited";
              else if (cell.isWall) cellClass += " wall";

              return (
                <div
                  key={`${r}-${c}`}
                  className={cellClass}
                  onClick={(e) => {
                    e.stopPropagation();
                    toggleWall(r, c);
                  }}
                  title={
                    cell.isStart
                      ? "Start (A)"
                      : cell.isTarget
                      ? "Target (B)"
                      : cell.isWall
                      ? "Wall (Click to remove)"
                      : "Click to toggle obstacle"
                  }
                >
                  {cell.isStart && <span className="marker-text">S</span>}
                  {cell.isTarget && <span className="marker-text">T</span>}
                </div>
              );
            })
          )}
        </div>
      </div>

      {/* Telemetry Footer */}
      <div className="sim-bottom-bar">
        <div className="telemetry-figures">
          <span className="tel-item">
            <strong>Visited:</strong> {metrics.visited} nodes
          </span>
          <span className="tel-sep">·</span>
          <span className="tel-item">
            <strong>Path:</strong> {metrics.pathLength} steps
          </span>
          <span className="tel-sep">·</span>
          <span className="tel-item">
            <strong>Latency:</strong> {metrics.time}
          </span>
        </div>
        <span className="tel-hint">Click any cell to add or remove obstacles</span>
      </div>
    </div>
  );
}

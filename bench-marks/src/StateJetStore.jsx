import React, { useState } from 'react';
import { useStore, useSlice } from 'state-jet';

// StateJet store setup
const itemSlice = useSlice("itemSlice");
const itemSlicer = () => itemSlice("state", {});
const initializer = () => ({
  items: itemSlicer()
});
const itemStore = () => useStore(initializer);

function PerformanceBenchmark() {
  const [logs, setLogs] = useState([]);
  const store = itemStore();
  const storeItems = store.items;

  const addLog = (msg) => setLogs((prev) => [...prev, msg]);

  const runBenchmark = () => {
    console.clear();
    setLogs([]);

    // Clear store before test
    storeItems.set({})  // Reset store
    addLog('Start benchmark...');

    // 1. Bulk set 10,000 items and measure time
    let t0 = performance.now();
    for (let i = 0; i < 10000; i++) {
      storeItems.set((sliceData) => {
        sliceData[`key${i}`] = i;
        return sliceData;
      });
    }
    let t1 = performance.now();
    addLog(`Set 10,000 items - total time: ${(t1 - t0).toFixed(2)} ms`);
    console.log(`Set 10,000 items - total time: ${(t1 - t0).toFixed(2)} ms`);

    // 2. Bulk get 10,000 items and measure time
    t0 = performance.now();
    let sum = 0;
      const sliceItem = storeItems.get();
    for (let i = 0; i < 10000; i++) {
      sum += sliceItem[`key${i}`];
    }
    t1 = performance.now();
    addLog(`Get 10,000 items - total time: ${(t1 - t0).toFixed(2)} ms`);
    addLog(`Sum of values: ${sum}`);
    console.log(`Get 10,000 items - total time: ${(t1 - t0).toFixed(2)} ms`);

    // 3. Measure latency of single set operation (average of 1000 runs)
    const setLatencies = [];
    for (let i = 0; i < 1000; i++) {
      const start = performance.now();
      storeItems.set((sliceData) => {
        sliceData[`latencyKey${i}`] = i;
        return sliceData;
      });
      const end = performance.now();
      setLatencies.push(end - start);
    }
    const avgSetLatency =
      setLatencies.reduce((a, b) => a + b, 0) / setLatencies.length;
    addLog(`Average latency per single set: ${avgSetLatency.toFixed(4)} ms`);
    console.log(`Average latency per single set: ${avgSetLatency.toFixed(4)} ms`);

    // 4. Measure latency of single get operation (average of 1000 runs)
    const getLatencies = [];
    for (let i = 0; i < 1000; i++) {
      const start = performance.now();
      const sliceItem = storeItems.get();
      const val = sliceItem[`latencyKey${i}`]
      const end = performance.now();
      getLatencies.push(end - start);
    }
    const avgGetLatency =
      getLatencies.reduce((a, b) => a + b, 0) / getLatencies.length;
    addLog(`Average latency per single get: ${avgGetLatency.toFixed(4)} ms`);
    console.log(`Average latency per single get: ${avgGetLatency.toFixed(4)} ms`);

    // 5. Memory info (limited support)
    if (performance && performance.memory) {
      const mem = performance.memory;
      addLog(
        `JS Heap Size: ${(
          mem.usedJSHeapSize /
          1024 /
          1024
        ).toFixed(2)} MB / ${(
          mem.jsHeapSizeLimit /
          1024 /
          1024
        ).toFixed(2)} MB`
      );
      console.log(
        `JS Heap Size: ${(mem.usedJSHeapSize / 1024 / 1024).toFixed(
          2
        )} MB / ${(mem.jsHeapSizeLimit / 1024 / 1024).toFixed(2)} MB`
      );
    } else {
      addLog('Memory info not available in this browser');
    }
  };

  return (
    <div style={{ padding: 20, fontFamily: 'Arial, sans-serif' }}>
      <h2>StateJet Memory, Performance & Latency Benchmark</h2>
      <button onClick={runBenchmark} style={{ fontSize: 16, padding: '8px 16px' }}>
        Run Benchmark
      </button>
      {logs.length > 0 && <div
        style={{
          marginTop: 20,
          padding: 10,
          backgroundColor: '#f9f9f9',
          borderRadius: 4,
          maxHeight: 300,
          overflowY: 'auto',
          fontFamily: 'monospace',
          whiteSpace: 'pre-wrap',
        }}
      >
        {logs.map((log, i) => (
          <div key={i}>{log}</div>
        ))}
      </div>}
    </div>
  );
}

export default PerformanceBenchmark;

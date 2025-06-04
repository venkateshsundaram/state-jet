import React from "react";
import ZustandPerformaceBenchmark from "./ZustandStore";
import StateJetPerformaceBenchmark from "./StateJetStore";

export default function App() {
  return (
    <div>
      <h1>State Management Test</h1>
      <StateJetPerformaceBenchmark />
      <ZustandPerformaceBenchmark />
    </div>
  );
}

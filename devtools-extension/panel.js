import Chart from "./libs/chart.js";

let history = {};
let perfData = {};
let logs = [];

let port = chrome.runtime.connect({ name: "state-jet" });

port.postMessage({ type: "INIT" });

port.onMessage.addListener((message) => {
  switch (message.type) {
    case "STATE_UPDATE":
      logs.push(message.payload);
      updateLogs();
      history = message.payload;
      updateStateChart();
      break;
    case "UNDO":
    case "REDO":
      updateUI();
      break;
    case "PERFORMANCE_UPDATE":
      perfData = message.payload;
      updatePerformanceChart();
    default:
      break;
  }
});

const updateLogs = () => {
  const logContainer = document.getElementById("logs");
  logContainer.innerHTML = logs
    .map((log) => `<li>${log.key}: ${JSON.stringify(log.value)}</li>`)
    .join("");
};

const updateUI = () => {
  document.getElementById("state").textContent = JSON.stringify(history, null, 2);
};

const stateCtx = document.getElementById("stateChart").getContext("2d");
const stateChart = new Chart(stateCtx, {
  type: "line",
  data: {
    labels: [],
    datasets: [{ label: "State Changes", data: [] }],
  },
});

const perfCtx = document.getElementById("perfChart").getContext("2d");
const perfChart = new Chart(perfCtx, {
  type: "bar",
  data: {
    labels: [],
    datasets: [{ label: "Render Time (ms)", data: [] }],
  },
});

const updatePerformanceChart = () => {
  perfChart.data.labels = Object.keys(perfData);
  perfChart.data.datasets[0].data = Object.values(perfData);
  perfChart.update();
};

const updateStateChart = () => {
  stateChart.data.labels = logs.map((log) => new Date(log.timestamp).toLocaleTimeString());
  stateChart.data.datasets[0].data = logs.map((log) => log.value);
  stateChart.update();
};

document.getElementById("search").addEventListener("input", (event) => {
  const query = event.target.value.toLowerCase();
  const filteredState = Object.fromEntries(
    Object.entries(history).filter(([key]) => key.toLowerCase().includes(query)),
  );
  document.getElementById("state").textContent = JSON.stringify(filteredState, null, 2);
});

let currentIndex = {};

document.getElementById("prev").addEventListener("click", () => {
  Object.keys(history).forEach((key) => {
    if (currentIndex[key] > 0) {
      currentIndex[key]--;
      updateStateFromHistory(key);
    }
  });
});

document.getElementById("next").addEventListener("click", () => {
  Object.keys(history).forEach((key) => {
    if (currentIndex[key] < history[key].length - 1) {
      currentIndex[key]++;
      updateStateFromHistory(key);
    }
  });
});

document.getElementById("undo").addEventListener("click", () => {
  port.postMessage({ type: "UNDO" });
});

document.getElementById("redo").addEventListener("click", () => {
  port.postMessage({ type: "REDO" });
});

const updateStateFromHistory = (key) => {
  port.postMessage({
    type: "TIME_TRAVEL",
    key,
    value: history[key][currentIndex[key]],
  });
};

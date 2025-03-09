chrome.runtime.onConnect.addListener((port) => {
  if (port.name === "state-jet") {
    port.onMessage.addListener((message) => {
      if (message.type === "INIT") {
        chrome.tabs.executeScript({ file: "inject.js" });
      }
    });
  }
});

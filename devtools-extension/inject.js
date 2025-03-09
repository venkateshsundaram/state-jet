(function () {
  window.__STATE_JET_DEVTOOLS__ = {
    updateState: (key, value) => {
      chrome.runtime.sendMessage({
        type: "STATE_UPDATE",
        payload: { [key]: value },
      });
    },
  };
})();

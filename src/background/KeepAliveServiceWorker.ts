let lifeline: chrome.runtime.Port | null;

chrome.runtime.onConnect.addListener((port) => {
  if (port.name === "keepAlive") {
    lifeline = port;
    setTimeout(keepAliveForced, 60000);
    port.onDisconnect.addListener(keepAliveForced);
  }
});

function keepAliveForced() {
  lifeline?.disconnect();
  lifeline = null;
  keepAlive();
}

const keepAlive = async () => {
  if (lifeline) return;
  chrome.runtime.connect({ name: "keepAlive" });
};

export default keepAlive;

import React from "react";
import "../styles/globals.css";

const Options: React.FC = () => {
  const onStartBreak = async () => {
    await chrome.runtime.sendMessage("resumeTimer", () => {});
    let queryOptions = { active: true, lastFocusedWindow: true };
    await chrome.tabs.query(queryOptions).then(([tab]) => {
      if (tab.id) {
        chrome.tabs.remove(tab.id);
      }
    });
  };

  const getCurrentTabId = async () => {
    let queryOptions = { active: true, lastFocusedWindow: true };
    let [tab] = await chrome.tabs.query(queryOptions);
    return tab.id;
  };

  return (
    <div className="text-zinc-100 p-20">
      <div className="text-center">
        <h1 className="text-5xl">Finish</h1>
      </div>
      <div className="flex justify-center mt-5">
        <button
          onClick={onStartBreak}
          className="text-3xl flex border-4 border-gray-200 p-5 rounded-full hover:border-gray-300"
        >
          Start a Break
        </button>
      </div>
    </div>
  );
};

export default Options;

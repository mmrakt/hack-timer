import { useState, useEffect } from "react";
import History from "./History";
import {
  Phase,
  PageType,
  StorageValue,
  FromServiceWorkerMessge,
} from "../types/index";
import ChartIcon from "../components/svg/Chart";
import PauseIcon from "../components/svg/Pause";
import PlayIcon from "../components/svg/Play";
import Digit from "../components/Degit";
import "../styles/globals.css";
import Time from "../utils/Time";

type IProps = {
  reminingSeconds: number;
  isRunning: boolean;
};

const Timer: React.FC<IProps> = (props) => {
  const [isDisplayPage, setIsDisplayPage] = useState<PageType>("timer");
  const [seconds, setSeconds] = useState<number>(props.reminingSeconds);
  const [isRunning, setIsRunning] = useState<boolean>(props.isRunning);
  const { seconds: displaySeconds, minutes: displayMinutes } =
    Time.getTimeFromSeconds(seconds);

  const onDisplayHistory = () => {
    setIsDisplayPage("history");
  };

  const onDisplayTimer = () => {
    setIsDisplayPage("timer");
  };

  useEffect(() => {
    chrome.runtime.onMessage.addListener(
      ({
        message,
        secs,
        toggledTimerStatus,
      }: {
        message: FromServiceWorkerMessge;
        secs: number;
        toggledTimerStatus: boolean;
      }) => {
        if (message === "countDown") {
          setSeconds(secs);
        } else if (message === "finish") {
          setSeconds(secs);
          setIsRunning(false);
        } else if (message === "toggleTimerStatus") {
          setIsRunning(toggledTimerStatus);
        }
      }
    );
  }, []);

  const finish = () => {
    chrome.runtime.sendMessage("finish", async () => {});
  };
  const pause = () => {
    chrome.runtime.sendMessage("toggleTimerStatus", async () => {
      setIsRunning(false);
    });
  };
  const resume = () => {
    chrome.runtime.sendMessage("toggleTimerStatus", async () => {
      setIsRunning(true);
    });
  };

  switch (isDisplayPage) {
    case "timer":
      return (
        <div className="w-48 m-6">
          <div className="flex gap-3">
            <button
              className="text-lg border-2 border-gray-200 px-2 py-1 rounded-md  hover:border-gray-300 hover:text-gray-300"
              onClick={finish}
            >
              Finish
            </button>
            <button className="ml-auto" onClick={onDisplayHistory}>
              <ChartIcon />
            </button>
          </div>
          <div className="mt-3 text-6xl w-36 mx-auto">
            <Digit value={displayMinutes} />:
            <Digit value={displaySeconds} />
          </div>
          <div className="flex justify-center mt-3">
            {isRunning ? (
              <button onClick={pause}>
                <PauseIcon />
              </button>
            ) : (
              <button onClick={resume}>
                <PlayIcon />
              </button>
            )}
          </div>
        </div>
      );
    case "history":
      return <History handleDisplayTimer={onDisplayTimer} />;
    case "setting":
      return <>setting</>;
  }
};

const Popup: React.FC = () => {
  const [reminingSeconds, setReminingSeconds] = useState<number | null>(null);
  const [isRunning, setIsRunning] = useState<boolean>(false);

  useEffect(() => {
    chrome.runtime.sendMessage("mounted", async (result: StorageValue) => {
      setReminingSeconds(result.reminingSeconds);
      setIsRunning(result.isRunning);
    });
  }, []);

  if (!reminingSeconds) return <div>...loading</div>;

  return (
    <div className="bg-zinc-900 border-2 border-gray-700 text-zinc-100">
      <Timer reminingSeconds={reminingSeconds} isRunning={isRunning} />
    </div>
  );
};

export default Popup;

import { useState, useEffect } from "react";
import History from "./features/history/index";
import { Phase, PageType, StorageValue } from "./types/index";
import ChartIcon from "./components/svg/Chart";
import PauseIcon from "./components/svg/Pause";
import PlayIcon from "./components/svg/Play";
import Digit from "./components/Degit";
import "./styles/globals.css";
import Time from "./utils/Time";

type IProps = {
  reminingSeconds: number;
  phase: Phase;
  isRunning: boolean;
  onRestartNextPhase: (
    restart: (newExpiryTimestamp: Date, autoStart?: boolean | undefined) => void
  ) => void;
};

const Timer: React.FC<IProps> = (props) => {
  const [isDisplayPage, setIsDisplayPage] = useState<PageType>("timer");
  const [seconds, setSeconds] = useState<number>(props.reminingSeconds);
  const [isRunning, setIsRunning] = useState<boolean>(props.isRunning);
  const [phase, setPhase] = useState<Phase>(props.phase);
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
      ({ message, secs }: { message: string; secs: number; phase: Phase }) => {
        setSeconds(secs);
        if (message === "finish") {
          setSeconds(secs);
          setPhase(phase);
          setIsRunning(false);
        }
      }
    );
    // const text = minutes + ":" + seconds;
    // const color = phase === "focus" ? "#bb0000" : "#11aa11";
    // await chrome.browserAction.setBadgeText({ text });
    // await chrome.browserAction.setBadgeBackgroundColor({ color });
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
        <div className="text-center">
          <div className="flex justify-end gap-3">
            <button onClick={finish}>Finish focus</button>
            <button onClick={onDisplayHistory}>
              <ChartIcon />
            </button>
          </div>
          <div className="text-8xl">
            <Digit value={displayMinutes} />:
            <Digit value={displaySeconds} />
          </div>
          <div className="flex justify-center mt-5">
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

const App: React.FC = () => {
  const [reminingSeconds, setReminingSeconds] = useState<number | null>(null);
  const [currentPhase, setCurrentPhase] = useState<Phase>("focus");
  const [pomodoros, setPomorodos] = useState<number>(0);
  const [isRunning, setIsRunning] = useState<boolean>(false);

  useEffect(() => {
    chrome.runtime.sendMessage("mounted", async (result: StorageValue) => {
      setReminingSeconds(result.reminingSeconds);
      setCurrentPhase(result.phase);
      setPomorodos(result.pomodoros);
      setIsRunning(result.isRunning);
    });
  }, []);

  const handleRestartNextPhase = async (
    restart: (newExpiryTimestamp: Date, autoStart?: boolean | undefined) => void
  ) => {
    // let nextPhase: Phase = "focus";
    // if (currentPhase === "focus") {
    //   setFocusCount(focusCount + 1);
    //   if (focusCount + 1 === 4) {
    //     setCurrentPhase("longBreak");
    //     nextPhase = "longBreak";
    //   } else {
    //     setCurrentPhase("shortBreak");
    //     nextPhase = "shortBreak";
    //   }
    // }
    // if (currentPhase === "shortBreak") {
    //   setCurrentPhase("focus");
    //   nextPhase = "focus";
    // }
    // if (currentPhase === "longBreak") {
    //   setFocusCount(0);
    //   setCurrentPhase("focus");
    //   nextPhase = "focus";
    // }
    // restart(createExpire(nextPhase));
  };

  if (!reminingSeconds) return <div>...loading</div>;

  return (
    <div className="p-6">
      <Timer
        reminingSeconds={reminingSeconds}
        phase={currentPhase}
        isRunning={isRunning}
      />
    </div>
  );
};

export default App;

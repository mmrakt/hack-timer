import { useState, useEffect } from "react";
import { useTimer } from "react-timer-hook";
import History from "./features/history/index";
import { Phase, PageType } from "./types/index";
import ChartIcon from "./components/svg/Chart";
import PauseIcon from "./components/svg/Pause";
import PlayIcon from "./components/svg/Play";
import Digit from "./components/Degit";
import "./styles/globals.css";

type IProps = {
  expiryTimestamp: Date;
  phase: Phase;
  onRestartNextPhase: (
    restart: (newExpiryTimestamp: Date, autoStart?: boolean | undefined) => void
  ) => void;
};

const Timer: React.FC<IProps> = ({
  expiryTimestamp,
  phase,
  onRestartNextPhase,
}) => {
  const [isDisplayPage, setIsDisplayPage] = useState<PageType>("timer");
  const { seconds, minutes, isRunning, start, pause, resume, restart } =
    useTimer({
      expiryTimestamp,
      onExpire: async () => {
        await onRestartNextPhase(restart);
      },
    });
  const onDisplayHistory = () => {
    setIsDisplayPage("history");
  };

  const onDisplayTimer = () => {
    setIsDisplayPage("timer");
  };

  useEffect(() => {
    async () => {
      const text = minutes + ":" + seconds;
      const color = phase === "focus" ? "#bb0000" : "#11aa11";
      await chrome.browserAction.setBadgeText({ text });
      await chrome.browserAction.setBadgeBackgroundColor({ color });
    };
  }, [minutes, seconds, phase]);

  switch (isDisplayPage) {
    case "timer":
      return (
        <div className="text-center">
          <div className="flex justify-end gap-3">
            <button onClick={() => onRestartNextPhase(restart)}>
              Finish focus
            </button>
            <button onClick={onDisplayHistory}>
              <ChartIcon />
            </button>
          </div>
          <div className="text-8xl">
            <Digit value={minutes} />:
            <Digit value={seconds} />
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
  const [currentPhase, setCurrentPhase] = useState<Phase>("focus");
  const [focusCount, setFocusCount] = useState<number>(0);
  const createExpire = (phase: Phase) => {
    const date = new Date();
    const expireSeconds =
      phase === "focus" ? 1500 : phase === "shortBreak" ? 300 : 1800;
    date.setSeconds(date.getSeconds() + expireSeconds);
    return date;
  };
  const expire = createExpire(currentPhase);

  const handleRestartNextPhase = async (
    restart: (newExpiryTimestamp: Date, autoStart?: boolean | undefined) => void
  ) => {
    let nextPhase: Phase = "focus";
    if (currentPhase === "focus") {
      setFocusCount(focusCount + 1);

      if (focusCount + 1 === 4) {
        setCurrentPhase("longBreak");
        nextPhase = "longBreak";
      } else {
        setCurrentPhase("shortBreak");
        nextPhase = "shortBreak";
      }
    }

    if (currentPhase === "shortBreak") {
      setCurrentPhase("focus");
      nextPhase = "focus";
    }
    if (currentPhase === "longBreak") {
      setFocusCount(0);
      setCurrentPhase("focus");
      nextPhase = "focus";
    }

    restart(createExpire(nextPhase));
  };
  return (
    <div className="p-6">
      <Timer
        expiryTimestamp={expire}
        phase={currentPhase}
        onRestartNextPhase={handleRestartNextPhase}
      />
    </div>
  );
};

export default App;

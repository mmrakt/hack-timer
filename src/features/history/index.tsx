import { useState, useEffect } from "react";
import ArrowLeft from "../../components/svg/ArrowLeft";
import {
  StorageValue,
  DailyFocusedCount,
  DisplayTerm,
} from "../../types/index";
import { LineChart, Line, CartesianGrid, XAxis, YAxis } from "recharts";
import LoadingSpinner from "../../components/LoadingSpinner";
import { testDate } from "../../testDate";

type IProps = {
  handleDisplayTimer: () => void;
};
const History: React.FC<IProps> = ({ handleDisplayTimer }) => {
  const [dailyFocusedCounts, setDailyFocusedCounts] = useState<
    DailyFocusedCount[]
  >([]);
  const [displayTerm, setDisplayTerm] = useState<DisplayTerm>("week");
  const terms: DisplayTerm[] = ["week", "month", "year"];

  useEffect(() => {
    chrome.runtime.sendMessage(
      "displayHistory",
      ({
        dailyFocusedCounts: value,
      }: {
        dailyFocusedCounts: DailyFocusedCount[];
      }) => {
        setDailyFocusedCounts(value);
      }
    );
  }, []);

  return (
    <>
      <div className="flex display-start">
        <ArrowLeft handleClick={handleDisplayTimer} />
      </div>
      <div className="flex bg-zinc-800 border-zinc-600 border-[1px] rounded-lg p-2">
        {terms.map((term) => (
          <button className={`${displayTerm === term ? "bg-zinc-700" : ""} `}>
            {term === "week"
              ? "Weekly"
              : term === "month"
              ? "Monthly"
              : "Yearly"}
          </button>
        ))}
      </div>
      {!dailyFocusedCounts.length ? (
        <LoadingSpinner />
      ) : (
        <div className="mt-5 mx-auto">
          <LineChart width={300} height={200} data={testDate}>
            <Line type="monotone" dataKey="count" stroke="#8884d8" />
            <CartesianGrid stroke="#ccc" />
            <XAxis dataKey="date" />
            <YAxis />
          </LineChart>
        </div>
      )}
    </>
  );
};

export default History;

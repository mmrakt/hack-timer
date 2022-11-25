import { useState, useEffect } from "react";
import ArrowLeft from "../../components/svg/ArrowLeft";
import { DisplayTerm, DailyFocusedCount, DataSet } from "../../types/index";
import {
  LineChart,
  Line,
  CartesianGrid,
  XAxis,
  YAxis,
  Tooltip,
} from "recharts";
import LoadingSpinner from "../../components/LoadingSpinner";
import { testData } from "../../testDate";
import dayjs from "dayjs";

type IProps = {
  handleDisplayTimer: () => void;
};
const History: React.FC<IProps> = ({ handleDisplayTimer }) => {
  const [displayData, setDisplayData] = useState<DataSet>([]);
  const [displayTerm, setDisplayTerm] = useState<DisplayTerm>("week");
  const terms: DisplayTerm[] = ["week", "month", "year"];

  useEffect(() => {
    const testValue = testData;
    chrome.runtime.sendMessage(
      "displayHistory",
      ({
        dailyFocusedCounts: value,
      }: {
        dailyFocusedCounts: DailyFocusedCount[];
      }) => {
        if (displayTerm === "week") {
          const paddedDays = paddingUnfocusedDaysOfWeek(testValue);
          setDisplayData(paddedDays);
        } else if (displayTerm === "month") {
          const paddedDays = paddingUnfocusedDaysOfMonth(testValue);
          setDisplayData(paddedDays);
        } else {
          const paddedMonths = paddingUnfocusedMonths(testValue);
          setDisplayData(paddedMonths);
        }
      }
    );
  }, [displayTerm]);

  const paddingUnfocusedMonths = (
    dailyFocusedCounts: DailyFocusedCount[]
  ): DataSet => {
    const paddedMonths: DataSet = [];
    const numberMonthsOfYear = 12;
    const today = dayjs();
    const month = today.month() + 1;
    const daysOfThisYear = dailyFocusedCounts.filter(
      (obj) => obj.year === today.year()
    );
    let monthlyTotalFocused: DailyFocusedCount[] = [];
    monthlyTotalFocused = daysOfThisYear.reduce((result, current) => {
      const element = result.find((p) => p.month === current.month);
      if (element) {
        element.count += current.count;
      } else {
        result.push({
          year: current.year,
          month: current.month,
          day: current.day,
          count: current.count,
        });
      }
      return result;
    }, monthlyTotalFocused);

    const focusedMonths = monthlyTotalFocused.map((obj) => {
      return obj.month;
    });

    for (let i = 1; i <= numberMonthsOfYear; i++) {
      if (i <= month) {
        const index = focusedMonths.indexOf(i);
        if (index !== -1) {
          paddedMonths.push({
            name: monthlyTotalFocused[index].month,
            count: monthlyTotalFocused[index].count,
          });
          continue;
        }
      }
      paddedMonths.push({
        name: i,
        count: 0,
      });
    }
    return paddedMonths;
  };

  const paddingUnfocusedDaysOfWeek = (
    dailyFocusedCounts: DailyFocusedCount[]
  ): DataSet => {
    const paddedDays: DataSet = [];
    const numberDaysOfWeek = 7;
    const today = dayjs();
    const lastMonth = dailyFocusedCounts.filter(
      (obj) => obj.year === today.year() && obj.month === today.month() + 1
    );
    const lastDaysOfMonth = lastMonth.map((obj) => {
      return obj.day;
    });
    const day = today.day();
    for (let i = 1; i <= numberDaysOfWeek; i++) {
      const targetDate = today.subtract(day - i, "d").date();
      if (i <= day) {
        const index = lastDaysOfMonth.indexOf(targetDate);
        if (index !== -1) {
          paddedDays.push({
            name: lastMonth[index].day,
            count: lastMonth[index].count,
          });
          continue;
        }
      }
      paddedDays.push({
        name: today.add(i - day, "day").date(),
        count: 0,
      });
    }
    return paddedDays;
  };

  const paddingUnfocusedDaysOfMonth = (
    dailyFocusedCounts: DailyFocusedCount[]
  ): DataSet => {
    const paddedDays: DataSet = [];
    const today = dayjs();
    const endOfDate = today.endOf("month").date();
    const lastMonth = dailyFocusedCounts.filter(
      (obj) => obj.year === today.year() && obj.month === today.month() + 1
    );
    const lastDaysOfMonth = lastMonth.map((obj) => {
      return obj.day;
    });

    for (let i = 1; i <= endOfDate; i++) {
      if (i <= today.date()) {
        const index = lastDaysOfMonth.indexOf(i);
        if (index !== -1) {
          paddedDays.push({
            name: lastMonth[index].day,
            count: lastMonth[index].count,
          });
          continue;
        }
      }
      paddedDays.push({
        name: i,
        count: 0,
      });
    }
    return paddedDays;
  };

  return (
    <>
      <div className="flex display-start mt-3 mx-3">
        <ArrowLeft handleClick={handleDisplayTimer} />
      </div>
      <div className="mt-3 w-5/6 mx-auto flex bg-zinc-800 border-zinc-600 border-[1px] rounded-lg p-1">
        {terms.map((term) => (
          <button
            className={`${
              displayTerm === term ? "bg-zinc-700" : ""
            } px-2 py-1 rounded-md flex-grow`}
            onClick={() => {
              setDisplayTerm(term);
            }}
          >
            {term === "week"
              ? "Weekly"
              : term === "month"
              ? "Monthly"
              : "Yearly"}
          </button>
        ))}
      </div>
      {!displayData.length ? (
        <LoadingSpinner />
      ) : (
        <div className="my-5">
          <LineChart
            width={300}
            height={200}
            data={displayData}
            margin={{ top: 0, left: 0, bottom: 0, right: 40 }}
          >
            <Line
              type="monotone"
              dataKey="count"
              stroke="#8884d8"
              dot={false}
              activeDot={{ strokeWidth: 1 }}
              isAnimationActive={false}
            />
            <CartesianGrid stroke="#ccc" strokeDasharray="1 1" />
            <XAxis dataKey="name" />
            <YAxis />
            <Tooltip />
          </LineChart>
        </div>
      )}
    </>
  );
};

export default History;

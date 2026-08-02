import CalendarHeatmap from "react-calendar-heatmap";
import "react-calendar-heatmap/dist/styles.css";

import { Tooltip } from "react-tooltip";
import "react-tooltip/dist/react-tooltip.css";

function HabitHeatmap({ data }) {
  return (
    <div className="
      mt-8
      rounded-3xl
      bg-white
      dark:bg-gray-900
      border
      border-gray-200
      dark:border-gray-700
      shadow-lg
      p-6
      transition-all
      duration-300
    ">

      {/* Header */}

      <div className="flex items-center justify-between mb-6">

        <div>

          <h2 className="text-2xl font-bold text-gray-800 dark:text-white">
            🔥 Habit Activity
          </h2>

          <p className="text-gray-500 dark:text-gray-400 mt-1 text-sm">
            Your consistency over the last 12 months.
          </p>

        </div>

      </div>

      {/* Heatmap */}

      <div className="overflow-x-auto">

        <CalendarHeatmap
          startDate={
            new Date(
              new Date().setFullYear(
                new Date().getFullYear() - 1
              )
            )
          }

          endDate={new Date()}

          values={data}

          showWeekdayLabels={true}

          classForValue={(value) => {

            if (!value) return "color-empty";

            if (value.count >= 8) return "color-github-4";

            if (value.count >= 5) return "color-github-3";

            if (value.count >= 2) return "color-github-2";

            return "color-github-1";

          }}

          tooltipDataAttrs={(value) => {

            if (!value || !value.date) {

              return {

                "data-tooltip-id": "heatmap-tooltip",

                "data-tooltip-content": "No activity",

              };

            }

            return {

              "data-tooltip-id": "heatmap-tooltip",

              "data-tooltip-content":
                `${value.date}
• ${value.count} habit${value.count !== 1 ? "s" : ""} completed`,

            };

          }}

        />

      </div>

      <Tooltip
        id="heatmap-tooltip"
        className="!rounded-xl !text-sm !px-3 !py-2"
      />

      {/* Legend */}

      <div className="
        flex
        items-center
        justify-end
        gap-2
        mt-8
        text-sm
        text-gray-500
        dark:text-gray-400
      ">

        <span>Less</span>

        <div className="w-4 h-4 rounded bg-gray-300 dark:bg-gray-700"></div>

        <div className="w-4 h-4 rounded bg-green-200"></div>

        <div className="w-4 h-4 rounded bg-green-400"></div>

        <div className="w-4 h-4 rounded bg-green-600"></div>

        <div className="w-4 h-4 rounded bg-green-800"></div>

        <span>More</span>

      </div>

    </div>
  );
}

export default HabitHeatmap;
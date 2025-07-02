import React, { ReactNode, useMemo } from "react";
import { Task } from "../../types/public-types";
import { addToDate } from "../../helpers/date-helper";
import styles from "./grid.module.css";

export type GridBodyProps = {
  tasks: Task[];
  dates: Date[];
  svgWidth: number;
  rowHeight: number;
  columnWidth: number;
  todayColor: string;
  rtl: boolean;
};

export const GridBody: React.FC<GridBodyProps> = React.memo(
  ({ tasks, dates, rowHeight, svgWidth, columnWidth, todayColor, rtl }) => {
    const now = useMemo(() => new Date(), []);

    const totalHeight = tasks.length * rowHeight;

    const { gridRows, rowLines } = useMemo(() => {
      const rows: ReactNode[] = [];
      const lines: ReactNode[] = [
        <line
          key="RowLineFirst"
          x1={0}
          y1={0}
          x2={svgWidth}
          y2={0}
          className={styles.gridRowLine}
        />,
      ];

      let y = 0;
      for (const task of tasks) {
        rows.push(
          <rect
            key={`Row-${task.id}`}
            x={0}
            y={y}
            width={svgWidth}
            height={rowHeight}
            className={styles.gridRow}
          />
        );
        lines.push(
          <line
            key={`RowLine-${task.id}`}
            x1={0}
            y1={y + rowHeight}
            x2={svgWidth}
            y2={y + rowHeight}
            className={styles.gridRowLine}
          />
        );
        y += rowHeight;
      }

      return { gridRows: rows, rowLines: lines };
    }, [tasks, svgWidth, rowHeight]);

    const { ticks, todayMarker } = useMemo(() => {
      const ticks: ReactNode[] = [];
      let tickX = 0;
      let today: ReactNode = null;

      for (let i = 0; i < dates.length; i++) {
        const date = dates[i];
        const nextDate = dates[i + 1];
        const prevDate = dates[i - 1];
        const currentTime = date.getTime();
        const prevTime = prevDate?.getTime() ?? 0;

        ticks.push(
          <line
            key={`Tick-${currentTime}`}
            x1={tickX}
            y1={0}
            x2={tickX}
            y2={totalHeight}
            className={styles.gridTick}
          />
        );

        const isToday =
          (now >= date && nextDate && now < nextDate) ||
          (i === dates.length - 1 &&
            now >= date &&
            addToDate(date, currentTime - prevTime, "millisecond") > now);

        const isTodayRTL = rtl && nextDate && now <= date && now > nextDate;

        if (isToday || isTodayRTL) {
          today = (
            <rect
              key="today"
              x={rtl ? tickX + columnWidth : tickX}
              y={0}
              width={columnWidth}
              height={totalHeight}
              fill={todayColor}
            />
          );
        }

        tickX += columnWidth;
      }

      return { ticks, todayMarker: today };
    }, [dates, columnWidth, now, totalHeight, rtl, todayColor]);

    return (
      <g className="gridBody">
        <g className="rows">{gridRows}</g>
        <g className="rowLines">{rowLines}</g>
        <g className="ticks">{ticks}</g>
        <g className="today">{todayMarker}</g>
      </g>
    );
  }
);

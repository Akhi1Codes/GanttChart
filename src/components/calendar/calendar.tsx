import React, { ReactChild, useMemo } from "react";
import { ViewMode } from "../../types/public-types";
import { TopPartOfCalendar } from "./top-part-of-calendar";
import {
  getCachedDateTimeFormat,
  getDaysInMonth,
  getLocalDayOfWeek,
  getLocaleMonth,
  getWeekNumberISO8601,
} from "../../helpers/date-helper";
import { DateSetup } from "../../types/date-setup";
import styles from "./calendar.module.css";

export type CalendarProps = {
  dateSetup: DateSetup;
  locale: string;
  viewMode: ViewMode;
  rtl: boolean;
  headerHeight: number;
  columnWidth: number;
  fontFamily: string;
  fontSize: string;
};

const Calendar: React.FC<CalendarProps> = React.memo(
  ({
    dateSetup,
    locale,
    viewMode,
    rtl,
    headerHeight,
    columnWidth,
    fontFamily,
    fontSize,
  }) => {
    const ticks =
      viewMode === ViewMode.HalfDay
        ? 2
        : viewMode === ViewMode.QuarterDay
        ? 4
        : 1;

    const [topValues, bottomValues] = useMemo(() => {
      const top: ReactChild[] = [];
      const bottom: ReactChild[] = [];
      const topHeight = headerHeight * 0.5;
      const dates = dateSetup.dates;

      for (let i = 0; i < dates.length; i++) {
        const date = dates[i];
        const prevDate = dates[i - 1];
        const nextDate = dates[i + 1];

        const xPos = columnWidth * i + columnWidth * 0.5;

        switch (viewMode) {
          case ViewMode.Year: {
            const year = date.getFullYear();
            bottom.push(
              <text
                key={`bottom-${date.getTime()}`}
                y={headerHeight * 0.8}
                x={xPos}
                className={styles.calendarBottomText}
              >
                {year}
              </text>
            );
            if (i === 0 || date.getFullYear() !== prevDate.getFullYear()) {
              const xText = rtl
                ? (6 + i + year + 1) * columnWidth
                : (6 + i - year) * columnWidth;
              top.push(
                <TopPartOfCalendar
                  key={`top-${year}`}
                  value={year.toString()}
                  x1Line={columnWidth * i}
                  y1Line={0}
                  y2Line={headerHeight}
                  xText={xText}
                  yText={topHeight * 0.9}
                />
              );
            }
            break;
          }

          case ViewMode.QuarterYear: {
            const quarter = "Q" + Math.floor((date.getMonth() + 3) / 3);
            bottom.push(
              <text
                key={`bottom-${date.getTime()}`}
                y={headerHeight * 0.8}
                x={xPos}
                className={styles.calendarBottomText}
              >
                {quarter}
              </text>
            );
            if (i === 0 || date.getFullYear() !== prevDate.getFullYear()) {
              const xText = rtl
                ? (6 + i + date.getMonth() + 1) * columnWidth
                : (6 + i - date.getMonth()) * columnWidth;
              top.push(
                <TopPartOfCalendar
                  key={`top-${date.getFullYear()}`}
                  value={date.getFullYear().toString()}
                  x1Line={columnWidth * i}
                  y1Line={0}
                  y2Line={topHeight}
                  xText={Math.abs(xText)}
                  yText={topHeight * 0.9}
                />
              );
            }
            break;
          }

          case ViewMode.Month: {
            const monthLabel = getLocaleMonth(date, locale);
            bottom.push(
              <text
                key={`bottom-${date.getTime()}`}
                y={headerHeight * 0.8}
                x={xPos}
                className={styles.calendarBottomText}
              >
                {monthLabel}
              </text>
            );
            if (i === 0 || date.getFullYear() !== prevDate.getFullYear()) {
              const xText = rtl
                ? (6 + i + date.getMonth() + 1) * columnWidth
                : (6 + i - date.getMonth()) * columnWidth;
              top.push(
                <TopPartOfCalendar
                  key={`top-${date.getFullYear()}`}
                  value={date.getFullYear().toString()}
                  x1Line={columnWidth * i}
                  y1Line={0}
                  y2Line={topHeight}
                  xText={xText}
                  yText={topHeight * 0.9}
                />
              );
            }
            break;
          }

          case ViewMode.Week: {
            const week = `W${getWeekNumberISO8601(date)}`;
            bottom.push(
              <text
                key={`bottom-${date.getTime()}`}
                y={headerHeight * 0.8}
                x={columnWidth * (i + +rtl)}
                className={styles.calendarBottomText}
              >
                {week}
              </text>
            );
            if (i === 0 || date.getMonth() !== prevDate.getMonth()) {
              const label = `${getLocaleMonth(
                date,
                locale
              )}, ${date.getFullYear()}`;
              top.push(
                <TopPartOfCalendar
                  key={`top-${label}`}
                  value={label}
                  x1Line={columnWidth * i}
                  y1Line={0}
                  y2Line={topHeight}
                  xText={columnWidth * i + columnWidth * 0.5}
                  yText={topHeight * 0.9}
                />
              );
            }
            break;
          }

          case ViewMode.Day: {
            const dayLabel = `${getLocalDayOfWeek(
              date,
              locale,
              "short"
            )}, ${date.getDate()}`;
            bottom.push(
              <text
                key={`bottom-${date.getTime()}`}
                y={headerHeight * 0.8}
                x={xPos}
                className={styles.calendarBottomText}
              >
                {dayLabel}
              </text>
            );
            if (nextDate && date.getMonth() !== nextDate.getMonth()) {
              const topLabel = getLocaleMonth(date, locale);
              top.push(
                <TopPartOfCalendar
                  key={`top-${topLabel}${date.getFullYear()}`}
                  value={topLabel}
                  x1Line={columnWidth * (i + 1)}
                  y1Line={0}
                  y2Line={topHeight}
                  xText={
                    columnWidth * (i + 1) -
                    getDaysInMonth(date.getMonth(), date.getFullYear()) *
                      columnWidth *
                      0.5
                  }
                  yText={topHeight * 0.9}
                />
              );
            }
            break;
          }

          case ViewMode.HalfDay:
          case ViewMode.QuarterDay:
          case ViewMode.Hour: {
            const hourLabel = getCachedDateTimeFormat(locale, {
              hour: "numeric",
            }).format(date);
            bottom.push(
              <text
                key={`bottom-${date.getTime()}`}
                y={headerHeight * 0.8}
                x={columnWidth * (i + +rtl)}
                className={styles.calendarBottomText}
                fontFamily={fontFamily}
              >
                {hourLabel}
              </text>
            );
            if (i === 0 || date.getDate() !== prevDate?.getDate()) {
              const displayDate = date;
              const topLabel = `${getLocalDayOfWeek(
                displayDate,
                locale,
                "short"
              )}, ${displayDate.getDate()} ${getLocaleMonth(
                displayDate,
                locale
              )}`;
              top.push(
                <TopPartOfCalendar
                  key={`top-${topLabel}${displayDate.getFullYear()}`}
                  value={topLabel}
                  x1Line={columnWidth * i + ticks * columnWidth}
                  y1Line={0}
                  y2Line={topHeight}
                  xText={columnWidth * i + ticks * columnWidth * 0.5}
                  yText={topHeight * 0.9}
                />
              );
            }
            break;
          }
        }
      }

      return [top, bottom];
    }, [
      dateSetup.dates,
      viewMode,
      columnWidth,
      headerHeight,
      locale,
      fontFamily,
      rtl,
      ticks,
    ]);

    return (
      <g className="calendar" fontSize={fontSize} fontFamily={fontFamily}>
        <rect
          x={0}
          y={0}
          width={columnWidth * dateSetup.dates.length}
          height={headerHeight}
          className={styles.calendarHeader}
        />
        {bottomValues}
        {topValues}
      </g>
    );
  }
);

export { Calendar };

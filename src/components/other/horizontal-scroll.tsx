import React, { SyntheticEvent, useRef, useLayoutEffect } from "react";
import styles from "./horizontal-scroll.module.css";

export const HorizontalScroll: React.FC<{
  scroll: number;
  svgWidth: number;
  taskListWidth: number;
  rtl: boolean;
  onScroll: (event: SyntheticEvent<HTMLDivElement>) => void;
}> = ({ scroll, svgWidth, taskListWidth, rtl, onScroll }) => {
  const scrollRef = useRef<HTMLDivElement>(null);

  // Use layout effect to prevent visible scroll jumps
  useLayoutEffect(() => {
    const el = scrollRef.current;
    if (el && el.scrollLeft !== scroll) {
      el.scrollLeft = scroll;
    }
  }, [scroll]);

  return (
    <div
      dir="ltr"
      ref={scrollRef}
      onScroll={onScroll}
      className={styles.scrollWrapper}
      style={{
        margin: rtl
          ? `0px ${taskListWidth}px 0px 0px`
          : `0px 0px 0px ${taskListWidth}px`,
      }}
    >
      <div className={styles.scroll} style={{ width: svgWidth }} />
    </div>
  );
};

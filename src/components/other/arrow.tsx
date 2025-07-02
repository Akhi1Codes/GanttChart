import React, { useMemo } from "react";
import { BarTask } from "../../types/bar-task";

type ArrowProps = {
  taskFrom: BarTask;
  taskTo: BarTask;
  rowHeight: number;
  taskHeight: number;
  arrowIndent: number;
  rtl: boolean;
};

export const Arrow: React.FC<ArrowProps> = ({
  taskFrom,
  taskTo,
  rowHeight,
  taskHeight,
  arrowIndent,
  rtl,
}) => {
  const [path, trianglePoints] = useMemo(() => {
    return rtl
      ? drownPathAndTriangleRTL(
          taskFrom,
          taskTo,
          rowHeight,
          taskHeight,
          arrowIndent
        )
      : drownPathAndTriangle(
          taskFrom,
          taskTo,
          rowHeight,
          taskHeight,
          arrowIndent
        );
  }, [taskFrom, taskTo, rowHeight, taskHeight, arrowIndent, rtl]);

  return (
    <g className="arrow">
      <path strokeWidth="1.5" d={path} fill="none" />
      <polygon points={trianglePoints} />
    </g>
  );
};

const drownPathAndTriangle = (
  taskFrom: BarTask,
  taskTo: BarTask,
  rowHeight: number,
  taskHeight: number,
  arrowIndent: number
): [string, string] => {
  const indexCompare = taskFrom.index > taskTo.index ? -1 : 1;
  const toY = taskTo.y + taskHeight / 2;
  const fromEndX = taskFrom.x2 + arrowIndent * 2;
  const horizLine = fromEndX < taskTo.x1 ? "" : `H ${taskTo.x1 - arrowIndent}`;
  const finalHoriz =
    fromEndX > taskTo.x1 ? arrowIndent : taskTo.x1 - taskFrom.x2 - arrowIndent;

  const path = `M ${taskFrom.x2} ${taskFrom.y + taskHeight / 2}
    h ${arrowIndent}
    v ${(indexCompare * rowHeight) / 2}
    ${horizLine}
    V ${toY}
    h ${finalHoriz}`;

  const trianglePoints = `${taskTo.x1},${toY}
    ${taskTo.x1 - 5},${toY - 5}
    ${taskTo.x1 - 5},${toY + 5}`;

  return [path.trim(), trianglePoints.trim()];
};

const drownPathAndTriangleRTL = (
  taskFrom: BarTask,
  taskTo: BarTask,
  rowHeight: number,
  taskHeight: number,
  arrowIndent: number
): [string, string] => {
  const indexCompare = taskFrom.index > taskTo.index ? -1 : 1;
  const toY = taskTo.y + taskHeight / 2;
  const fromStartX = taskFrom.x1 - arrowIndent * 2;
  const horizLine =
    fromStartX > taskTo.x2 ? "" : `H ${taskTo.x2 + arrowIndent}`;
  const finalHoriz =
    fromStartX < taskTo.x2
      ? -arrowIndent
      : taskTo.x2 - taskFrom.x1 + arrowIndent;

  const path = `M ${taskFrom.x1} ${taskFrom.y + taskHeight / 2}
    h ${-arrowIndent}
    v ${(indexCompare * rowHeight) / 2}
    ${horizLine}
    V ${toY}
    h ${finalHoriz}`;

  const trianglePoints = `${taskTo.x2},${toY}
    ${taskTo.x2 + 5},${toY + 5}
    ${taskTo.x2 + 5},${toY - 5}`;

  return [path.trim(), trianglePoints.trim()];
};

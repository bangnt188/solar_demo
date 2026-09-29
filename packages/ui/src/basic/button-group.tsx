import { forwardRef, type HTMLAttributes } from "react";
import styles from "./button-group.module.css";

export type ButtonGroupProps = Omit<HTMLAttributes<HTMLDivElement>, "aria-label"> & {
  label: string;
  orientation?: "horizontal" | "vertical";
};

export const ButtonGroup = forwardRef<HTMLDivElement, ButtonGroupProps>(function ButtonGroup(
  { label, orientation = "horizontal", className, children, ...props }, ref,
) {
  return (
    <div {...props} ref={ref} role="group" aria-label={label} className={[styles.group, orientation === "vertical" && styles.vertical, className].filter(Boolean).join(" ")}>
      {children}
    </div>
  );
});

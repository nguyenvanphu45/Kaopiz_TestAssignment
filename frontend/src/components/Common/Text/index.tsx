import type { HTMLAttributes, ReactNode } from "react";
import { Typography } from "antd";
import classNames from "classnames";
import "./style.scss";

interface TextProps extends HTMLAttributes<HTMLSpanElement> {
  size?: "large" | "semi-large" | "middle" | "semi-small" | "small";
  weight?: "light" | "middle" | "semi-bold" | "bold";
  color?: "default" | "primary" | "white" | "error";
  isLabel?: boolean;
  className?: string;
  children?: ReactNode;
}

const Text = ({
  size = "middle",
  weight = "middle",
  color = "default",
  isLabel = false,
  className = "",
  children,
  ...rest
}: TextProps) => {
  return (
    <Typography.Text
      className={classNames(
        "component-text",
        `component-text-size-${size}`,
        `component-text-weight-${weight}`,
        `component-text-color-${color}`,
        { "component-text-label": isLabel },
        className
      )}
      {...rest}
    >
      {children}
    </Typography.Text>
  );
};

export default Text;

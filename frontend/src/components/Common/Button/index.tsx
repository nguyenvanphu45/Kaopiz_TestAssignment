import {
  Button as ButtonAntd,
  type ButtonProps as AntdButtonProps,
} from "antd";
import classNames from "classnames";
import "./style.scss";

type ButtonType = "primary" | "secondary" | "error";
type ButtonVariant = "contained" | "outlined" | "danger" | "transparent";

interface ButtonProps
  extends Omit<AntdButtonProps, "type" | "variant" | "danger"> {
  type?: ButtonType;
  variant?: ButtonVariant;
  className?: string;
  children?: React.ReactNode;
}

const Button = ({
  type = "primary",
  variant = "contained",
  className = "",
  children,
  ...rest
}: ButtonProps) => {
  return (
    <ButtonAntd
      className={classNames(
        "component-btn",
        `component-btn-type-${type}`,
        `component-btn-variant-${variant}`,
        className
      )}
      {...rest}
    >
      {children}
    </ButtonAntd>
  );
};

export default Button;

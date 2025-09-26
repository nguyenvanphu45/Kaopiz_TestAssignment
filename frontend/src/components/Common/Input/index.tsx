import { Input as InputAntd } from "antd";
import classNames from "classnames";
import { type InputProps as AntdInputProps } from "antd/es/input";
import "./style.scss";

interface InputProps extends Omit<AntdInputProps, "size"> {
  size?: "large" | "middle";
  error?: boolean;
  className?: string;
}

const Input = ({
  size = "middle",
  error = false,
  className,
  ...rest
}: InputProps) => {
  return (
    <InputAntd
      className={classNames(
        `component-input`,
        `component-input-size-${size}`,
        error ? `component-input-error` : "",
        className
      )}
      {...rest}
    />
  );
};

export default Input;

import { Select as SelectAntd } from "antd";
import { type SelectProps as AntdSelectProps } from "antd/es/select";
import classNames from "classnames";
import "./style.scss";

interface SelectProps extends Omit<AntdSelectProps, "disabled" | "className"> {
  disabled?: boolean;
  error?: boolean;
  className?: string;
}

const Select = ({
  disabled = false,
  error = false,
  className,
  ...rest
}: SelectProps) => {
  return (
    <SelectAntd
      className={classNames(
        "component-select",
        {
          "component-select-disabled": disabled,
          "component-select-error": error,
        },
        className
      )}
      listHeight={240}
      disabled={disabled}
      {...rest}
    />
  );
};

export default Select;

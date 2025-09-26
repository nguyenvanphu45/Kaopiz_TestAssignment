import { Checkbox as CheckboxAntd, type CheckboxChangeEvent } from "antd";
import classNames from "classnames";
import "./style.scss";

interface CheckboxProps {
  className?: string;
  checked?: boolean;
  onChange?: (e: CheckboxChangeEvent) => void;
  disabled?: boolean;
  children?: React.ReactNode;
}

const Checkbox = ({ className, children, ...rest }: CheckboxProps) => {
  return (
    <CheckboxAntd
      className={classNames("component-checkbox", className)}
      {...rest}
    >
      {children}
    </CheckboxAntd>
  );
};

export default Checkbox;

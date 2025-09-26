import { LoadingOutlined } from "@ant-design/icons";
import { Spin } from "antd";
import "./style.scss";

export const LoadingFullPage = () => {
  return (
    <div className="loadingFullPage">
      <Spin
        indicator={<LoadingOutlined spin className="loadingFullPage__icon" />}
      />
    </div>
  );
};

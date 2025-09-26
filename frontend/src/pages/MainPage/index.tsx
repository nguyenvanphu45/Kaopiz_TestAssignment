import React from "react";
import Button from "../../components/Common/Button";
import { useAuth } from "../../hooks/useAuth";

const MainPage = () => {
  const { logout, loading } = useAuth();

  return (
    <div>
      MainPage
      <div>
        <Button
          style={{ width: "200px" }}
          onClick={() => logout()}
          loading={loading}
        >
          Logout
        </Button>
      </div>
    </div>
  );
};

export default MainPage;

import React from "react";
import Button from "../../components/Common/Button";
import { useAuth } from "../../hooks/useAuth";

const AdminPage = () => {
  const { logout, loading } = useAuth();
  return (
    <div>
      AdminPage
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

export default AdminPage;

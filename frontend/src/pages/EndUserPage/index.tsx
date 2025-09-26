import Button from "../../components/Common/Button";
import { useAuth } from "../../hooks/useAuth";

const EndUserPage = () => {
  const { logout, loading } = useAuth();
  return (
    <div>
      EndUserPage
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

export default EndUserPage;

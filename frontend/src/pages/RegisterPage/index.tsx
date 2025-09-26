import { Card, Flex, Form, Layout } from "antd";
import * as yup from "yup";
import { yupResolver } from "@hookform/resolvers/yup";
import { useForm } from "react-hook-form";
import FormItem from "../../components/Common/FromItem";
import Input from "../../components/Common/Input";
import Text from "../../components/Common/Text";
import { Link } from "react-router-dom";
import { useDispatch } from "react-redux";

import "./style.scss";
import { Content } from "antd/es/layout/layout";
import Button from "../../components/Common/Button";
import { useAuth } from "../../hooks/useAuth";
import type { RegisterData } from "../../apis/auth/types";
import Select from "../../components/Common/Select";
import { UserType } from "../../interface/User";
import { resetError } from "../../store/ducks/auth/slice";

const formYup = yup.object().shape({
  username: yup.string().required("Username is required"),
  email: yup
    .string()
    .email("Invalid email format")
    .required("Email is required"),
  password: yup
    .string()
    .min(6, "Password must be at least 6 characters")
    .required("Password is required"),
  userType: yup.number().required("User type is required"),
});

const USER_TYPE_OPTIONS = [
  { value: UserType.PARTNER, label: "Partner" },
  { value: UserType.ADMIN, label: "Admin" },
  { value: UserType.END_USER, label: "End User" },
];

const RegisterPage = () => {
  const dispatch = useDispatch();
  const { register, error, loading } = useAuth();

  const { control, handleSubmit } = useForm<RegisterData>({
    resolver: yupResolver(formYup),
    defaultValues: {
      username: "",
      email: "",
      password: "",
      userType: UserType.PARTNER,
    },
  });

  const onSubmit = (data: RegisterData) => {
    register({
      username: data.username,
      email: data.email,
      password: data.password,
      userType: data.userType,
    });
  };

  return (
    <Layout className="loginPage">
      <Content>
        <Flex justify="center" align="center" className="loginPage__wrapper">
          <Card className="loginPage__wrapper--card">
            <div className="loginPage__wrapper--card-header">
              <Text
                size="large"
                weight="bold"
                color="white"
                style={{
                  letterSpacing: "1px",
                }}
              >
                Register
              </Text>
            </div>

            <Form onFinish={handleSubmit(onSubmit)} layout="vertical">
              <FormItem
                label="Username"
                control={control}
                name="username"
                style={{
                  marginBottom: "8px",
                }}
              >
                <Input placeholder="Username" />
              </FormItem>

              <FormItem
                label="Email"
                control={control}
                name="email"
                style={{
                  marginBottom: "8px",
                }}
              >
                <Input placeholder="Email" />
              </FormItem>

              <FormItem
                type="password"
                label="Password"
                control={control}
                name="password"
              >
                <Input type="password" placeholder="Password" />
              </FormItem>

              <FormItem
                type="userType"
                label="User Type"
                control={control}
                name="userType"
              >
                <Select
                  options={USER_TYPE_OPTIONS}
                  placeholder="Select type user"
                />
              </FormItem>

              {error && <Text color="error">{error}</Text>}

              <Button variant="contained" htmlType="submit" loading={loading}>
                Register
              </Button>
            </Form>
            <div className="loginPage__wrapper--card-footer">
              <Text size="semi-small">
                Already have an account!{" "}
                <Link
                  to="/login"
                  onClick={() => {
                    dispatch(resetError());
                  }}
                >
                  Login
                </Link>
              </Text>
            </div>
          </Card>
        </Flex>
      </Content>
    </Layout>
  );
};

export default RegisterPage;

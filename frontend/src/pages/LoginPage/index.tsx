import { Card, Flex, Form, Layout } from "antd";
import * as yup from "yup";
import { yupResolver } from "@hookform/resolvers/yup";
import { useForm } from "react-hook-form";
import { Link } from "react-router-dom";
import { Content } from "antd/es/layout/layout";
import type { LoginData } from "../../apis/auth/types";

import "./style.scss";
import FormItem from "../../components/Common/FromItem";
import Input from "../../components/Common/Input";
import Text from "../../components/Common/Text";
import Checkbox from "../../components/Common/Checkbox";
import Button from "../../components/Common/Button";
import { useAuth } from "../../hooks/useAuth";
import { useDispatch } from "react-redux";
import { resetError } from "../../store/ducks/auth/slice";

const formYup = yup.object().shape({
  email: yup
    .string()
    .email("Invalid email format")
    .required("Email is required"),
  password: yup
    .string()
    .min(6, "Password must be at least 6 characters")
    .required("Password is required"),
  rememberMe: yup.boolean().default(false),
});

const LoginPage = () => {
  const dispatch = useDispatch();
  const { login, error, loading } = useAuth();

  const { control, handleSubmit } = useForm<LoginData>({
    resolver: yupResolver(formYup),
    defaultValues: {
      email: "",
      password: "",
      rememberMe: false,
    },
  });

  const onSubmit = (data: LoginData) => {
    login({
      email: data.email,
      password: data.password,
      rememberMe: data.rememberMe,
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
                Login
              </Text>
            </div>

            <Form onFinish={handleSubmit(onSubmit)} layout="vertical">
              <FormItem
                label="Email"
                control={control}
                name="email"
                style={{
                  marginBottom: "8px",
                }}
              >
                <Input placeholder="Type your email" />
              </FormItem>

              <FormItem
                type="password"
                label="Password"
                control={control}
                name="password"
              >
                <Input type="password" placeholder="Type your password" />
              </FormItem>

              {error && <Text color="error">{error}</Text>}

              <Flex
                justify="space-between"
                align="center"
                style={{ marginBottom: "28px" }}
              >
                <FormItem control={control} name="rememberMe">
                  <Checkbox>Remember login</Checkbox>
                </FormItem>
                <Link to="/forgot-password">
                  <Text size="semi-small" className="forgotPassword">
                    Forgot password?
                  </Text>
                </Link>
              </Flex>

              <Button variant="contained" htmlType="submit" loading={loading}>
                Login
              </Button>
            </Form>
            <div className="loginPage__wrapper--card-footer">
              <Text size="semi-small">
                Don't have an account?{" "}
                <Link
                  to="/register"
                  onClick={() => {
                    dispatch(resetError());
                  }}
                >
                  Sign up
                </Link>
              </Text>
            </div>
          </Card>
        </Flex>
      </Content>
    </Layout>
  );
};

export default LoginPage;

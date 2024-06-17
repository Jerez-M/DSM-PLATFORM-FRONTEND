import { Button, Form, Input, message } from "antd";
import { UserOutlined, LockOutlined, LoginOutlined } from "@ant-design/icons";
import "./styles.css";
import AuthenticationService from "../../services/authentication.service";
import { useState } from "react";
import PropTypes from "prop-types";
import bg from "../../Assets/images/bg_1.png";
import logo from "../../Assets/images/half_logo.png";
import dioscese from "../../Assets/images/diocese.png";
import langham from "../../Assets/images/Langham.png";
import mellary from "../../Assets/images/Mt Mellary.png";
import pamushana from "../../Assets/images/pamushana.png";
import {toInputUppercase} from "../../common";

export default function Login({ setToken }) {
  const [loading, setLoading] = useState(false);
  const [disabled, setDisabled] = useState(false);

  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");

  const handleLogin = async (e) => {
    e.preventDefault();

    if (password === "" || username === "") {
      message.error("Please enter all the details.");
      return 0;
    }

    setLoading(true);
    setDisabled(true);

    try {
      const response = await AuthenticationService.login({
        username: username,
        password: password,
      });

      if (response?.status === 200) {
        setToken(response?.data);
      }
      window.location.replace('/')
      setDisabled(false);
      setLoading(false);
      return 1;
    } catch (e) {
      console.log(e.response);
      setDisabled(false);
      setLoading(false);
      message.error("Account with given credentials not found.");
      return 0;
    }
  };

  return (
    <div className="container-fluid">
      <div
        className="row vh-100"
        style={{
          backgroundImage: `url(${bg})`,
          backgroundSize: "cover",
          backgroundRepeat: "no-repeat",
          backgroundPosition: "center",
          backgroundOrigin: "content-box",
          backgroundAttachment: "fixed",
        }}
      >
        <div className="col-md-7">
          <div className="d-none d-md-block justify-content-center align-items-center vh-100 ps-5 ms-5 ">
            <div className="ms-5">
              <img src={logo} height={250} width={250} className="ms-5" alt="Logo" />
              <h1 className="display-6 fw-bolder ms-5">Brainstake eSchools</h1>
              <p className="ms-md-5 fs-6">
                Unlock the power of effortless education management with our cutting-edge school management system.
              </p>

              <h4 className="ms-5 mb-3 mt-5 text-muted">Our clients</h4>
              <div className="d-flex justify-content-start">
                <img src={mellary} height={50} width={50} className="ms-5" alt="Logo" />
                <img src={langham} height={50} width={50} className="ms-5" alt="Logo" />
                <img src={dioscese} height={50} width={50} className="ms-5" alt="Logo" />
                <img src={pamushana} height={50} width={50} className="ms-5" alt="Logo" />
              </div>
            </div>
          </div>
        </div>
        <div className="col-md-5">
          <div className="d-flex justify-content-center align-items-center vh-100">
            <Form
              layout="vertical"
              onSubmitCapture={handleLogin}
              className="col-md-9 bg-white my-5 m-md-5 px-1 px-md-4 pt-4 rounded-1"
            >
              <h2 className="mb-3 text-center">Welcome back to Brainstake eSchools</h2>
              <div className="d-flex align-items-center justify-content-center mb-3">
                <hr
                  className="me-3 flex-grow-1"
                  style={{ borderTop: "4px solid green", width: "30%", maxWidth: "30%" }}
                />
              </div>
              <p className="mt-2 text-center text-muted">Please sign in to continue to your account</p>
              <Form.Item>
                <Input
                  size="large"
                  prefix={<UserOutlined />}
                  placeholder="Username"
                  className="rounded-1"
                  onInput={toInputUppercase}
                  onChange={(e) => setUsername(e.target.value)}
                  required
                />
              </Form.Item>
              <Form.Item>
                <Input.Password
                  size="large"
                  prefix={<LockOutlined />}
                  placeholder="Password"
                  className="rounded-1"
                  onChange={(e) => setPassword(e.target.value)}
                  required                />
              </Form.Item>
              <Form.Item>
                <Button
                  type="primary"
                  htmlType="submit"
                  size="large"
                  block
                  icon={<LoginOutlined />}
                  loading={loading}
                  disabled={disabled}
                >
                  Sign in
                </Button>
              </Form.Item>
              <div className="my-3 text-center">
                <span className="text-muted">By signing in, I agree to Brainstake </span>
                <a href="https://eschools.brainstake.tech/terms.html" target='_blank' className="text-muted">
                  Terms of service
                </a>
                <span className="text-muted"> and </span>
                <a href="https://eschools.brainstake.tech/privacy.html" target='_blank' className="text-muted">
                  Privacy policy
                </a>
              </div>
            </Form>
          </div>
        </div>
      </div>
    </div>
  );
}

Login.propTypes = {
  setToken: PropTypes.func.isRequired,
};
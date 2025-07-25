import { useState } from "react";
import "./LogIn.css";
import { useNavigate, Link } from "react-router-dom";
import { toast } from "react-toastify";
import { loginUser } from "../../services/userService";
import logo from "../../logo.svg";
import { useDispatch, useSelector } from "react-redux";
import { setLoading, setUnLoading } from "../../redux/reducer/loading.ts";
import { loginUserRedux } from "../../redux/reducer/user.reducer";

const LogIn = (props) => {
  const user = useSelector((state) => state.user) || {};
  const dispatch = useDispatch();

  let navigate = useNavigate();

  const [valueLogin, setValueLogin] = useState("");
  const [password, setPassword] = useState("");

  const defaultObjValidInput = {
    isValidValueLogin: true,
    isValidPassword: true,
  };

  const [objValidInput, setObjValidInput] = useState(defaultObjValidInput);

  const handleLogin = async () => {
    setObjValidInput(defaultObjValidInput);
    if (!valueLogin) {
      setObjValidInput({ ...defaultObjValidInput, isValidValueLogin: false });
      toast.error("Please enter your email address or phone number");
      return;
    }

    if (!password) {
      setObjValidInput({ ...defaultObjValidInput, isValidPassword: false });
      toast.error("Please enter your password");
      return;
    }

    dispatch(setLoading());
    let response = await loginUser(valueLogin, password);
    dispatch(setUnLoading());

    if (response && +response.EC === 0) {
      toast.success(response.EM);
      // Success
      let groupWithRoles = response.DT.groupWithRoles;
      let id = response.DT.id;
      let email = response.DT.email;
      let username = response.DT.username;
      let firstName = response.DT.firstName;
      let lastName = response.DT.lastName;
      let token = response.DT.access_token;
      let phone = response.DT.phone;
      let gender = response.DT.gender;
      let avatar = response.DT.avatar;
      let address = response.DT.address;

      let data = {
        isAuthenticated: true,
        token,
        account: {
          groupWithRoles,
          id,
          email,
          username,
          firstName,
          lastName,
          phone,
          gender,
          avatar,
          address,
        },
      };

      localStorage.setItem("jwt", token);
      localStorage.setItem("user", JSON.stringify(data));
      dispatch(loginUserRedux(data));
      switch (groupWithRoles?.name) {
        case "admin":
          navigate("/manage");
          break;
        case "hospital":
          navigate("/hospital");
          break;
        case "doctor":
          navigate("/doctor");
          break;
        case "staff":
          navigate("/staff");
          break;
        default:
          navigate("/");
          break;
      }
    }

    if (response && +response.EC !== 0) {
      // ERROR
      toast.error(response.EM);
    }
  };

  const handlePressEnter = (event) => {
    if (event.code === "Enter") {
      handleLogin();
    }
  };

  return (
    <>
      <div class="wrapper">
        <div class="section-authentication-signin d-flex align-items-center justify-content-center my-5 my-lg-0">
          <div class="container-fluid">
            <div class="row row-cols-1 row-cols-lg-1">
              <div class="col mx-auto">
                <div class="card">
                  <div class="card-body">
                    <div class="border p-4 rounded">
                      <Link to="/">
                        <div class="d-flex align-items-center justify-content-center">
                          <img
                            src={logo}
                            width="60"
                            height="60"
                            className="d-inline-block align-top me-3"
                            alt="Logo"
                          />
                          <h3 class="">Login</h3>
                        </div>
                      </Link>
                      <div className="mb-3 gap-1 d-flex text-center">
                        <p> Don't have an account yet?</p>
                        <Link to="/signup">Register here</Link>
                      </div>
                      <div class="form-body">
                        <form class="row g-3">
                          <div class="col-12">
                            <label for="inputEmailAddress" class="form-label">
                              Email Address or Username
                            </label>
                            <input
                              type="text"
                              className={
                                objValidInput.isValidValueLogin
                                  ? "form-control"
                                  : "form-control is-invalid"
                              }
                              placeholder="Email address or Username"
                              value={valueLogin}
                              onChange={(event) => {
                                setValueLogin(event.target.value);
                              }}
                            />
                          </div>
                          <div class="col-12">
                            <label for="inputChoosePassword" class="form-label">
                              Password
                            </label>
                            <div class="input-group" id="show_hide_password">
                              <input
                                type="password"
                                className={
                                  objValidInput.isValidPassword
                                    ? "form-control"
                                    : "form-control is-invalid"
                                }
                                placeholder="Password"
                                value={password}
                                onChange={(event) => {
                                  setPassword(event.target.value);
                                }}
                                onKeyDown={(event) => handlePressEnter(event)}
                              />
                            </div>
                          </div>
                          <div class="col-md-12 d-inline-block text-center">
                            {/* <Link to="#">Forgot Password?</Link> */}
                          </div>
                          <div class="col-12">
                            <div class="d-grid">
                              <button
                                className="btn btn-primary"
                                onClick={(e) => {
                                  e.preventDefault(); // Ngăn chặn hành vi mặc định của sự kiện
                                  handleLogin();
                                }}
                              >
                                Login
                              </button>
                            </div>
                          </div>
                        </form>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default LogIn;

import { Button, CircularProgress, Stack, TextField } from "@mui/material";
import { Box } from "@mui/system";
import axios from "axios";
import { useSnackbar } from "notistack";
import React, { useState } from "react";
import { config } from "../App";
import Footer from "./Footer";
import Header from "./Header";
import "./Register.css";
import { useHistory, Link } from "react-router-dom";

const Register = () => {
  const { enqueueSnackbar } = useSnackbar();

  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [isBusy, setIsBusy] = useState(false);
  const history = useHistory();
  /**
   * Definition for register handler
   * - Function to be called when the user clicks on the register button or submits the register form
   *
   * @param {{ username: string, password: string, confirmPassword: string }} formData
   *  Object with values of username, password and confirm password user entered to register
   *
   * API endpoint - "POST /auth/register"
   *
   * Example for successful response from backend for the API call:
   * HTTP 201
   * {
   *      "success": true,
   * }
   *
   * Example for failed response from backend for the API call:
   * HTTP 400
   * {
   *      "success": false,
   *      "message": "Username is already taken"
   * }
   */
  const register = async (formData) => {
    setIsBusy(true);
    if (validateInput(formData))
      try {
        const res = await axios.post(config.endpoint + "/auth/register", {
          username,
          password,
        });
        if (res.status === 201) {
          enqueueSnackbar("Registered successfully", {
            variant: "success",
            duration: 6000,
          });
          setUsername("");
          setPassword("");
          setConfirmPassword("");
          history.push("/login");
        } else
          enqueueSnackbar("Something is not right!", {
            variant: "warning",
            duration: 6000,
          });
      } catch (error) {
        if (error.response)
          enqueueSnackbar(error.response.data.message, {
            variant: "error",
            duration: 6000,
          });
        else
          enqueueSnackbar("Server is not reachable.", {
            variant: "error",
            duration: 6000,
          });
      }
    setIsBusy(false);
  };

  /**
   * Validate the input values so that any bad or illegal values are not passed to the backend.
   *
   * @param {{ username: string, password: string, confirmPassword: string }} data
   *  Object with values of username, password and confirm password user entered to register
   *
   * @returns {boolean}
   *    Whether validation has passed or not
   *
   * Return false if any validation condition fails, otherwise return true.
   * (NOTE: The error messages to be shown for each of these cases, are given with them)
   * -    Check that username field is not an empty value - "Username is a required field"
   * -    Check that username field is not less than 6 characters in length - "Username must be at least 6 characters"
   * -    Check that password field is not an empty value - "Password is a required field"
   * -    Check that password field is not less than 6 characters in length - "Password must be at least 6 characters"
   * -    Check that confirmPassword field has the same value as password field - Passwords do not match
   */
  const validateInput = (data) => {
    if (!data.username.length) {
      enqueueSnackbar("Username is a required field.", {
        variant: "warning",
        duration: 6000,
      });
      return false;
    } else if (data.username.length < 6) {
      enqueueSnackbar("Username must be of atleast 6 characters.", {
        variant: "warning",
        duration: 6000,
      });
      return false;
    } else if (!data.password.length) {
      enqueueSnackbar("Password is a required field.", {
        variant: "warning",
        duration: 6000,
      });
      return false;
    } else if (data.password.length < 6) {
      enqueueSnackbar("Password must be of atleast 6 characters.", {
        variant: "warning",
        duration: 6000,
      });
      return false;
    } else if (data.password !== data.confirmPassword) {
      enqueueSnackbar("Password and confirm password do not match.", {
        variant: "warning",
        duration: 6000,
      });
      return false;
    }
    return true;
  };

  return (
    <Box
      display="flex"
      flexDirection="column"
      justifyContent="space-between"
      minHeight="100vh"
    >
      <Header hasHiddenAuthButtons />
      <Box className="content">
        <Stack spacing={2} className="form">
          <h2 className="title">Register</h2>
          <TextField
            id="username"
            label="Username"
            variant="outlined"
            title="Username"
            name="username"
            placeholder="Enter Username"
            value={username}
            fullWidth
            onChange={(e) => setUsername(e.target.value)}
          />
          <TextField
            id="password"
            variant="outlined"
            label="Password"
            name="password"
            type="password"
            helperText="Password must be atleast 6 characters length"
            value={password}
            fullWidth
            placeholder="Enter a password with minimum 6 characters"
            onChange={(e) => setPassword(e.target.value)}
          />
          <TextField
            id="confirmPassword"
            variant="outlined"
            label="Confirm Password"
            name="confirmPassword"
            type="password"
            value={confirmPassword}
            fullWidth
            onChange={(e) => setConfirmPassword(e.target.value)}
          />
          {isBusy ? (
            <Box display="flex" justifyContent="center">
              <CircularProgress />
            </Box>
          ) : (
            <Button
              className="button"
              variant="contained"
              onClick={() => register({ username, password, confirmPassword })}
            >
              Register Now
            </Button>
          )}
          <p className="secondary-action">
            Already have an account?{" "}
            <Link className="link" to="/login">
              Login here
            </Link>
          </p>
        </Stack>
      </Box>
      <Footer />
    </Box>
  );
};

export default Register;

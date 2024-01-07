import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import { Avatar, Button, Stack } from "@mui/material";
import Box from "@mui/material/Box";
import React from "react";
import { Link } from 'react-router-dom';
import "./Header.css";

const  Header = ({ children, hasHiddenAuthButtons }) => {
  const username = window.localStorage.getItem("username");

  function logout(){
    window.localStorage.clear();
    window.location.reload();
  }
  return (
    <Box className="header">
      <Box className="header-title">
        <Link to="/">
          <img src="logo_light.svg" alt="QKart-icon"></img>
        </Link>
      </Box>
      {children}
      {hasHiddenAuthButtons ?  
        <Link to="/">
          <Button
            startIcon={<ArrowBackIcon />}
            variant="text"
            >
            Back to explore
          </Button>
        </Link>
      :
        <Stack
          direction="row"
          spacing={1.5}>
          
          {username ?
            <Stack
              direction='row'
              alignItems="center"
              spacing={1.2}>
              <img src="avatar.png" alt={username} height="40"/>
              <span class="username-text">{username}</span>
            </Stack>
          :
            <Link to="/login">
              <Button
                variant="text"
              >
                LOGIN
              </Button>
            </Link>
          }
          {username ?
            <Button
              variant="text"
              onClick={logout}
            >
              LOGOUT
            </Button>
          :
            <Link to="/register">
              <Button
                variant="contained"
                >
                REGISTER
              </Button>
            </Link>
          }
        </Stack>
      }
    </Box>
  );
};

export default Header;

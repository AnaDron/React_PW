import React from 'react';
import { Route, BrowserRouter } from "react-router-dom";
import SignIn from './components/SignIn';
import SignUp from './components/SignUp';
import Copyright from './components/Copyright';
import './App.css';

import { Box, CssBaseline, Container, Typography } from '@material-ui/core';

function App() {
  return (
    <Container maxWidth="sm">
      <CssBaseline />
      <Box my={4}>
        <Typography variant="h1" gutterBottom align="center">
          Parrot Wings
        </Typography>
        <Container component="main" maxWidth="xs">
          <BrowserRouter>
            <Route path="/login" component={SignIn} />
            <Route path="/register" component={SignUp} />
          </BrowserRouter>
        </Container>
        <Box mt={5}>
          <Copyright />
        </Box>
      </Box>
    </Container>
  );
}

export default App;

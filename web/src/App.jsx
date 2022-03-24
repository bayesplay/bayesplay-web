import React from "react";
import { BrowserRouter, Route, Switch, Link, NavLink } from "react-router-dom";
import { Container, Typography, AppBar, Toolbar, Grid} from "@material-ui/core";
import styled from "styled-components";

import { Calculate } from "./Pages/Calculator.jsx";

import { About } from "./Pages/About.jsx";

import { Advanced } from "./Pages/Advanced.jsx";

const HeaderLink = styled(Link)`
  color: white;
  text-decoration: none;
`;

const activeClassName = "nav-item-active";
const StyledLink = styled(NavLink).attrs({ activeClassName })`
  color: white;
  text-decoration: none;
  &.${activeClassName} {
    color: white;
    text-decoration: underline;
  }
`;

function SimpleMenu() {
  return (
    <AppBar position="static" style={{ paddingLeft: 10, paddingRight: 10 }}>
      <Toolbar>
        <Typography variant="h6">
          <HeaderLink to="/">
            <code>Bayesplay</code> <span style={{ fontSize: "50%" }}></span>
          </HeaderLink>
        </Typography>
        <Typography style={{ marginLeft: "auto" }}>
          <StyledLink to="/about">About</StyledLink>
        </Typography>
      </Toolbar>
    </AppBar>
  );
}

function Layout(props) {
  return (
    <React.Fragment>
      <Container maxWidth="md" style={{ backgroundColor: "white" }}>
        <div className="content">
          <SimpleMenu />
        </div>
        <div className="content">{props.children}</div>
      </Container>
      <Grid
        style={{ padding: 20, display: "flex", justifyContent: "center" }}
      >
        &copy; 2022 Lincoln Colling
      </Grid>
    </React.Fragment>
  );
}

function App() {
  return (
    <BrowserRouter>
      <Layout>
        <Switch>
          <Route path="/about">
            <About />
          </Route>
          <Route path="/" exact>
            <Calculate />
          </Route>
          <Route path="/advanced">
            <Advanced /> 
          </Route>
        </Switch>
      </Layout>
    </BrowserRouter>
  );
}

export default App;

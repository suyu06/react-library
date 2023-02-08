import React from "react";
import { Redirect, Route, Switch } from "react-router-dom";
import "./App.css";
import { HomePage } from "./layouts/HomePage/HomePage";
import { Footer } from "./layouts/NavbarAndFooter/Footer";
import { Navbar } from "./layouts/NavbarAndFooter/Navbar";
import { SearchBooksPage } from "./layouts/SearchBooksPage/SearchBooksPage";

export const App = () => {
  return (
    <div>
      <Navbar></Navbar>
      <Switch>
        <Route path="/" exact>
          {/* <HomePage></HomePage> */}
          <Redirect to='/home'></Redirect>
        </Route>
        <Route path='/home'>
          <HomePage/>
        </Route>
        <Route path="/search">
          <SearchBooksPage></SearchBooksPage>
        </Route>
      </Switch>
      <Footer></Footer>
    </div>
  );
};

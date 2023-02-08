import React from "react";
import { Redirect, Route, Switch } from "react-router-dom";
import "./App.css";
import { BookCheckoutPage } from "./layouts/BookCheckoutPage/BookCheckoutPage";
import { HomePage } from "./layouts/HomePage/HomePage";
import { Footer } from "./layouts/NavbarAndFooter/Footer";
import { Navbar } from "./layouts/NavbarAndFooter/Navbar";
import { SearchBooksPage } from "./layouts/SearchBooksPage/SearchBooksPage";

export const App = () => {
  return (
    <div className="d-flex flex-column min-vh-100">
      <Navbar></Navbar>
      <div className="flex-grow-1">
        <Switch>
          <Route path="/" exact>
            {/* <HomePage></HomePage> */}
            <Redirect to="/home"></Redirect>
          </Route>
          <Route path="/home">
            <HomePage />
          </Route>
          <Route path="/search">
            <SearchBooksPage></SearchBooksPage>
          </Route>
          <Route path="/checkout/:bookId">
            <BookCheckoutPage></BookCheckoutPage>
          </Route>
        </Switch>
      </div>
      <Footer></Footer>
    </div>
  );
};

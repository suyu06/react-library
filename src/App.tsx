import React from "react";
import "./App.css";
import { ExploreTopBooks } from "./layouts/HomePage/ExploreTopBooks";
import { Navbar } from "./layouts/NavbarAndFooter/Navbar";

function App() {
  return (
    <div>
      <Navbar></Navbar>
      <ExploreTopBooks></ExploreTopBooks>
    </div>
  );
}

export default App;

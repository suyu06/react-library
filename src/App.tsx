import React from "react";
import "./App.css";
import { Carousel } from "./layouts/HomePage/Carousel";
import { ExploreTopBooks } from "./layouts/HomePage/ExploreTopBooks";
import { Navbar } from "./layouts/NavbarAndFooter/Navbar";

function App() {
  return (
    <div>
      <Navbar></Navbar>
      <ExploreTopBooks></ExploreTopBooks>
      <Carousel></Carousel>
    </div>
  );
}

export default App;

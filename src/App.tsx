import React from "react";
import "./App.css";
import { Carousel } from "./layouts/HomePage/Carousel";
import { ExploreTopBooks } from "./layouts/HomePage/ExploreTopBooks";
import { Heros } from "./layouts/HomePage/Heros";
import { LibraryServices } from "./layouts/HomePage/LibraryServices";
import { Footer } from "./layouts/NavbarAndFooter/Footer";
import { Navbar } from "./layouts/NavbarAndFooter/Navbar";

function App() {
  return (
    <div>
      <Navbar></Navbar>
      <ExploreTopBooks></ExploreTopBooks>
      <Carousel></Carousel>
      <Heros></Heros>
      <LibraryServices></LibraryServices>
      <Footer></Footer>
    </div>
  );
}

export default App;

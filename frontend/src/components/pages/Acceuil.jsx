import React from "react";
import HeroSection from "./HeroSection";
import Header from "../Header";
import Services from "./Services";
import Footer from "../Footer";

const HomePage = () => {
  return (
    <div>
      <Header/>
      <HeroSection />
      <Services/>
      <Footer/>
    </div>
  );
};

export default HomePage;

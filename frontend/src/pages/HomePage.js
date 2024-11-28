import React from "react";
import Header from "../components/Header";
import Footer from "../components/Footer";
import Carousel from "../components/Carousel";
import ServiceSection from "../components/ServiceSection";
import HabitatSection from "../components/HabitatSection";
import AnimalSection from "../components/AnimalSection";
import ReviewSection from "../components/ReviewSection";

const HomePage = () => {
  return (
    <div>
      <Header />
      <Carousel />
      <main>
        <section>
          <h1>Bienvenue à Zoo Arcadia</h1>
          <p>Découvrez la beauté et la biodiversité près de la forêt de Brocéliande !</p>
        </section>
        <ServiceSection />
        <HabitatSection />
        <AnimalSection />
        <ReviewSection />
      </main>
      <Footer />
    </div>
  );
};

export default HomePage;

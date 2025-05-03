import React from "react";

const HeroSection = () => {
  return (
    <section className="bg-gradient-to-br from-orange-50 to-white min-h-screen flex items-center justify-center px-6">
      <div className="container mx-auto flex flex-col-reverse lg:flex-row items-center gap-10">
   
        <div className="flex-1 text-center lg:text-left">
          <h1 className="text-3xl sm:text-4xl lg:text-5xl font-semibold text-gray-800 mb-4">
            A trusted provider of{" "}
            <span className="text-gray-900 font-bold">courier services.</span>
          </h1>
          <p className="text-gray-600 mb-6">
            We deliver your products safely to your home in a reasonable time.
          </p>
          <button className="bg-orange-500 text-white px-6 py-3 rounded-md font-semibold hover:bg-orange-600 transition">
            Get started
          </button>
        </div>


        <div className="flex-1 flex justify-center">
          <img
            src="./images/Illustration.png" 
            alt="Delivery"
            className="w-full max-w-md"
          />
        </div>
      </div>
    </section>
  );
};

export default HeroSection;

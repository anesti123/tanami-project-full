import React from 'react';

const LandingHero = () => {
  return (
    <section className="bg-blue-600 text-white py-20">
      <div className="container mx-auto px-4 text-center">
        <h1 className="text-4xl md:text-6xl font-bold mb-6">Welcome to Tanami Project</h1>
        <p className="text-xl md:text-2xl mb-8">
          Modern design meets robust backend functionality.
        </p>
        <a
          href="/auth/login"
          className="bg-white text-blue-600 px-6 py-3 rounded-full font-medium hover:bg-gray-200 transition"
        >
          Get Started
        </a>
      </div>
    </section>
  );
};

export default LandingHero;

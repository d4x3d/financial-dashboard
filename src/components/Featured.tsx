import React from 'react';

const Featured = () => {
  return (
    <section className="py-16 bg-gray-900 text-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center">
          <h2 className="text-3xl font-bold mb-4">Let's celebrate the love for the team</h2>
          <p className="text-xl mb-8">Choose your favorite design, now. Together, we make it happen.</p>
          <button className="bg-transparent border-2 border-white text-white px-6 py-3 rounded-md hover:bg-white hover:text-gray-900 transition-colors">
            Personalize your card
          </button>
        </div>
      </div>
    </section>
  );
};

export default Featured;
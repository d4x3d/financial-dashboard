import React from 'react';

const MobileApp = () => {
  return (
    <section className="py-12 bg-gray-100">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col md:flex-row items-center gap-8">
          <div className="md:w-1/2">
            <img
              src="/images/zelle-app.png"
              alt="Trusted Mobile App"
              className="w-full max-w-md mx-auto"
            />
          </div>

          <div className="md:w-1/2">
            <h2 className="text-3xl font-bold mb-4">Banking in the palm of your hand</h2>
            <p className="text-xl text-gray-600 mb-6">
              Our Trusted Mobile app gives you fast and secure access to your finances
            </p>

            <ul className="space-y-3 mb-8">
              <li className="flex items-center">
                <span className="text-gray-700">• Check your account balance</span>
              </li>
              <li className="flex items-center">
                <span className="text-gray-700">• View your latest FICO® Score¹</span>
              </li>
              <li className="flex items-center">
                <span className="text-gray-700">• Send and receive money with Zelle®²</span>
              </li>
            </ul>

            <p className="font-semibold mb-4">Download our app</p>
            <div className="flex space-x-4">
              <a href="#" className="flex items-center bg-black text-white px-6 py-2 rounded-md hover:bg-gray-800">
                <img
                  src="/images/apple.png"
                  alt="App Store"
                  className="h-6 w-6 mr-2"
                />
                <span>App Store</span>
              </a>
              <a href="#" className="flex items-center bg-black text-white px-6 py-2 rounded-md hover:bg-gray-800">
                <img
                  src="/images/google.png"
                  alt="Google Play"
                  className="h-6 w-6 mr-2"
                />
                <span>Google Play</span>
              </a>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default MobileApp;
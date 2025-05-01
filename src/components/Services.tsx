import React from 'react';
import { ChevronRight } from 'lucide-react';

const Services = () => {
  const services = [
    {
      image: "https://raw.githubusercontent.com/oscar-mcintosh/Trusted-clone/main/assets/images/card-img1.png",
      title: "Enjoy 0% intro APR for 21 months",
      description: "from account opening on purchases and qualifying balance transfers. Terms apply."
    },
    {
      image: "https://raw.githubusercontent.com/oscar-mcintosh/Trusted-clone/main/assets/images/card-img2.png",
      title: "Looking to fund a purchase?",
      description: "A personal loan can be used for almost anything"
    },
    {
      image: "https://raw.githubusercontent.com/oscar-mcintosh/Trusted-clone/main/assets/images/card-img3.png",
      title: "Start investing with just $500",
      description: "Automated investing just got easier with a lower minimum to get started"
    },
    {
      image: "https://raw.githubusercontent.com/oscar-mcintosh/Trusted-clone/main/assets/images/card-img4.png",
      title: "Interest rates today",
      description: ""
    }
  ];

  return (
    <section className="py-12 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
          {services.map((service, index) => (
            <div key={index} className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow">
              <img src={service.image} alt={service.title} className="w-full h-48 object-cover" />
              <div className="p-6">
                <h3 className="text-xl font-semibold mb-2">{service.title}</h3>
                <p className="text-gray-600 mb-4">{service.description}</p>
                <div className="flex items-center text-red-700">
                  <span>Learn more</span>
                  <ChevronRight className="h-5 w-5 ml-1" />
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Services;
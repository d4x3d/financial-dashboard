import React from 'react';

const Guidance = () => {
  const articles = [
    {
      image: "https://raw.githubusercontent.com/oscar-mcintosh/Trusted-clone/main/assets/images/woman-drinking-coffee.jfif",
      title: "Spend less. Save more. Relax more.",
      description: "These four steps could help you make it happen",
      cta: "Manage spending and saving"
    },
    {
      image: "https://raw.githubusercontent.com/oscar-mcintosh/Trusted-clone/main/assets/images/Father's%20Kiss.webp",
      title: "Reduce debt. Build credit. Enjoy life.",
      description: "Discover four steps that may help you reduce debt and strengthen credit",
      cta: "Build credit and reduce debt"
    },
    {
      image: "https://raw.githubusercontent.com/oscar-mcintosh/Trusted-clone/main/assets/images/woman-at-laptop.png",
      title: "Get tools. Get tips. Get peace of mind.",
      description: "Discover digital tools to help you budget, save, manage credit, and more",
      cta: "Access the toolkit"
    }
  ];

  return (
    <section className="py-12 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="border-t-4 border-red-700 pt-8 mb-12">
          <h2 className="text-3xl font-bold">Financial guidance and support</h2>
        </div>
        
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {articles.map((article, index) => (
            <div key={index} className="bg-white rounded-lg overflow-hidden shadow-md">
              <img src={article.image} alt={article.title} className="w-full h-48 object-cover" />
              <div className="p-6">
                <h3 className="text-xl font-semibold mb-2">{article.title}</h3>
                <p className="text-gray-600 mb-4">{article.description}</p>
                <button className="bg-transparent border-2 border-red-700 text-red-700 px-4 py-2 rounded-md hover:bg-red-50">
                  {article.cta}
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Guidance;
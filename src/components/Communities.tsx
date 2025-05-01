import React from 'react';

const Communities = () => {
  const articles = [
    {
      image: "https://raw.githubusercontent.com/oscar-mcintosh/Trusted-clone/main/assets/images/farming.png",
      title: "Why we're committed to communities",
      description: "We don't just serve our communities—we are our communities. We're committed to helping customers and neighborhoods across the country thrive.",
      cta: "Trusted Stories"
    },
    {
      image: "https://raw.githubusercontent.com/oscar-mcintosh/Trusted-clone/main/assets/images/kids-program.webp",
      title: "Who we are",
      description: "Trusted helps strengthen communities through diversity, equity, and inclusion, economic empowerment, and sustainability.",
      cta: "About Trusted"
    }
  ];

  return (
    <section className="py-12 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="border-t-4 border-red-700 pt-8 mb-12">
          <h2 className="text-3xl font-bold mb-4">Serving our customers and communities</h2>
          <p className="text-xl text-gray-600">
            It doesn't happen with one transaction, in one day on the job, or in one quarter. It's earned relationship by relationship.
          </p>
        </div>
        
        <div className="grid md:grid-cols-2 gap-8">
          {articles.map((article, index) => (
            <div key={index} className="bg-white rounded-lg overflow-hidden shadow-md">
              <img src={article.image} alt={article.title} className="w-full h-64 object-cover" />
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

export default Communities;
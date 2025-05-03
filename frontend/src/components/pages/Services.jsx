import React from "react";
import { FaUtensils, FaTruck, FaGift } from "react-icons/fa";

const services = [
  {
    title: "Repas d'Entreprise",
    icon: <FaUtensils className="text-orange-500 text-4xl mb-4" />,
    description:
      "Nous proposons des repas sains et équilibrés pour les entreprises, livrés directement au bureau pour vos équipes.",
    items: ["Repas du jour", "Menus végétariens", "Repas en boîte"],
  },
  {
    title: "Livraison à Domicile",
    icon: <FaTruck className="text-orange-500 text-4xl mb-4" />,
    description:
      "Livraison rapide de repas à domicile, que vous soyez seul ou en famille, avec une arrivée dans les 30 à 60 minutes.",
    items: ["Repas pour une personne", "Repas familiaux", "Desserts"],
  },
  {
    title: "Repas Offerts",
    icon: <FaGift className="text-orange-500 text-4xl mb-4" />,
    description:
      "Surprenez vos proches avec un repas offert, livré à leur porte. Parfait pour un cadeau spécial ou une occasion particulière.",
    items: ["Cadeaux gourmands", "Repas spéciaux", "Repas pour événements"],
  },
];

const Services = () => {
  return (
    <section className="bg-orange-50 py-12">
      <div className="text-center mb-10">
        <h2 className="text-orange-500 font-bold text-sm uppercase">Nos Services</h2>
        <h3 className="text-2xl font-semibold text-gray-800">Nos services de livraison de repas</h3>
      </div>
      <div className="container mx-auto px-4 grid md:grid-cols-3 gap-6">
        {services.map((service, index) => (
          <div key={index} className="bg-white p-6 rounded-xl shadow-md text-center">
            {service.icon}
            <h4 className="text-lg font-bold text-gray-800 mb-2">{service.title}</h4>
            <p className="text-sm text-gray-600 mb-4">{service.description}</p>
            <ul className="text-sm text-left mb-4 space-y-1 text-gray-700">
              {service.items.map((item, i) => (
                <li key={i} className="flex items-center">
                  <span className="h-2 w-2 bg-orange-500 rounded-full mr-2" />
                  {item}
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>
    </section>
  );
};

export default Services;

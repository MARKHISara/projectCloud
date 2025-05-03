import React from "react";

const Footer = () => {
  return (
    <footer className="bg-[#1E1B2E] text-white pt-12 pb-6">
  
      <div className="container mx-auto px-4 md:flex justify-between items-center border-b border-gray-600 pb-10">
        <div className="mb-6 md:mb-0">
          <h3 className="text-2xl font-semibold mb-2">Recevez les mises à jour chaque semaine</h3>
          <p className="text-sm text-gray-300 max-w-md">
            Nous nous assurons que vos produits sont livrés de manière sûre, au bon endroit et au bon moment.
          </p>
        </div>
        <div>
          <h4 className="text-orange-500 uppercase font-semibold text-sm mb-2">Abonnez-vous à notre newsletter</h4>
          <form className="flex">
            <input
              type="email"
              placeholder="Entrez votre email"
              className="px-4 py-2 w-64 rounded-l-md focus:outline-none text-gray-800"
            />
            <button className="bg-orange-500 px-4 py-2 rounded-r-md text-white hover:bg-orange-600">
              S'abonner
            </button>
          </form>
        </div>
      </div>

      <div className="container mx-auto px-4 grid md:grid-cols-4 gap-8 py-10 text-sm text-gray-300">
        <div>
          <div className="text-orange-500 text-lg font-bold mb-2">Quriarbox</div>
          <p>L'entreprise de messagerie la plus fiable dans votre région.</p>
        </div>
        <div>
          <h5 className="font-semibold text-white mb-2">Autres liens</h5>
          <ul className="space-y-1">
            <li>Blogs</li>
            <li>Site des déménageurs</li>
            <li>Mise à jour du trafic</li>
          </ul>
        </div>
        <div>
          <h5 className="font-semibold text-white mb-2">Services</h5>
          <ul className="space-y-1">
            <li>Biens d'entreprise</li>
            <li>Œuvres d'art</li>
            <li>Documents</li>
          </ul>
        </div>
        <div>
          <h5 className="font-semibold text-white mb-2">Service client</h5>
          <ul className="space-y-1">
            <li>À propos de nous</li>
            <li>Contactez-nous</li>
            <li>Recevez des mises à jour</li>
          </ul>
        </div>
      </div>


      <div className="border-t border-gray-700 text-center text-gray-400 text-xs pt-4">
        <p>Tous droits réservés © Votre entreprise, 2025</p>
        <p>Créé avec cœur par <span className="text-orange-500">Themefisher</span></p>
      </div>
    </footer>
  );
};

export default Footer;

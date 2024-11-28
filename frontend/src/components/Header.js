import React from "react";
import { Link } from "react-router-dom";

const Header = () => {
  return (
    <header>
      <nav>
        <ul>
          <li><Link to="/">Accueil</Link></li>
          <li><Link to="/services">Services</Link></li>
          <li><Link to="/habitats">Habitats</Link></li>
          <li><Link to="/animaux">Animaux</Link></li>
          <li><Link to="/avis">Avis</Link></li> {/* Ajout du lien vers la page des avis */}
          <li><Link to="/contact">Contact</Link></li>
          <li><Link to="/login">Connexion</Link></li>
        </ul>
      </nav>
    </header>
  );
};

export default Header;

import React, { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import axios from "axios";

const AnimalDetailsPage = () => {
  const { id } = useParams(); // Récupère l'ID de l'animal depuis l'URL
  const [animal, setAnimal] = useState(null);
  const [rapports, setRapports] = useState([]);
  const [avis, setAvis] = useState([]);

  useEffect(() => {
    // Récupération des détails de l'animal
    axios.get(`http://localhost:5001/api/animaux/${id}`)
      .then((response) => setAnimal(response.data))
      .catch((error) => console.error("Erreur lors de la récupération de l'animal :", error));

    // Récupération des rapports vétérinaires pour l'animal
    axios.get(`http://localhost:5001/api/rapports-veterinaires/animal/${id}`)
      .then((response) => setRapports(response.data))
      .catch((error) => console.error("Erreur lors de la récupération des rapports :", error));

    // Récupération des avis pour l'animal
    axios.get(`http://localhost:5001/api/avis/animal/${id}`)
      .then((response) => setAvis(response.data))
      .catch((error) => console.error("Erreur lors de la récupération des avis :", error));
  }, [id]);

  if (!animal) {
    return <p>Chargement...</p>;
  }

  return (
    <div>
      <h1>{animal.prenom} - {animal.nom}</h1>
      <img src={animal.image} alt={`${animal.prenom}`} />
      <p><strong>Race : </strong>{animal.race}</p>
      <p><strong>État : </strong>{animal.etat}</p>
      <p><strong>Nourriture : </strong>{animal.nourriture} ({animal.grammage} kg)</p>
      <p><strong>Dernier Passage du Vétérinaire : </strong>{animal.date_passage}</p>
      <Link to="/animaux">Retour à la liste des animaux</Link>

      <section>
        <h2>Rapports Vétérinaires</h2>
        <ul>
          {rapports.map((rapport) => (
            <li key={rapport.rapport_id}>
              <p><strong>Date : </strong>{rapport.date}</p>
              <p>{rapport.commentaire}</p>
            </li>
          ))}
        </ul>
      </section>

      <section>
        <h2>Avis des Visiteurs</h2>
        <ul>
          {avis.filter(a => a.valide).map((a) => (
            <li key={a.avis_id}>
              <strong>{a.pseudo} : </strong>{a.texte}
            </li>
          ))}
        </ul>

        <form onSubmit={(e) => {
          e.preventDefault();
          const formData = new FormData(e.target);
          const newAvis = {
            pseudo: formData.get("pseudo"),
            texte: formData.get("avis"),
            animal_id: id,
          };
          axios.post(`http://localhost:5001/api/avis`, newAvis)
            .then(() => window.location.reload())
            .catch((error) => console.error("Erreur lors de la soumission de l'avis :", error));
        }}>
          <h3>Laisser un avis</h3>
          <input type="text" name="pseudo" placeholder="Votre pseudo" required />
          <textarea name="avis" placeholder="Votre avis" required></textarea>
          <button type="submit">Soumettre</button>
        </form>
      </section>
    </div>
  );
};

export default AnimalDetailsPage;

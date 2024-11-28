import React, { useState, useEffect } from "react";
import axios from "axios";

const ServiceForm = ({ serviceToEdit, refreshServices }) => {
  const [nom, setNom] = useState("");
  const [description, setDescription] = useState("");

  useEffect(() => {
    if (serviceToEdit) {
      setNom(serviceToEdit.nom);
      setDescription(serviceToEdit.description);
    }
  }, [serviceToEdit]);

  const handleSubmit = (e) => {
    e.preventDefault();
    const serviceData = { nom, description };

    if (serviceToEdit) {
      // Modifier le service existant
      axios.put(`http://localhost:5001/api/services/${serviceToEdit.service_id}`, serviceData)
        .then(() => {
          alert("Service modifié avec succès.");
          refreshServices();
        })
        .catch((error) => console.error("Erreur lors de la modification du service :", error));
    } else {
      // Ajouter un nouveau service
      axios.post("http://localhost:5001/api/services", serviceData)
        .then(() => {
          alert("Service ajouté avec succès.");
          refreshServices();
        })
        .catch((error) => console.error("Erreur lors de l'ajout du service :", error));
    }

    setNom("");
    setDescription("");
  };

  return (
    <form onSubmit={handleSubmit}>
      <h3>{serviceToEdit ? "Modifier Service" : "Ajouter un Service"}</h3>
      <input
        type="text"
        placeholder="Nom du service"
        value={nom}
        onChange={(e) => setNom(e.target.value)}
        required
      />
      <textarea
        placeholder="Description du service"
        value={description}
        onChange={(e) => setDescription(e.target.value)}
        required
      />
      <button type="submit">{serviceToEdit ? "Modifier" : "Ajouter"}</button>
    </form>
  );
};

export default ServiceForm;

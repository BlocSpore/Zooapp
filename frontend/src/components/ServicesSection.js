import React, { useEffect, useState } from "react";
import axios from "axios";

const ServiceSection = () => {
  const [services, setServices] = useState([]);

  useEffect(() => {
    axios.get("http://localhost:5001/api/services")
      .then(response => setServices(response.data))
      .catch(error => console.error("Erreur lors de la récupération des services :", error));
  }, []);

  return (
    <section>
      <h2>Nos Services</h2>
      <ul>
        {services.map(service => (
          <li key={service.service_id}>
            <h3>{service.nom}</h3>
            <p>{service.description}</p>
          </li>
        ))}
      </ul>
    </section>
  );
};

export default ServiceSection;

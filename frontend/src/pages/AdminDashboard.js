import React, { useEffect, useState } from "react";
import axios from "axios";
import UserForm from "../components/UserForm";
import HabitatForm from "../components/HabitatForm";
import AnimalForm from "../components/AnimalForm";
import ServiceForm from "../components/ServiceForm";
import { Container, Row, Col, Table, Button } from "react-bootstrap";

const AdminDashboard = () => {
  const [users, setUsers] = useState([]);
  const [habitats, setHabitats] = useState([]);
  const [animals, setAnimals] = useState([]);
  const [services, setServices] = useState([]);

  // États pour gérer les modifications
  const [habitatToEdit, setHabitatToEdit] = useState(null);
  const [animalToEdit, setAnimalToEdit] = useState(null);
  const [serviceToEdit, setServiceToEdit] = useState(null);

  // Récupération des données initiales
  useEffect(() => {
    axios.get("http://localhost:5001/api/utilisateurs")
      .then(response => setUsers(response.data))
      .catch(error => console.error("Erreur lors de la récupération des utilisateurs :", error));

    axios.get("http://localhost:5001/api/habitats")
      .then(response => setHabitats(response.data))
      .catch(error => console.error("Erreur lors de la récupération des habitats :", error));

    axios.get("http://localhost:5001/api/animaux")
      .then(response => setAnimals(response.data))
      .catch(error => console.error("Erreur lors de la récupération des animaux :", error));

    axios.get("http://localhost:5001/api/services")
      .then(response => setServices(response.data))
      .catch(error => console.error("Erreur lors de la récupération des services :", error));
  }, []);

  // Rafraîchir les entités après une modification
  const refreshHabitats = () => {
    axios.get("http://localhost:5001/api/habitats")
      .then(response => setHabitats(response.data))
      .catch(error => console.error("Erreur lors de la récupération des habitats :", error));
  };

  const refreshAnimals = () => {
    axios.get("http://localhost:5001/api/animaux")
      .then(response => setAnimals(response.data))
      .catch(error => console.error("Erreur lors de la récupération des animaux :", error));
  };

  const refreshServices = () => {
    axios.get("http://localhost:5001/api/services")
      .then(response => setServices(response.data))
      .catch(error => console.error("Erreur lors de la récupération des services :", error));
  };

  // Gestion de la suppression
  const handleDelete = (type, id) => {
    axios.delete(`http://localhost:5001/api/${type}/${id}`)
      .then(() => {
        alert(`${type} supprimé avec succès.`);
        window.location.reload();
      })
      .catch(error => console.error(`Erreur lors de la suppression du ${type} :`, error));
  };

  return (
    <Container fluid>
      <h1 className="text-center my-4">Dashboard Administrateur</h1>

      {/* Gestion des utilisateurs */}
      <Row className="mb-5">
        <Col>
          <h2>Utilisateurs</h2>
          <Table striped bordered hover responsive>
            <thead>
              <tr>
                <th>Email</th>
                <th>Rôle</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {users.map((user) => (
                <tr key={user.utilisateur_id}>
                  <td>{user.email}</td>
                  <td>{user.role}</td>
                  <td>
                    <Button
                      variant="danger"
                      size="sm"
                      onClick={() => handleDelete("utilisateurs", user.utilisateur_id)}
                    >
                      Supprimer
                    </Button>
                  </td>
                </tr>
              ))}
            </tbody>
          </Table>
          <UserForm /> {/* Formulaire pour ajouter un utilisateur */}
        </Col>
      </Row>

      {/* Gestion des habitats */}
      <Row className="mb-5">
        <Col md={6}>
          <h2>Habitats</h2>
          <Table striped bordered hover responsive>
            <thead>
              <tr>
                <th>Nom</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {habitats.map((habitat) => (
                <tr key={habitat.habitat_id}>
                  <td>{habitat.nom}</td>
                  <td>
                    <Button
                      variant="warning"
                      size="sm"
                      onClick={() => setHabitatToEdit(habitat)}
                    >
                      Modifier
                    </Button>
                    <Button
                      variant="danger"
                      size="sm"
                      onClick={() => handleDelete("habitats", habitat.habitat_id)}
                    >
                      Supprimer
                    </Button>
                  </td>
                </tr>
              ))}
            </tbody>
          </Table>
          <HabitatForm habitatToEdit={habitatToEdit} refreshHabitats={refreshHabitats} />
        </Col>
      </Row>

      {/* Gestion des animaux */}
      <Row className="mb-5">
        <Col md={6}>
          <h2>Animaux</h2>
          <Table striped bordered hover responsive>
            <thead>
              <tr>
                <th>Prénom</th>
                <th>Race</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {animals.map((animal) => (
                <tr key={animal.animal_id}>
                  <td>{animal.prenom}</td>
                  <td>{animal.race}</td>
                  <td>
                    <Button
                      variant="warning"
                      size="sm"
                      onClick={() => setAnimalToEdit(animal)}
                    >
                      Modifier
                    </Button>
                    <Button
                      variant="danger"
                      size="sm"
                      onClick={() => handleDelete("animaux", animal.animal_id)}
                    >
                      Supprimer
                    </Button>
                  </td>
                </tr>
              ))}
            </tbody>
          </Table>
          <AnimalForm animalToEdit={animalToEdit} refreshAnimals={refreshAnimals} habitats={habitats} />
        </Col>
      </Row>

      {/* Gestion des services */}
      <Row className="mb-5">
        <Col md={6}>
          <h2>Services</h2>
          <Table striped bordered hover responsive>
            <thead>
              <tr>
                <th>Nom</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {services.map((service) => (
                <tr key={service.service_id}>
                  <td>{service.nom}</td>
                  <td>
                    <Button
                      variant="warning"
                      size="sm"
                      onClick={() => setServiceToEdit(service)}
                    >
                      Modifier
                    </Button>
                    <Button
                      variant="danger"
                      size="sm"
                      onClick={() => handleDelete("services", service.service_id)}
                    >
                      Supprimer
                    </Button>
                  </td>
                </tr>
              ))}
            </tbody>
          </Table>
          <ServiceForm serviceToEdit={serviceToEdit} refreshServices={refreshServices} />
        </Col>
      </Row>
    </Container>
  );
};

export default AdminDashboard;

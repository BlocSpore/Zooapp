import React, { useEffect, useState } from "react";
import axios from "axios";
import { Container, Row, Col, Table, Button, Form } from "react-bootstrap";

const VetDashboard = () => {
  const [animals, setAnimals] = useState([]);
  const [habitats, setHabitats] = useState([]);
  const [selectedAnimal, setSelectedAnimal] = useState(null);
  const [report, setReport] = useState("");
  const [selectedHabitat, setSelectedHabitat] = useState(null);
  const [habitatComment, setHabitatComment] = useState("");

  useEffect(() => {
    axios.get("http://localhost:5001/api/animaux")
      .then(response => setAnimals(response.data))
      .catch(error => console.error("Erreur lors de la récupération des animaux :", error));

    axios.get("http://localhost:5001/api/habitats")
      .then(response => setHabitats(response.data))
      .catch(error => console.error("Erreur lors de la récupération des habitats :", error));
  }, []);

  // Ajouter un rapport vétérinaire
  const handleAddReport = () => {
    if (selectedAnimal && report) {
      const newReport = {
        animal_id: selectedAnimal,
        commentaire: report,
        date: new Date().toISOString().split('T')[0]
      };

      axios.post("http://localhost:5001/api/rapports-veterinaires", newReport)
        .then(() => {
          alert("Rapport ajouté avec succès.");
          setReport("");
          setSelectedAnimal(null);
        })
        .catch(error => console.error("Erreur lors de l'ajout du rapport :", error));
    }
  };

  // Ajouter un commentaire sur un habitat
  const handleAddHabitatComment = () => {
    if (selectedHabitat && habitatComment) {
      const newComment = {
        habitat_id: selectedHabitat,
        commentaire: habitatComment,
        date: new Date().toISOString().split('T')[0]
      };

      axios.post("http://localhost:5001/api/habitats/commentaires", newComment)
        .then(() => {
          alert("Commentaire ajouté sur l'habitat avec succès.");
          setHabitatComment("");
          setSelectedHabitat(null);
        })
        .catch(error => console.error("Erreur lors de l'ajout du commentaire sur l'habitat :", error));
    }
  };

  return (
    <Container fluid>
      <h1 className="text-center my-4">Dashboard Vétérinaire</h1>

      {/* Ajouter un rapport vétérinaire */}
      <Row className="mb-5">
        <Col md={6}>
          <h2>Ajouter un Rapport Vétérinaire</h2>
          <Form>
            <Form.Group className="mb-3">
              <Form.Label>Choisir un Animal</Form.Label>
              <Form.Select value={selectedAnimal || ""} onChange={(e) => setSelectedAnimal(e.target.value)}>
                <option value="" disabled>Choisir un animal</option>
                {animals.map((animal) => (
                  <option key={animal.animal_id} value={animal.animal_id}>
                    {animal.prenom} - {animal.nom}
                  </option>
                ))}
              </Form.Select>
            </Form.Group>

            <Form.Group className="mb-3">
              <Form.Label>Détail du Rapport</Form.Label>
              <Form.Control
                as="textarea"
                placeholder="Entrer le rapport de l'animal"
                value={report}
                onChange={(e) => setReport(e.target.value)}
                rows={3}
              />
            </Form.Group>

            <Button variant="primary" onClick={handleAddReport}>
              Ajouter le Rapport
            </Button>
          </Form>
        </Col>
      </Row>

      {/* Consulter la consommation alimentaire */}
      <Row className="mb-5">
        <Col md={12}>
          <h2>Consommation Alimentaire des Animaux</h2>
          <Table striped bordered hover responsive>
            <thead>
              <tr>
                <th>Prénom</th>
                <th>Nourriture</th>
                <th>Grammage (kg)</th>
              </tr>
            </thead>
            <tbody>
              {animals.map((animal) => (
                <tr key={animal.animal_id}>
                  <td>{animal.prenom}</td>
                  <td>{animal.nourriture}</td>
                  <td>{animal.grammage}</td>
                </tr>
              ))}
            </tbody>
          </Table>
        </Col>
      </Row>

      {/* Ajouter un commentaire sur un habitat */}
      <Row className="mb-5">
        <Col md={6}>
          <h2>Commenter un Habitat</h2>
          <Form>
            <Form.Group className="mb-3">
              <Form.Label>Choisir un Habitat</Form.Label>
              <Form.Select value={selectedHabitat || ""} onChange={(e) => setSelectedHabitat(e.target.value)}>
                <option value="" disabled>Choisir un habitat</option>
                {habitats.map((habitat) => (
                  <option key={habitat.habitat_id} value={habitat.habitat_id}>
                    {habitat.nom}
                  </option>
                ))}
              </Form.Select>
            </Form.Group>

            <Form.Group className="mb-3">
              <Form.Label>Commentaire sur l'Habitat</Form.Label>
              <Form.Control
                as="textarea"
                placeholder="Ajouter un commentaire sur l'habitat"
                value={habitatComment}
                onChange={(e) => setHabitatComment(e.target.value)}
                rows={3}
              />
            </Form.Group>

            <Button variant="primary" onClick={handleAddHabitatComment}>
              Ajouter le Commentaire
            </Button>
          </Form>
        </Col>
      </Row>
    </Container>
  );
};

export default VetDashboard;

CREATE DATABASE IF NOT EXISTS zoo_arcadia;
USE zoo_arcadia;

-- Table des rôles
CREATE TABLE IF NOT EXISTS role (
    role_id INT PRIMARY KEY AUTO_INCREMENT,
    nom VARCHAR(50) NOT NULL
);

-- Table des habitats
CREATE TABLE IF NOT EXISTS habitat (
    habitat_id INT PRIMARY KEY AUTO_INCREMENT,
    nom VARCHAR(50) NOT NULL,
    description TEXT,
    commentaire_habitat TEXT
);

-- Table des animaux
CREATE TABLE IF NOT EXISTS animal (
    animal_id INT PRIMARY KEY AUTO_INCREMENT,
    prenom VARCHAR(50) NOT NULL,
    nom VARCHAR(50),
    description TEXT,
    etat VARCHAR(50),
    race_id INT,
    habitat_id INT,
    FOREIGN KEY (habitat_id) REFERENCES habitat(habitat_id)
);

-- Table des utilisateurs
CREATE TABLE IF NOT EXISTS utilisateur (
    utilisateur_id INT PRIMARY KEY AUTO_INCREMENT,
    email VARCHAR(100) NOT NULL UNIQUE,
    mot_de_passe VARCHAR(255) NOT NULL,
    role_id INT,
    FOREIGN KEY (role_id) REFERENCES role(role_id)
);

-- Table des services
CREATE TABLE IF NOT EXISTS service (
    service_id INT PRIMARY KEY AUTO_INCREMENT,
    nom VARCHAR(50) NOT NULL,
    description TEXT
);

-- Table des soins vétérinaires
CREATE TABLE IF NOT EXISTS soins_veterinaires (
    soins_id INT PRIMARY KEY AUTO_INCREMENT,
    animal_id INT NOT NULL,
    etat VARCHAR(100) NOT NULL,
    commentaire TEXT,
    date_passage DATE NOT NULL,
    FOREIGN KEY (animal_id) REFERENCES animal(animal_id)
);

-- Table des avis des visiteurs
CREATE TABLE IF NOT EXISTS avis (
    avis_id INT PRIMARY KEY AUTO_INCREMENT,
    pseudo VARCHAR(50) NOT NULL,
    commentaire TEXT NOT NULL,
    is_validated BOOLEAN DEFAULT FALSE
);

-- Table de la nourriture donnée aux animaux (par les employés)
CREATE TABLE IF NOT EXISTS alimentation (
    alimentation_id INT PRIMARY KEY AUTO_INCREMENT,
    animal_id INT NOT NULL,
    type_nourriture VARCHAR(50) NOT NULL,
    quantite INT NOT NULL,
    date_don DATE NOT NULL,
    heure_don TIME NOT NULL,
    FOREIGN KEY (animal_id) REFERENCES animal(animal_id)
);

-- Insérer des rôles prédéfinis
INSERT INTO role (nom) VALUES ('Administrateur'), ('Vétérinaire'), ('Employé'), ('Visiteur');

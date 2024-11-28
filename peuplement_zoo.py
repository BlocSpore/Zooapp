import mysql.connector

# Connexion à la base de données MySQL
db = mysql.connector.connect(
    host="localhost",
    user="zooapp_user",
    password="Lapatate.12",
    database="zoo_arcadia"
)

cursor = db.cursor()

# Insertion des habitats
habitats = [
    ("Savane", "Un grand espace ouvert avec de l'herbe haute et des arbres épars."),
    ("Marais", "Zone humide avec beaucoup d'eau stagnante et de végétation."),
    ("Jungle", "Région dense avec beaucoup d'arbres, de végétation et de biodiversité.")
]

for habitat in habitats:
    cursor.execute("INSERT INTO habitat (nom, description) VALUES (%s, %s)", habitat)

# Récupérer les IDs des habitats insérés
cursor.execute("SELECT habitat_id, nom FROM habitat")
habitat_ids = {nom: habitat_id for habitat_id, nom in cursor.fetchall()}

# Insertion des animaux dans chaque habitat
animaux = [
    ("Lion", "Savane", "Roi de la savane, carnivore et puissant."),
    ("Girafe", "Savane", "Grand mammifère herbivore au long cou."),
    ("Crocodile", "Marais", "Prédateur vivant dans les zones humides, carnivore."),
    ("Grenouille", "Marais", "Petit amphibien, se trouve souvent dans les zones humides."),
    ("Tigre", "Jungle", "Grand félin carnivore, prédateur redoutable."),
    ("Singe", "Jungle", "Animal intelligent et social, omnivore.")
]

for animal in animaux:
    nom, habitat_nom, description = animal
    habitat_id = habitat_ids.get(habitat_nom)
    if habitat_id:
        cursor.execute(
            "INSERT INTO animal (nom, habitat_id, description) VALUES (%s, %s, %s)",
            (nom, habitat_id, description)
        )

# Valider les modifications
db.commit()

# Fermeture de la connexion
cursor.close()
db.close()

print("Les habitats et animaux ont été insérés avec succès dans la base de données.")

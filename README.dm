# Library Management System

Ce projet est un système de gestion de bibliothèque (gestion de livres uniquement ) basé sur une architecture client-serveur avec un frontend HTML/CSS/JavaScript et un backend FastAPI avec une base de données MySQL.
l'application plus exactement gère une collection de livres. Les utilisateurs peuvent ajouter des livres à la bibliothèque, modifier leurs informations, ou les supprimer et bien sûr voire la liste des livres 

## Prérequis

Avant d'exécuter ce projet, assurez-vous d'avoir installé les éléments suivants :

- **Docker** : [Télécharger Docker](https://www.docker.com/get-started)
- **Docker Compose** : Inclus avec Docker Desktop.

### Python Dependencies (Backend)
Les dépendances nécessaires pour le backend sont listées dans le fichier `requirements.txt` et incluent :

- `fastapi==0.109.2`
- `uvicorn==0.27.1`
- `sqlalchemy==2.0.27`
- `psycopg2-binary==2.9.9`
- `python-dotenv==1.0.0`
- `pymysql==1.0.3`
- `python-multipart==0.0.9`

### Frontend Dependencies
Les dépendances frontend sont incluses dans le projet sous forme de fichiers HTML, CSS et JavaScript.

## Étapes pour exécuter l'application

1. **Cloner le dépôt** :
   ```bash
   git clone <URL_DU_REPO>
   cd <Dossier du projet>

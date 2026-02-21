# Task Todo (Flask + JS)
Petite application Flask/JavaScript pour créer, modifier et supprimer des tâches via une API locale.

## Démarrage rapide (Linux / macOS / Windows)
1. Clone ou récupère le dépôt, puis place-toi à la racine du projet.
2. Crée un environnement virtuel Python dans le dossier courant :
	- Linux / macOS :
	  ```bash
	  python3 -m venv .env
	  ```
	- Windows (PowerShell) :
	  ```powershell
	  python -m venv .env
	  ```
3. Active l'environnement virtuel :
	- Linux / macOS :
	  ```bash
	  source .env/bin/activate
	  ```
	- Windows (PowerShell) :
	  ```powershell
	  .\.env\Scripts\Activate.ps1
	  ```
4. Installe les dépendances :
	```bash
	pip install -r requirements.txt
	```
5. Lance le serveur Flask depuis la racine (le fichier `.flaskenv` définit déjà `FLASK_APP=todo`) :
	```bash
	flask run
	```
6. Ouvre le site : http://127.0.0.1:5000/ (ou http://localhost:5000/).

## Arborescence du projet
```
JavaScript_Task_TP
├─ README.md
├─ requirements.txt
├─ .flaskenv
├─ .env/               # Environnement virtuel (créé après étape 2)
├─ json/
├─ todo/
│  ├─ __init__.py
│  ├─ app.py
│  ├─ models.py
│  ├─ views.py
│  ├─ templates/
│  │  └─ todoacompleter.html
│  ├─ css/
│  │  └─ flex.css
│  ├─ js/
│  │  └─ todo.js
│  └─ img/
│     ├─ logoiut.png
│     ├─ new.png
│     ├─ delete.png
│     └─ save.png
└─ __MACOSX/           # Artefacts macOS, sans impact sur l'appli
```

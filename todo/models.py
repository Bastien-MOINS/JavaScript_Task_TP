import json
from pathlib import Path


_DEFAULT_TASKS = [
    {
        'id': 1,
        'title': 'Courses',
        'description': 'Salade , Oignons , Pommes , Clementines',
        'done': True,
    },
    {
        'id': 2,
        'title': 'Apprendre REST',
        'description': 'Apprendre mon cours et comprendre les exemples',
        'done': False,
    },
    {
        'id': 3,
        'title': 'Apprendre Ajax',
        'description': 'Revoir les exemples et ecrire un client REST JS avec Ajax',
        'done': False,
    },
]


DATA_DIR = Path(__file__).resolve().parent.parent / 'json'
TASKS_FILE = DATA_DIR / 'tasks.json'


def _ensure_store():
    DATA_DIR.mkdir(parents=True, exist_ok=True)


def load_tasks():
    if TASKS_FILE.exists():
        try:
            with TASKS_FILE.open('r', encoding='utf-8') as file:
                data = file.read().strip()
                if not data:
                    raise ValueError("empty tasks file")
                return json.loads(data)
        except (json.JSONDecodeError, ValueError):
            # Fichier vide ou corrompu : on restaure les tâches par défaut
            _ensure_store()
            with TASKS_FILE.open('w', encoding='utf-8') as file:
                json.dump(_DEFAULT_TASKS, file, ensure_ascii=True, indent=2)
            return [task.copy() for task in _DEFAULT_TASKS]

    _ensure_store()
    with TASKS_FILE.open('w', encoding='utf-8') as file:
        json.dump(_DEFAULT_TASKS, file, ensure_ascii=True, indent=2)
    return [task.copy() for task in _DEFAULT_TASKS]


def save_tasks(current_tasks):
    _ensure_store()
    with TASKS_FILE.open('w', encoding='utf-8') as file:
        json.dump(current_tasks, file, ensure_ascii=True, indent=2)


tasks = load_tasks()
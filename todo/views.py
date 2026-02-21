from flask import jsonify , abort , make_response , request , url_for, render_template, redirect
from .app import app
from .models import load_tasks as tasks, save_tasks


def _renumber(task_list):
    for idx, task in enumerate(task_list, start=1):
        task['id'] = idx
    return task_list

@app.route('/')
def accueil():
    return redirect(url_for("get_tasks"))

@app.route('/todo/api/v1.0/tasks', methods=['GET'])
def get_tasks():
    return render_template("todoacompleter.html", tasks=tasks())


@app.route('/todo/api/v1.0/tasks/data', methods=['GET'])
def get_tasks_data():
    return jsonify({'tasks': tasks()})

@app.route('/todo/api/v1.0/tasks/<int:task_id>', methods=['GET'])
def get_task(task_id) :
    for task in tasks():
        if task['id'] == task_id:
            return jsonify({'task':task})
    return abort(404)

def make_public_task(task):
    new_task = {}
    for field in task :
        if field == 'id':
            new_task['uri'] = url_for('get_task', task_id = task ['id'], _external = True)
        else:
            new_task[field] = task[field]
    return new_task

# Name: Content-Type Value: application/json 
@app.route ('/todo/api/v1.0/tasks', methods = ['POST'])
def create_task():
# vérification des données reçues
    if not request.json or not 'title' in request.json or not 'description' in request.json:
        return abort(400)
    # construction de la nouvelle tâche
    tasks_list = tasks()
    new_id = max((t.get('id', 0) for t in tasks_list), default=0) + 1
    task = {
        'id': new_id ,
        'title':request.json['title'],
        'description': request.json.get('description', ""),
        'done':request.json.get('done',False),
}
    # ajout de la nouvelle tâche aux tâches existantes
    tasks_list.append(task)
    save_tasks(tasks_list)
    # retour de la nouvelle tâche avec son uri 201 indique qu 'une ressource a été créée
    return jsonify ({'task':make_public_task(task)}), 201

@app.route('/todo/api/v1.0/tasks/<int:task_id>', methods=['PUT'])
def update_task(task_id):
    # Recherche de la tâche à modifier avec son id
    tasks_list = tasks()
    task = next((t for t in tasks_list if t['id'] == task_id), None)
    if task is None:
        abort(404)
    else:
        # La requête doit être JSON
        if not request.is_json:
            abort(400)
        data = request.get_json()
        
        if data is None:
            abort(400)
        # Vérification des types
        if 'title' in data and not isinstance(data['title'], str):
            abort(400)
        if 'description' in data and not isinstance(data['description'], str):
            abort(400)
        if 'done' in data and not isinstance(data['done'], bool):
            abort(400)
    
        # Modification des champs de la tâche
        task['title'] = data.get('title', task['title'])
        task['description'] = data.get('description', task['description'])
        task['done'] = data.get('done', task['done'])

        save_tasks(tasks_list)
    
        # Retour de la tâche modifiée
        return jsonify({'task': make_public_task(task)})

@app.route('/todo/api/v1.0/tasks/<int:task_id>', methods=['DELETE'])
def delete_task(task_id):
    # Recherche de la tâche à supprimer avec son id
    tasks_list = tasks()
    task = next((t for t in tasks_list if t['id'] == task_id), None)
    if task is None:
        abort(404)
    else:
        tasks_list.remove(task)
        save_tasks(_renumber(tasks_list))
        return jsonify({'status': "deleted"})
    

@app.route('/todo/api/v1.0/tasks', methods=['DELETE'])
def delete_tasks():
    save_tasks([])
    return jsonify({'status': "all deleted"})

@app.errorhandler(404)
def not_found(error):
    return make_response(jsonify({'error':'Not found'}),404)

@app.errorhandler(400)
def bad_request (error) :
    return make_response(jsonify({'error':'Bad request'}),400)

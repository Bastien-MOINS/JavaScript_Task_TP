window.addEventListener('DOMContentLoaded', () => {
    //On récupère d'abord tout les élements avec laquelle nous aurons des interactions
    const button = document.getElementById('button');
    const add = document.getElementById('add');
    const del = document.getElementById('del');
    const tasksContainer = document.getElementById('taches');
    const currentSection = document.getElementById('currenttask');
    currentSection.innerHTML = '';

    /**
     * Fonction asynchrone permettant de mettre à jour le json avec des tâches déjà existant (PUT)
     * @param {int} id
     * @param {string} title
     * @param {string} description
     * @param {boolean} done
     * @returns Le nouveau json modifié
     */
    async function updateTask(id, title, description, done){
        const response = await fetch(`/todo/api/v1.0/tasks/${id}`, {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ title, description, done }),
        });

        if (!response.ok) {
            throw new Error(`Erreur serveur ${response.status}`);
        }

        return response.json();
    }
    /**
     * Fonction qui déplace une tâche existante dans la section current
     * @param {json} task 
     * @param {HTMLElement} section 
     */
    function taskToCurrent(task, section){
        if (section.innerHTML !== ''){
            if (!confirm("Une tâche est en cours, écraser le formulaire ?")){
                return;
            }
        }

        section.innerHTML = '';
        section.className = `${task.id}`;

        const labelNom = document.createElement('label');
        labelNom.textContent = 'Titre';
        const inputNom = document.createElement('input');
        inputNom.type = 'text';
        inputNom.value = task.title;

        const labelDef = document.createElement('label');
        labelDef.textContent = 'Description';
        const inputDef = document.createElement('input');
        inputDef.type = 'text';
        inputDef.value = task.description;

        const labelDone = document.createElement('label');
        labelDone.textContent = 'Tâche effectuée';
        const doneTask = document.createElement('input');
        doneTask.type = 'checkbox';
        doneTask.checked = Boolean(task.done);

        const buttonValid = document.createElement('button');
        buttonValid.textContent = 'Mettre à jour';

        buttonValid.addEventListener('click', async (e) => {
            e.preventDefault();

            const title = inputNom.value.trim();
            const description = inputDef.value.trim();
            const done = doneTask.checked;

            if (!title || !description) {
                alert('Titre et description sont requis');
                return;
            }

            try {
                await updateTask(task.id, title, description, done);
                await fetchTasks();
                section.innerHTML = '';
                section.className = '';
            } catch (err) {
                console.error(err);
                alert('Envoi impossible');
            }
        });

        section.appendChild(labelNom);
        section.appendChild(inputNom);
        section.appendChild(labelDef);
        section.appendChild(inputDef);
        section.appendChild(labelDone);
        section.appendChild(doneTask);
        section.appendChild(buttonValid);
    }
    /**
     * Fonction qui affiche chaque tâche existante du json pour l'afficher dans le tasksContainer
     * @param {list} list 
     */
    function renderTasks(list) {
        tasksContainer.innerHTML = '';
        if (!list.length) {
            tasksContainer.textContent = 'Aucune tâche.';
            return;
        }

        list.forEach((task) => {
            const item = document.createElement('div');
            item.className = 'task';
            const checkbox = document.createElement('input');
            checkbox.type = 'checkbox';
            checkbox.checked = task.done;
            item.appendChild(checkbox)
            item.textContent = `${task.title} — ${task.description}`;
            item.dataset.id = task.id;
            tasksContainer.appendChild(item);
            item.addEventListener('click', () => taskToCurrent(task, currentSection));
        });
    }

    /**
     * Fonction asynchrone qui charge les tâches du json pour pouvoir les afficher via renderTasks()
     */
    async function fetchTasks() {
        try {
            const response = await fetch('/todo/api/v1.0/tasks/data');
            if (!response.ok) {
                throw new Error(`Erreur serveur ${response.status}`);
            }
            const data = await response.json();
            renderTasks(data.tasks || []);
        } catch (err) {
            console.error(err);
            tasksContainer.textContent = 'Impossible de charger les tâches.';
        }
    }
    
    /**
     * Fonction asynchrone ajoutant une tâche enregistré au json (POST)
     * @param {string} title 
     * @param {string} description 
     * @param {boolean} done 
     * @returns retourne le nouveau fichier json avec les nouvelles informations
     */
    async function createTask(title, description, done) {
        const response = await fetch('/todo/api/v1.0/tasks', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ title, description, done }),
        });

        if (!response.ok) {
            throw new Error(`Erreur serveur ${response.status}`);
        }

        return response.json();
    }

    /**
     * Fonction qui ajoute une tâche dans la section courante après avoir appuyer sur le bouton +
     * @param {HTMLElement} section
     */
    function createEmptyTask(section) {
        if (section.innerHTML!=''){
            if (!confirm("Une tâche est en cours, voulez-vous l'écraser?")){
                return;
            }
        }
        section.innerHTML = '';
        section.className = '';
        const labelNom = document.createElement('label');
        labelNom.textContent = 'Titre';
        const inputNom = document.createElement('input');
        inputNom.type = 'text';

        const labelDef = document.createElement('label');
        labelDef.textContent = 'Description';
        const inputDef = document.createElement('input');
        inputDef.type = 'text';

        const labelDone = document.createElement('label');
        labelDone.textContent = 'Tâche effectuée';
        const doneTask = document.createElement('input');
        doneTask.type = 'checkbox';

        const buttonValid = document.createElement('button');
        buttonValid.textContent = 'Créer';

        buttonValid.addEventListener('click', async (e) => {
            e.preventDefault();

            const title = inputNom.value.trim();
            const description = inputDef.value.trim();
            const done = doneTask.checked;

            if (!title || !description) {
                alert('Titre et description sont requis');
                return;
            }

            try {
                await createTask(title, description, done);
                await fetchTasks();
                section.innerHTML = '';
            } catch (err) {
                console.error(err);
                alert('Envoi impossible');
            }
        });

        section.appendChild(labelNom);
        section.appendChild(inputNom);
        section.appendChild(labelDef);
        section.appendChild(inputDef);
        section.appendChild(labelDone);
        section.appendChild(doneTask);
        section.appendChild(buttonValid);
    }

    /**
     * Fonction asynchrone supprimant la tâche sélectionner (celle du currentSection) via son id (DELETE)
     * @param {int} id 
     * @returns le nouveau json avec la tâche supprimé
     */
    async function deleteTask(id){
        const response = await fetch(`/todo/api/v1.0/tasks/${id}`, {
            method: 'DELETE'
        });

        if (!response.ok) {
            throw new Error(`Erreur serveur ${response.status}`);
        }

        return response.json();
    }

    /**
     * Supprime la tâche qui est dans la currentSection
     * @param {HTMLElement} section
     */
    function deleteCurrentTask(section){
        if (section.innerHTML == ''){
            alert('Aucune tâche n\'à été créer ou sélectionner. Impossible de supprimer!')
            return;
            }
        section.innerHTML = '';
        if (section.className != ''){
            const id = parseInt(section.className, 10);
            deleteTask(id);
        }
        return;
    }

    button.addEventListener('click', (e) => {
        e.preventDefault();
        fetchTasks();
    });

    add.addEventListener('click', (e) => {
        e.preventDefault();
        createEmptyTask(currentSection);
    });

    del.addEventListener('click', (e) => {
        e.preventDefault();
        deleteCurrentTask(currentSection);
    })
});
document.addEventListener('DOMContentLoaded', function() {
	var editButtons, saveButtons, deleteButtons;
	var taskList = document.getElementById('taskList');
	taskList.innerHTML +=
		'<table id="tasks" class="table table-hover table-bordered table-striped"><thead><tr><th>name</th><th>status</th><th>controls</th></tr></thead><tbody></tbody></table>';
	var tasks = document.getElementById('tasks');
	initData();

	function initData() {
		var xhr = new XMLHttpRequest();
		xhr.open('GET', 'http://localhost:2403/tasks');
		xhr.onreadystatechange = function() {
			if (xhr.readyState == 4) {
				if (xhr.status == 200) {
					var data = JSON.parse(xhr.responseText);
					data.forEach(function(elem, i, arr) {
						tasks.tBodies[0].innerHTML +=
							'<tr><td><p class="taskName">' +
							elem.name +
							'</p></td><td><input class="status" status=' +
							elem.completed +
							' type="checkbox"></td><td><button class="edit">edit</button><button class="save" task-id="' +
							elem.id +
							'">save</button><button class="delete" task-id="' +
							elem.id +
							'">delete</button></td></tr>';
					});
					setStatus();
					initButtons();
				}
			}
		};
		xhr.send();
	}

	function setStatus() {
		var statuses = document.getElementsByClassName('status');
		for (var i = 0; i < statuses.length; i++) {
			if (statuses[i].getAttribute('status') == 'true') {
				statuses[i].checked = true;
			}
		}
	}
	var addNew = document.getElementById('addNew');

	addNew.onclick = function() {
		var taskName = document.getElementById('newTaskName').value;
		var taskStatus = document.getElementById('newTaskStatus').checked;

		var dataToSend = JSON.stringify({ name: taskName, completed: taskStatus });

		var xhr = new XMLHttpRequest();
		xhr.open('POST', 'http://localhost:2403/tasks');
		xhr.setRequestHeader('Content-type', 'application/json');

		xhr.onreadystatechange = function() {
			if (xhr.readyState == 4) {
				if (xhr.status == 200) {
					document.getElementById('newTaskName').value = '';
					document.getElementById('newTaskStatus').checked = false;
					var data = JSON.parse(xhr.responseText);
					tasks.tBodies[0].innerHTML +=
						'<tr><td><p class="taskName">' +
						data.name +
						'</p></td><td><input class="status" status=' +
						data.completed +
						' type="checkbox"></td><td><button class="edit">edit</button><button class="save" task-id="' +
						data.id +
						'">save</button><button class="delete" task-id="' +
						data.id +
						'">delete</button></td></tr>';
					setStatus();
					initButtons();
				}
			}
		};
		xhr.send(dataToSend);
	};

	function initButtons() {
		saveButtons = document.getElementsByClassName('save');
		editButtons = document.getElementsByClassName('edit');
		deleteButtons = document.getElementsByClassName('delete');
		for (var i = 0; i < saveButtons.length; i++) {
			saveButtons[i].onclick = saveAction;
			editButtons[i].onclick = editAction;
			deleteButtons[i].onclick = deleteAction;
		}
	}

	function saveAction(e) {
		var row = e.target.parentElement.parentElement;
		var task = row.querySelector('.taskName');
		var taskValue = row.querySelector('.taskName').innerHTML;
		var taskStatus = row.querySelector('.status').checked;
		var id = e.target.getAttribute('task-id');
		task.removeAttribute('contenteditable');
		var dataToSend = JSON.stringify({ name: taskValue, completed: taskStatus });
		task.style.backgroundColor = 'transparent';
		var xhr = new XMLHttpRequest();
		xhr.open('PUT', 'http://localhost:2403/tasks/' + id);
		xhr.setRequestHeader('Content-type', 'application/json');

		xhr.onreadystatechange = function() {
			if (xhr.readyState == 4) {
				if (xhr.status == 200) {
					// initData();
				}
			}
		};
		xhr.send(dataToSend);
	}
	function editAction(e) {
		var row = e.target.parentElement.parentElement;
		var task = row.querySelector('.taskName');
		task.setAttribute('contenteditable', 'true');
		task.style.backgroundColor = '#fff';
	}
	function deleteAction(e) {
		var row = e.target.parentElement.parentElement;
		var id = e.target.getAttribute('task-id');
		var xhr = new XMLHttpRequest();
		xhr.open('DELETE', 'http://localhost:2403/tasks/' + id);
		xhr.setRequestHeader('Content-type', 'application/json');

		xhr.onreadystatechange = function() {
			if (xhr.readyState == 4) {
				if (xhr.status == 200) {
					tasks.tBodies[0].removeChild(row);
				}
			}
		};
		xhr.send();
	}
});

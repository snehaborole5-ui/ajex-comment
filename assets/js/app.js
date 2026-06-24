const cl = console.log;

// Selectors
const spinner = document.getElementById('spinner');
const commentContainer = document.getElementById('commentContainer');
const commentForm = document.getElementById('commentForm');

const nameControl = document.getElementById('name');
const emailControl = document.getElementById('email');
const bodyControl = document.getElementById('body'); // 
const userIdControl = document.getElementById('userId');

const addCommentBtn = document.getElementById('addCommentBtn');
const updateCommentBtn = document.getElementById('updateCommentBtn');

const BASE_URL = `https://jsonplaceholder.typicode.com`;
const COMMENT_URL = `${BASE_URL}/comments`;

let commentsArr = [];
let updateId = null;

function snackbar(msg, icon) {
    Swal.fire({
        title: msg,
        icon: icon,
        timer: 3000
    });
}

function fetchComments() {
    spinner.style.display = 'flex';
    let xhr = new XMLHttpRequest();
    xhr.open('GET', COMMENT_URL);
    xhr.send(null);

    xhr.onload = function () {
        spinner.style.display = 'none';
        if (xhr.status >= 200 && xhr.status <= 299) {
            let data = JSON.parse(xhr.response);
            commentsArr = [...data]; 
            
            renderCommentRows(commentsArr.reverse());
        } else {
            snackbar('Error while fetching the comments data!', 'error');
        }
    };
    xhr.onerror = function() {
        spinner.style.display = 'none';
        snackbar('Network Error!', 'error');
    };
}

function renderCommentRows(arr) {
    let result = '';
    arr.forEach(comment => {
        
        let displayUserId = comment.userId || Math.floor(Math.random() * 10) + 1;
            
        result += `
            <tr id='comment-${comment.id}'>
                <td>${comment.id}</td>
                <td><strong>ID: ${displayUserId}</strong></td>
                <td>${comment.name}</td>
                <td><a href="mailto:${comment.email}">${comment.email}</a></td>
                <td>${comment.body}</td>
                <td class="text-center">
                    <button onclick="onEdit('${comment.id}')" class="btn-action btn-edit-icon">
                        <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"></path><path d="M18.5 2.5a2.121 2.121 0 1 1 3 3L12 15l-4 1 1-4 9.5-9.5z"></path></svg>
                    </button>
                </td>
                <td class="text-center">
                    <button onclick="onRemove('${comment.id}')" class="btn-action btn-remove-icon">
                        <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polyline points="3 6 5 6 21 6"></polyline><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path><line x1="10" y1="11" x2="10" y2="17"></line><line x1="14" y1="11" x2="14" y2="17"></line></svg>
                    </button>
                </td>
            </tr>
        `;
    });
    commentContainer.innerHTML = result;
}


function onCommentSubmit(eve) {
    eve.preventDefault();

    let COMMENT_OBJ = {
        name: nameControl.value,
        email: emailControl.value,
        body: bodyControl.value,
        userId: userIdControl.value
    };

    spinner.style.display = 'flex';
    let xhr = new XMLHttpRequest();
    xhr.open('POST', COMMENT_URL);
    xhr.setRequestHeader('Content-Type', 'application/json; charset=UTF-8');
    xhr.send(JSON.stringify(COMMENT_OBJ));

    xhr.onload = function () {
        spinner.style.display = 'none';
        if (xhr.status >= 200 && xhr.status <= 299) {
            let res = JSON.parse(xhr.response);
            
            
            res.name = res.name || COMMENT_OBJ.name;
            res.email = res.email || COMMENT_OBJ.email;
            res.body = res.body || COMMENT_OBJ.body;
            res.userId = res.userId || COMMENT_OBJ.userId;

            commentForm.reset();

            let tr = document.createElement('tr');
            tr.id = `comment-${res.id}`;

            tr.innerHTML = `
                <td>${res.id}</td>
                <td><strong>ID: ${res.userId}</strong></td>
                <td>${res.name}</td>
                <td><a href="mailto:${res.email}">${res.email}</a></td>
                <td>${res.body}</td>
                <td class="text-center">
                    <button onclick="onEdit('${res.id}')" class="btn-action btn-edit-icon">
                        <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"></path><path d="M18.5 2.5a2.121 2.121 0 1 1 3 3L12 15l-4 1 1-4 9.5-9.5z"></path></svg>
                    </button>
                </td>
                <td class="text-center">
                    <button onclick="onRemove('${res.id}')" class="btn-action btn-remove-icon">
                        <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polyline points="3 6 5 6 21 6"></polyline><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path><line x1="10" y1="11" x2="10" y2="17"></line><line x1="14" y1="11" x2="14" y2="17"></line></svg>
                    </button>
                </td>
            `;
            commentContainer.insertBefore(tr, commentContainer.firstChild);
            snackbar(`New comment with id ${res.id} created successfully !!!`, 'success');
        }
    };
}


function onEdit(id) {
    updateId = id;
    let EDIT_URL = `${BASE_URL}/comments/${updateId}`;

    spinner.style.display = 'flex';
    let xhr = new XMLHttpRequest();
    xhr.open('GET', EDIT_URL);
    xhr.send(null);

    xhr.onload = function () {
        spinner.style.display = 'none';
        if (xhr.status >= 200 && xhr.status <= 299) {
            let res = JSON.parse(xhr.response);
            nameControl.value = res.name;
            emailControl.value = res.email;
            bodyControl.value = res.body;
            userIdControl.value = res.userId || 1;

            addCommentBtn.classList.add('d-none');
            updateCommentBtn.classList.remove('d-none');
            
            window.scrollTo({ top: 0, behavior: 'smooth' });
        }
    };
}


function onUpdateComment() {
    let UPDATE_OBJ = {
        name: nameControl.value,
        email: emailControl.value,
        body: bodyControl.value,
        userId: userIdControl.value
    };

    spinner.style.display = 'flex';
    let UPDATE_URL = `${BASE_URL}/comments/${updateId}`;

    let xhr = new XMLHttpRequest();
    xhr.open('PATCH', UPDATE_URL);
    xhr.setRequestHeader('Content-Type', 'application/json; charset=UTF-8');
    xhr.send(JSON.stringify(UPDATE_OBJ));

    xhr.onload = function () {
        spinner.style.display = 'none';
        if (xhr.status >= 200 && xhr.status <= 299) {
            let row = document.getElementById(`comment-${updateId}`);
            if(row) {
                let cells = row.getElementsByTagName('td');
                
                cells[1].innerHTML = `<strong>ID: ${UPDATE_OBJ.userId}</strong>`;
                cells[2].innerHTML = UPDATE_OBJ.name;
                cells[3].innerHTML = `<a href="mailto:${UPDATE_OBJ.email}">${UPDATE_OBJ.email}</a>`;
                cells[4].innerHTML = UPDATE_OBJ.body;
                
                row.scrollIntoView({ behavior: 'smooth', block: 'center' });
                row.classList.add('highlight');
                setTimeout(() => { row.classList.remove('highlight'); }, 3000);
            }

            commentForm.reset();

            updateId = null;
            addCommentBtn.classList.remove('d-none');
            updateCommentBtn.classList.add('d-none');
            snackbar('Comment updated successfully !!!', 'success');
        }
    };
}


function onRemove(id) {
    Swal.fire({
        title: 'Are you sure?',
        text: 'Do you want to remove this comment?',
        icon: 'warning',
        showCancelButton: true,
        confirmButtonText: 'Yes, Remove'
    }).then(result => {
        if (result.isConfirmed) {
            spinner.style.display = 'flex';
            let REMOVE_URL = `${BASE_URL}/comments/${id}`;

            let xhr = new XMLHttpRequest();
            xhr.open('DELETE', REMOVE_URL);
            xhr.send(null);

            xhr.onload = function () {
                spinner.style.display = 'none';
                if (xhr.status >= 200 && xhr.status <= 299) {
                    let row = document.getElementById(`comment-${id}`);
                    if(row) row.remove();
                    snackbar('Comment removed successfully !!!', 'success');
                }
            };
        }
    });
}

fetchComments();


commentForm.addEventListener('submit', onCommentSubmit);
updateCommentBtn.addEventListener('click', onUpdateComment);
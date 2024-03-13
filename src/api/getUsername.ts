import fetch from '@api/fetch';

function getUsername() {
    return fetch('me', { method: 'GET' })
    .then(response => response.json());
}

function getUsernameJSON() {
    return fetch('me', { method: 'GET' });
}

export {getUsername as default, getUsernameJSON};

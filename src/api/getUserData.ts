import fetch from '@api/fetch';

function getUserData() {
    return fetch('me', { method: 'GET' })
    .then(response => response.json());
}

export default getUserData;

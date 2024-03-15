import fetch from '@api/fetch';

async function getUserData() {
    const response = await fetch('me', {method: 'GET'});
    return await response.json();
}

export default getUserData;

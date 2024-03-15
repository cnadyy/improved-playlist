import fetch from '@api/fetch';

async function getUserData() {
    return await fetch('me', {method: 'GET'});
}

export default getUserData;

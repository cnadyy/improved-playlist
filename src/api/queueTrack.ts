import spotifyFetch from '@api/fetch';

function queueTrack(trackID: string) {
  return spotifyFetch(`me/player/queue?uri=${trackID}`, {
    method: 'POST'
  })
}

export default queueTrack;

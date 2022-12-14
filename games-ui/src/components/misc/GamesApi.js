import axios from 'axios'
import { config } from '../../Constants'

export const gamesApi = {
  getgames,
  getMovie,
  saveMovie,
  deleteMovie,
  addMovieComment,
  getUserExtrasMe,
  saveUserExtrasMe
}

function getgames() {
  return instance.get('/api/games')
}

function getMovie(appId) {
  return instance.get(`/api/games/${appId}`)
}

function saveMovie(movie, token) {
  return instance.post('/api/games', movie, {
    headers: {
      'Content-type': 'application/json',
      'Authorization': bearerAuth(token)
    }
  })
}

function deleteMovie(appId, token) {
  return instance.delete(`/api/games/${appId}`, {
    headers: { 'Authorization': bearerAuth(token) }
  })
}

function addMovieComment(appId, comment, token) {
  return instance.post(`/api/games/${appId}/comments`, comment, {
    headers: {
      'Content-type': 'application/json',
      'Authorization': bearerAuth(token)
    }
  })
}

function getUserExtrasMe(token) {
  return instance.get(`/api/userextras/me`, {
    headers: { 'Authorization': bearerAuth(token) }
  })
}

function saveUserExtrasMe(token, userExtra) {
  return instance.post(`/api/userextras/me`, userExtra, {
    headers: { 'Authorization': bearerAuth(token) }
  })
}

// -- Axios

const instance = axios.create({
  baseURL: config.url.API_BASE_URL
})

instance.interceptors.response.use(response => {
  return response;
}, function (error) {
  if (error.response.status === 404) {
    return { status: error.response.status };
  }
  return Promise.reject(error.response);
});

// -- Helper functions

function bearerAuth(token) {
  return `Bearer ${token}`
}

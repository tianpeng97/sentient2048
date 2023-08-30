import axios from 'axios'
const baseUrl = '/api/accounts'

let token = null

const setToken = (newToken) => {
  token = `Bearer ${newToken}`
}

const removeToken = () => {
  token = null
}

const getAll = () => {
  const request = axios.get(baseUrl)
  return request.then((response) => response.data)
}

const get = (id) => {
  const config = {
    headers: { Authorization: token },
  }

  const request = axios.get(`${baseUrl}/${id}`, config)
  return request.then((response) => response.data)
}

const create = async (newObject) => {
  const response = await axios.post(baseUrl, newObject)
  return response.data
}

const update = async (id, newObject) => {
  const config = {
    headers: { Authorization: token },
  }

  const response = await axios.patch(`${baseUrl}/${id}`, newObject, config)
  return response.data
}

export default {
  getAll,
  get,
  create,
  update,
  setToken,
  removeToken,
}

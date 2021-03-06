import axios from 'axios'
import { UserDetails } from '../types/user'

const API = axios.create({
  baseURL: 'https://gq-backend.herokuapp.com/api/v1',
})

export const setDefaultHeaders = (token: string) => {
  API.defaults.headers.common['Authorization'] = `Bearer ${token}`
}

export const login = async ({ email, password }: { email: string; password: string }) => {
  try {
    const response = await API.post('/authenticate', {
      email,
      password,
    })

    if (response.status === 200) {
      setDefaultHeaders(response.data.token)
      return response.data
    } else {
      throw new Error()
    }
  } catch (error) {
    console.log(error)
  }
}

export const signup = async ({ username, email, password }: UserDetails) => {
  try {
    const response = await API.post('/users', {
      username,
      email,
      password,
    })

    if (response.status === 201) {
      return true
    } else {
      return false
    }
  } catch (error) {
    console.log(error)
  }
}

export const update = async (updateObj: { username?: string; email?: string; password?: string }) => {
  try {
    const response = await API.patch('/myProfile', updateObj)
    if (response.status === 200) {
      return true
    } else {
      throw new Error()
    }
  } catch (error) {
    console.log(error)
  }
}

export const deleteUser = async () => {
  try {
    const response = await API.delete('/myProfile')
    if (response.status === 200) {
      return true
    } else {
      throw new Error()
    }
  } catch (error) {
    console.log(error)
  }
}

export const getQuestions = async (lat: number, lng: number) => {
  try {
    const response = await API.get(`/questions?lat=${lat}&lon=${lng}`)
    if (response.status === 200) {
      return response.data.responseArray
    } else {
      throw new Error()
    }
  } catch (error) {
    console.log(error)
  }
}

export const submitAnswer = async (questionId: string, attemptedAnswer: string) => {
  try {
    const response = await API.patch(`/questions/${questionId}`, { answer: attemptedAnswer })
    if (response.status === 200) {
      console.log('Question answered correctly in API')
      return true
    } else {
      throw new Error()
    }
  } catch (error) {
    console.log(error)
  }
}
// login({

//   "email": "pelle@test.com",
//   "password": "pelle123"
// })

// login({

//   "email": "emma1234@test.com",
//   "password": "emma1234"
// })

// login({

//   "email": "pelle22@test.com",
//   "password": "testing123"
// })

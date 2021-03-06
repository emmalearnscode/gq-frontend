import { questionSlice } from './questionSlice'
import { requestStateSlice } from '../requestState/requestStateSlice'
import { userSlice } from '../user/userSlice'
import { getQuestions, submitAnswer } from '../../API'
import { IQuestion } from '../../types/question'
import { Action } from 'redux'
import { ThunkAction } from 'redux-thunk'
import { RootState } from '..'

export type AppThunk<ReturnType = void> = ThunkAction<ReturnType, RootState, unknown, Action<string>>

export const fetchQuestions =
  (lat: number, lng: number): AppThunk =>
  async dispatch => {
    dispatch(requestStateSlice.actions.showSpinner())
    dispatch(requestStateSlice.actions.clearError())
    try {
      const questions: IQuestion[] | undefined = await getQuestions(lat, lng)

      if (questions) {
        dispatch(questionSlice.actions.fetchQuestions(questions))
      } else {
        dispatch(requestStateSlice.actions.setError('Something went wrong, unable to fetch questions at this time.'))
      }
      dispatch(requestStateSlice.actions.hideSpinner())
    } catch (error) {
      dispatch(requestStateSlice.actions.logErrorAndHideSpinner('Something went wrong. Please try again.'))
    }
  }

export const answerQuestion =
  (questionId: string, attemptedAnswer: string): AppThunk =>
  async dispatch => {
    dispatch(requestStateSlice.actions.showSpinner())
    dispatch(requestStateSlice.actions.clearError())
    try {
      const correct = await submitAnswer(questionId, attemptedAnswer)
      if (correct) {
        dispatch(questionSlice.actions.answerQuestion(questionId))
        dispatch(userSlice.actions.updateUserScore())
        const savedUserLS = localStorage.getItem('user')
        const savedUserSS = sessionStorage.getItem('user')
        if (savedUserLS) {
          const user = JSON.parse(savedUserLS)
          const updatedUser = { ...user, score: user.score + 5 }
          localStorage.setItem('user', JSON.stringify(updatedUser))
        }
        if (savedUserSS) {
          const user = JSON.parse(savedUserSS)
          const updatedUser = { ...user, score: user.score + 5 }
          localStorage.setItem('user', JSON.stringify(updatedUser))
        }
      } else {
        dispatch(requestStateSlice.actions.setError('That answer is incorrect. Please try again.'))
      }
      dispatch(requestStateSlice.actions.hideSpinner())
    } catch (error) {
      dispatch(requestStateSlice.actions.logErrorAndHideSpinner('Something went wrong. Please try again.'))
    }
  }
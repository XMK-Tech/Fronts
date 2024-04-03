import {configureStore, getDefaultMiddleware} from '@reduxjs/toolkit'
import createSagaMiddleware from 'redux-saga'
import {reduxBatch} from '@manaflair/redux-batch'
import {persistStore} from 'redux-persist'
import * as auth from '../../app/modules/auth/redux/AuthRedux'
import {rootReducer, rootSaga} from './RootReducer'
import axios from 'axios'

const sagaMiddleware = createSagaMiddleware()
const middleware = [
  ...getDefaultMiddleware({
    immutableCheck: false,
    serializableCheck: false,
    thunk: true,
  }),
  sagaMiddleware,
]

const store = configureStore({
  reducer: rootReducer,
  middleware,
  devTools: process.env.NODE_ENV !== 'production',
  enhancers: [reduxBatch],
})
function doLogoff() {
  store.dispatch(auth.actions.logout())
}

axios.interceptors.response.use(
  (response) => response,
  async (error) => {
    if (error.response?.status === 401) {
      doLogoff()
    }
    console.error(JSON.parse(JSON.stringify(error)))
    if (error.config.responseType === 'blob' && error.response?.data) {
      const errorData = JSON.parse(await readAsText(error.response?.data))
      return Promise.reject(
        errorData?.error ?? errorData?.message ?? 'Ocorreu um erro desconhecido'
      )
    }
    return Promise.reject(
      error.response?.data?.error ?? error.response?.data?.message ?? 'Ocorreu um erro desconhecido'
    )
  }
)
export type AppDispatch = typeof store.dispatch

function readAsText(data: Blob | undefined) {
  if (!data) return Promise.resolve('')
  return new Promise<string>((resolve, reject) => {
    const fr = new FileReader()
    fr.onload = () => resolve(fr.result as string)
    fr.onerror = () => reject(fr.error)
    fr.readAsText(data)
  })
}

/**
 * @see https://github.com/rt2zz/redux-persist#persiststorestore-config-callback
 * @see https://github.com/rt2zz/redux-persist#persistor-object
 */
export const persistor = persistStore(store)

sagaMiddleware.run(rootSaga)

export default store

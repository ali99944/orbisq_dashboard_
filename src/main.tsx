import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import { PersistGate } from 'redux-persist/integration/react'
import ReactQueryProvider from './providers/query-providers'
import { RouterProvider } from 'react-router-dom'
import { persistor, store } from './redux/store'
import router from './router'
import { Provider } from 'react-redux'

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <Provider store={store}>
      <PersistGate loading={null} persistor={persistor}>
        <ReactQueryProvider>
          <RouterProvider router={router} />
        </ReactQueryProvider>
      </PersistGate>
    </Provider>
  </StrictMode>,
)

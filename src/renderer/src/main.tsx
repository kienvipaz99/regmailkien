import React from 'react'
import ReactDOM from 'react-dom/client'

// mantine
import '@mantine/core/styles.css'

// Tailwind css
import '@renderer/assets/index.css'

// i18n (needs to be bundled)
import '@renderer/i18n'

import { MantineProvider } from '@mantine/core'
import { RouterProvider } from 'react-router-dom'
import LayoutButtonStateProvider from './context/LayoutActionButton'
import LayoutSidebarProvider from './context/LayoutSidebarProvider'
import ReactQueryProvider from './context/ReactQueryProvider'
import router from './router'

ReactDOM.createRoot(document.getElementById('root') as HTMLElement).render(
  <React.StrictMode>
    <MantineProvider>
      <ReactQueryProvider>
        <LayoutButtonStateProvider>
          <LayoutSidebarProvider>
            <RouterProvider router={router} fallbackElement />
          </LayoutSidebarProvider>
        </LayoutButtonStateProvider>
      </ReactQueryProvider>
    </MantineProvider>
  </React.StrictMode>
)

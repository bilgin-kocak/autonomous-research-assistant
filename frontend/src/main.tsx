import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { PrivyProvider } from '@privy-io/react-auth'
import { baseSepolia } from 'viem/chains'
import './index.css'
import App from './App.tsx'

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <PrivyProvider
      appId={import.meta.env.VITE_PRIVY_APP_ID}
      config={{
        defaultChain: baseSepolia,
        supportedChains: [baseSepolia],
        appearance: {
          theme: 'dark',
          accentColor: '#3b82f6',
          logo: 'https://your-logo-url.com/logo.png', // Optional: Add your logo
        },
        embeddedWallets: {
          createOnLogin: 'users-without-wallets',
        },
        loginMethods: ['email', 'wallet'],
      }}
    >
      <App />
    </PrivyProvider>
  </StrictMode>,
)

import CreateToken from './components/CreateToken'
import {ConnectionProvider, WalletProvider} from '@solana/wallet-adapter-react'
import { WalletModalProvider,WalletDisconnectButton,WalletMultiButton } from '@solana/wallet-adapter-react-ui'
import '@solana/wallet-adapter-react-ui/styles.css'

function App() {
 

  return (
    <ConnectionProvider endpoint="http://api.devnet.solana.com">
      <WalletProvider wallets={[]} autoConnect>
       <WalletModalProvider>

          <div className="flex justify-between p-3 bg-neutral-950 sticky top-0">
             <WalletMultiButton />
             <WalletDisconnectButton />
          </div>
         <CreateToken></CreateToken>

        </WalletModalProvider>
       </WalletProvider>
    </ConnectionProvider>
  )
}

export default App

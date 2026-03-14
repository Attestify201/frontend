import Image from 'next/image'
import Link from 'next/link'
import { Sun } from 'lucide-react'
import { useAccount, useConnect, useConnectors, useDisconnect } from 'wagmi'
import { useState, useEffect } from 'react'

const Navbar = () => {
  const { isConnected, address } = useAccount()
  const { connect, status: connectStatus } = useConnect()
  const connectors = useConnectors()
  const { disconnect } = useDisconnect()
  const [isFarcaster, setIsFarcaster] = useState(false)
  const [isMiniApp, setIsMiniApp] = useState(false)

  // Only check on client to avoid hydration mismatch
  useEffect(() => {
    const inMiniApp = window.location !== window.parent.location || !!window?.frames?.length || !!window?.ReactNativeWebView
    setIsFarcaster(inMiniApp)
    setIsMiniApp(inMiniApp)
  }, [])

  const onConnect = () => {
    // On Farcaster, miniAppConnector is index 0; on web, fall back to injected or WalletConnect
    const preferred = isFarcaster
      ? connectors.find(c => c.id === 'farcasterMiniApp')
      : connectors.find(c => c.id === 'injected') ?? connectors.find(c => c.id === 'walletConnect')

    const connector = preferred ?? connectors[0]
    if (connector) connect({ connector })
  }

  // In mini app, make navbar more compact
  if (isMiniApp) {
    return (
      <nav className="sticky top-0 z-50 w-full text-white bg-nav-gradient backdrop-blur-md bg-opacity-95 border-b border-white/10">
        <div className="max-w-7xl mx-auto px-3 sm:px-4 py-2 flex items-center justify-between">
          <Link href="/dashboard" className="flex items-center gap-2">
            <Image 
              src="/LiquiFi TP Logo 1.png" 
              alt="LiquiFi Logo" 
              width={100} 
              height={33}
              className="h-6 sm:h-7 w-auto"
              priority
            />
          </Link>

          <div className="flex items-center space-x-2">
            {isConnected ? (
              <button
                onClick={() => disconnect()}
                className="bg-white/10 hover:bg-white/20 text-white px-2 sm:px-3 py-1 sm:py-1.5 rounded-md text-xs"
              >
                Disconnect
              </button>
            ) : (
              <button
                onClick={onConnect}
                disabled={connectStatus === 'pending'}
                className="border border-[#2BA3FF] hover:bg-[#2BA3FF]/10 disabled:opacity-60 text-white px-3 py-1.5 rounded-md transition-colors text-xs"
              >
                {connectStatus === 'pending' ? 'Connecting…' : 'Connect'}
              </button>
            )}
          </div>
        </div>
      </nav>
    )
  }

  return (
    <nav className="sticky top-0 z-50 w-full text-white bg-nav-gradient backdrop-blur-md bg-opacity-95 border-b border-white/10">
      <div className="max-w-7xl mx-auto px-4 py-3 flex items-center justify-between">
        <Link href="/" className="flex items-center gap-2">
          <Image 
            src="/LiquiFi TP Logo 1.png" 
            alt="LiquiFi Logo" 
            width={120} 
            height={40}
            className="h-8 w-auto"
            priority
          />
        </Link>

        <div className="flex items-center space-x-3">
          <Sun size={20} className="text-white" />
          {isConnected ? (
            <div className="flex items-center gap-2">
              <span className="text-white/80 text-sm hidden sm:block">
                {address?.slice(0, 6)}…{address?.slice(-4)}
              </span>
              <button
                onClick={() => disconnect()}
                className="bg-white/10 hover:bg-white/20 text-white px-2 sm:px-3 py-1.5 sm:py-2 rounded-md text-xs sm:text-sm"
              >
                Disconnect
              </button>
            </div>
          ) : (
            <button
              onClick={onConnect}
              disabled={connectStatus === 'pending'}
              className="border border-[#2BA3FF] hover:bg-[#2BA3FF]/10 disabled:opacity-60 text-white px-3 sm:px-4 py-1.5 sm:py-2 rounded-md transition-colors text-xs sm:text-sm"
            >
              {connectStatus === 'pending' ? 'Connecting…' : 'Connect Wallet'}
            </button>
          )}
        </div>
      </div>
    </nav>
  )
}

export default Navbar
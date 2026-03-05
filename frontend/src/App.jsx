import { useState, useEffect } from 'react';
import { ethers } from 'ethers';
import Header from './components/Header';
import Hero from './components/Hero';
import DomainSearch from './components/DomainSearch';
import Dashboard from './components/Dashboard';

// Hardcode placeholder or read from env
const CONTRACT_ADDRESS = import.meta.env.VITE_CONTRACT_ADDRESS || "0x0000000000000000000000000000000000000000";

function App() {
  const [provider, setProvider] = useState(null);
  const [signer, setSigner] = useState(null);
  const [account, setAccount] = useState("");
  const [isConnecting, setIsConnecting] = useState(false);

  // Initialize or handle account changes
  useEffect(() => {
    if (window.ethereum) {
      window.ethereum.on('accountsChanged', handleAccountsChanged);
      window.ethereum.on('chainChanged', () => window.location.reload());
    }
    return () => {
      if (window.ethereum) {
        window.ethereum.removeListener('accountsChanged', handleAccountsChanged);
      }
    };
  }, []);

  const handleAccountsChanged = (accounts) => {
    if (accounts.length === 0) {
      setAccount("");
      setSigner(null);
      console.log('Please connect to MetaMask.');
    } else if (accounts[0] !== account) {
      setAccount(accounts[0]);
      setupProvider();
    }
  };

  const setupProvider = async () => {
    const tempProvider = new ethers.BrowserProvider(window.ethereum);
    const tempSigner = await tempProvider.getSigner();
    
    // Suggest Matsnet (Chain ID 31611)
    const network = await tempProvider.getNetwork();
    if (Number(network.chainId) !== 31611) {
      try {
        await window.ethereum.request({
          method: 'wallet_switchEthereumChain',
          params: [{ chainId: '0x7B7B' }], // 31611 in hex
        });
      } catch (switchError) {
        // This error code indicates that the chain has not been added to MetaMask.
        if (switchError.code === 4902) {
          try {
            await window.ethereum.request({
              method: 'wallet_addEthereumChain',
              params: [
                {
                  chainId: '0x7B7B',
                  chainName: 'Mezo Matsnet Testnet',
                  rpcUrls: ['https://rpc.test.mezo.org'],
                  nativeCurrency: {
                    name: 'Mezo Bitcoin',
                    symbol: 'BTC',
                    decimals: 18,
                  },
                  blockExplorerUrls: ['https://explorer.test.mezo.org'],
                },
              ],
            });
          } catch (addError) {
            console.error("Failed to add Matsnet", addError);
          }
        }
      }
    }

    setProvider(tempProvider);
    setSigner(tempSigner);
  };

  const connectWallet = async () => {
    if (typeof window.ethereum !== 'undefined') {
      try {
        setIsConnecting(true);
        const accounts = await window.ethereum.request({ method: 'eth_requestAccounts' });
        handleAccountsChanged(accounts);
      } catch (error) {
        console.error("Error connecting wallet", error);
      } finally {
        setIsConnecting(false);
      }
    } else {
      alert("Please install MetaMask or another Web3 wallet.");
    }
  };

  const disconnectWallet = () => {
    setAccount("");
    setProvider(null);
    setSigner(null);
  };

  return (
    <div className="app-wrapper animate-fade-in">
      <Header 
        account={account} 
        connectWallet={connectWallet}
        disconnectWallet={disconnectWallet}
        isConnecting={isConnecting} 
      />
      <main className="container">
        <Hero />
        <div id="search">
          <DomainSearch 
            provider={provider} 
            signer={signer} 
            account={account} 
            contractAddress={CONTRACT_ADDRESS}
            connectWallet={connectWallet}
          />
        </div>
        {account && (
          <div id="dashboard">
            <Dashboard 
              provider={provider} 
              account={account} 
              contractAddress={CONTRACT_ADDRESS}
            />
          </div>
        )}
      </main>
    </div>
  );
}

export default App;

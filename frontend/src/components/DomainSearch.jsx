import { useState } from 'react';
import { ethers } from 'ethers';
import { Search, Loader2, CheckCircle2, XCircle } from 'lucide-react';
import MezoDomainsABI from '../contracts/MezoDomains.json';

export default function DomainSearch({ provider, signer, account, contractAddress, connectWallet }) {
  const [searchTerm, setSearchTerm] = useState('');
  const [isSearching, setIsSearching] = useState(false);
  const [searchResult, setSearchResult] = useState(null); // { available: boolean, price?: string, owner?: string }
  const [isRegistering, setIsRegistering] = useState(false);
  const [txHash, setTxHash] = useState('');

  const handleSearch = async (e) => {
    e.preventDefault();
    if (!searchTerm.trim()) return;
    
    // Auto-append .poor if not present for display, but contract stores the string exactly.
    // Let's store "name.poor" in the contract.
    const domainToSearch = searchTerm.endsWith('.poor') ? searchTerm : `${searchTerm}.poor`;
    
    setIsSearching(true);
    setSearchResult(null);
    setTxHash('');
    
    try {
      if (!provider) {
        // Fallback to a default provider if wallet not connected, 
        // but for simplicity we ask them to connect.
        if (!account) {
          alert("Please connect your wallet to search for domains.");
          setIsSearching(false);
          return;
        }
      }

      const contract = new ethers.Contract(contractAddress, MezoDomainsABI.abi, provider);
      
      try {
        const owner = await contract.getDomainOwner(domainToSearch);
        // If it succeeds, it means it's registered.
        setSearchResult({ available: false, owner });
      } catch (err) {
        // "Domain not registered" error means it's available
        const fee = await contract.registrationFee();
        setSearchResult({ 
          available: true, 
          price: ethers.formatEther(fee),
          domain: domainToSearch
        });
      }
    } catch (error) {
      console.error("Search error:", error);
    } finally {
      setIsSearching(false);
    }
  };

  const handleRegister = async () => {
    if (!signer || !searchResult || !searchResult.available) return;
    
    try {
      setIsRegistering(true);
      const contract = new ethers.Contract(contractAddress, MezoDomainsABI.abi, signer);
      
      const feeWei = ethers.parseEther(searchResult.price);
      
      const tx = await contract.registerDomain(searchResult.domain, { value: feeWei });
      setTxHash(tx.hash);
      
      await tx.wait();
      
      // Update UI to show it's now owned by current user
      setSearchResult({ available: false, owner: account });
      
      alert(`Successfully registered ${searchResult.domain}!`);
    } catch (error) {
      console.error("Registration failed:", error);
      alert("Registration failed. Please try again.");
    } finally {
      setIsRegistering(false);
    }
  };

  const domainDisplay = searchTerm.endsWith('.poor') ? searchTerm : (searchTerm ? `${searchTerm}.poor` : '');

  return (
    <div className="flex-center delay-3 animate-fade-in" style={{ flexDirection: 'column', width: '100%' }}>
      <div className="glass-panel search-card" style={{ width: '100%', maxWidth: '650px', padding: '32px', marginBottom: '40px' }}>
        <form onSubmit={handleSearch} className="search-form" style={{ position: 'relative', display: 'flex', gap: '12px' }}>
          <div style={{ position: 'relative', flexGrow: 1 }}>
            <div style={{ position: 'absolute', left: '20px', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-secondary)' }}>
              <Search size={22} />
            </div>
            <input 
              type="text" 
              className="glas-input" 
              placeholder="Search for a domain (e.g. satoshi)" 
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value.toLowerCase().replace(/[^a-z0-9-.]/g, ''))}
              style={{ paddingLeft: '56px', paddingRight: '120px' }}
            />
            {searchTerm && !searchTerm.endsWith('.poor') && (
              <div style={{ position: 'absolute', right: '20px', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-secondary)', fontWeight: 600 }}>
                .poor
              </div>
            )}
          </div>
          <button type="submit" className="btn btn-primary" disabled={isSearching || !searchTerm}>
            {isSearching ? <Loader2 size={20} className="animate-spin" /> : "Search"}
          </button>
        </form>

        {/* Results Area */}
        {searchResult && (
          <div className="animate-fade-in" style={{ marginTop: '24px', padding: '24px', borderRadius: '16px', background: 'rgba(0,0,0,0.2)', border: '1px solid var(--glass-border)' }}>
            <div className="flex-between result-inner" style={{ alignItems: 'flex-start' }}>
              <div>
                <h3 style={{ fontSize: '24px', marginBottom: '8px' }}>{searchResult.domain || domainDisplay}</h3>
                {searchResult.available ? (
                  <div className="badge badge-available"><CheckCircle2 size={14} /> Available</div>
                ) : (
                  <div className="badge badge-taken"><XCircle size={14} /> Taken</div>
                )}
              </div>
              
              <div style={{ textAlign: 'right' }}>
                {searchResult.available ? (
                  <>
                    <div style={{ fontSize: '20px', fontWeight: '700', color: 'var(--accent-color)', marginBottom: '12px' }}>
                      {searchResult.price} BTC
                    </div>
                    {account ? (
                      <button 
                        className="btn btn-primary" 
                        onClick={handleRegister} 
                        disabled={isRegistering}
                        style={{ width: '100%' }}
                      >
                        {isRegistering ? <Loader2 size={18} className="animate-spin" /> : "Register Now"}
                      </button>
                    ) : (
                      <button className="btn btn-primary" onClick={connectWallet} style={{ width: '100%' }}>
                        Connect to Register
                      </button>
                    )}
                  </>
                ) : (
                  <div style={{ color: 'var(--text-secondary)', fontSize: '14px', background: 'rgba(255,255,255,0.05)', padding: '12px', borderRadius: '8px' }}>
                    Owned by:<br/>
                    <span style={{ color: 'var(--text-primary)', fontWeight: 'monospace' }}>
                      {searchResult.owner.substring(0, 6)}...{searchResult.owner.substring(searchResult.owner.length - 4)}
                    </span>
                  </div>
                )}
              </div>
            </div>
            
            {txHash && (
               <div style={{ marginTop: '16px', fontSize: '13px', color: '#4ade80' }}>
                 Transaction submitted: {txHash.substring(0, 10)}...
               </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}

import { useState, useEffect, useCallback } from 'react';
import { ethers } from 'ethers';
import MezoDomainsABI from '../contracts/MezoDomains.json';
import { LayoutDashboard, ExternalLink } from 'lucide-react';

export default function Dashboard({ provider, account, contractAddress, showToast, refreshKey }) {
  const [domains, setDomains] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  const fetchUserDomains = useCallback(async () => {
    if (!provider || !account) return;
    // Guard against zero/missing contract address
    if (!contractAddress || contractAddress === '0x0000000000000000000000000000000000000000') {
      console.warn('Contract address not configured.');
      setIsLoading(false);
      return;
    }
    try {
      setIsLoading(true);
      const contract = new ethers.Contract(contractAddress, MezoDomainsABI.abi, provider);
      
      // Read total minted token count directly from the contract — much more reliable
      // than querying Transfer events which can fail on testnet RPCs.
      const nextId = await contract.nextTokenId();
      const totalMinted = Number(nextId);

      const userDomains = [];
      for (let id = 1; id <= totalMinted; id++) {
        try {
          const currentOwner = await contract.ownerOf(id);
          if (currentOwner.toLowerCase() === account.toLowerCase()) {
            const domainName = await contract.tokenIdToDomain(id);
            userDomains.push({ id: id.toString(), name: domainName });
          }
        } catch (e) {
          // Token burned or doesn't exist — skip
        }
      }
      
      setDomains(userDomains);
    } catch (error) {
      console.error("Failed to fetch domains:", error);
      if (showToast) {
        showToast("Failed to fetch your domains.", "error");
      }
    } finally {
      setIsLoading(false);
    }
  }, [provider, account, contractAddress, showToast, refreshKey]);

  useEffect(() => {
    fetchUserDomains();
  }, [fetchUserDomains]);

  return (
    <div className="glass-panel glass-panel-page animate-fade-in delay-3" style={{ padding: '32px', marginBottom: '60px' }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '24px' }}>
        <LayoutDashboard className="text-secondary" />
        <h2 style={{ fontSize: '24px' }}>Your Domains</h2>
      </div>
      
      {isLoading ? (
        <div style={{ color: 'var(--text-secondary)', padding: '20px 0' }}>Loading your domains...</div>
      ) : domains.length === 0 ? (
        <div style={{ 
          background: 'rgba(0,0,0,0.2)', borderRadius: '12px', padding: '32px', 
          textAlign: 'center', color: 'var(--text-secondary)'
        }}>
          You don't own any .poor domains yet. Use the search to find and register one!
        </div>
      ) : (
        <div className="domains-grid" style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: '16px' }}>
          {domains.map((domain) => (
            <div key={domain.id} style={{ 
              background: 'linear-gradient(135deg, rgba(255,255,255,0.02) 0%, rgba(255,255,255,0.05) 100%)',
              border: '1px solid var(--glass-border)',
              borderRadius: '16px',
              padding: '20px',
              transition: 'all var(--transition-normal)'
            }}>
              <div className="badge badge-available" style={{ marginBottom: '12px' }}>Token ID: {domain.id}</div>
              <h3 style={{ fontSize: '20px', color: 'var(--accent-color)', marginBottom: '16px' }}>{domain.name}</h3>
              <a 
                href={`https://explorer.test.mezo.org/address/${contractAddress}?tab=tokens`} 
                target="_blank" 
                rel="noreferrer"
                style={{ 
                  display: 'inline-flex', alignItems: 'center', gap: '6px', 
                  color: 'var(--text-secondary)', textDecoration: 'none', fontSize: '13px' 
                }}
              >
                View on Explorer <ExternalLink size={12} />
              </a>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

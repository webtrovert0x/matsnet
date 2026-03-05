import { useState } from 'react';
import { Wallet, LogOut, ChevronDown } from 'lucide-react';

export default function Header({ account, connectWallet, disconnectWallet, isConnecting }) {
  const [showMenu, setShowMenu] = useState(false);

  const formatAddress = (address) => {
    return `${address.substring(0, 6)}...${address.substring(address.length - 4)}`;
  };

  return (
    <header className="container">
      <div className="header-inner" style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '20px 0', flexWrap: 'wrap', gap: '12px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
          <img 
            src="/IMG_3980.jpeg" 
            alt="Mezo Logo" 
            style={{ width: '44px', height: '44px', borderRadius: '12px', objectFit: 'cover' }} 
          />
          <h2 className="header-logo-text" style={{ fontSize: '22px', fontWeight: '800' }}>Mezo<span className="gradient-text">Domains</span></h2>
        </div>

        {/* Nav links — only when connected */}
        {account && (
          <nav className="header-nav" style={{ display: 'flex', gap: '4px' }}>
            <a
              href="#search"
              onClick={e => { e.preventDefault(); document.getElementById('search')?.scrollIntoView({ behavior: 'smooth' }); }}
              style={{
                padding: '8px 16px', borderRadius: '10px', fontSize: '14px', fontWeight: '600',
                color: 'var(--text-secondary)', textDecoration: 'none', transition: 'all 0.2s',
                background: 'transparent'
              }}
              onMouseEnter={e => { e.currentTarget.style.background = 'rgba(255,255,255,0.06)'; e.currentTarget.style.color = '#fff'; }}
              onMouseLeave={e => { e.currentTarget.style.background = 'transparent'; e.currentTarget.style.color = 'var(--text-secondary)'; }}
            >
              Search
            </a>
            <a
              href="#dashboard"
              onClick={e => { e.preventDefault(); document.getElementById('dashboard')?.scrollIntoView({ behavior: 'smooth' }); }}
              style={{
                padding: '8px 16px', borderRadius: '10px', fontSize: '14px', fontWeight: '600',
                color: 'var(--accent-color)', textDecoration: 'none', transition: 'all 0.2s',
                background: 'rgba(255, 20, 80, 0.08)', border: '1px solid rgba(255,20,80,0.2)'
              }}
              onMouseEnter={e => { e.currentTarget.style.background = 'rgba(255, 20, 80, 0.15)'; }}
              onMouseLeave={e => { e.currentTarget.style.background = 'rgba(255, 20, 80, 0.08)'; }}
            >
              My Domains
            </a>
          </nav>
        )}
        
        <div style={{ position: 'relative' }}>
          {account ? (
            <>
              <button
                onClick={() => setShowMenu(v => !v)}
                className="glass-panel"
                style={{ 
                  display: 'flex', alignItems: 'center', gap: '10px',
                  padding: '8px 16px', borderRadius: '30px', cursor: 'pointer',
                  border: '1px solid var(--glass-border)', background: 'rgba(255,255,255,0.03)'
                }}
              >
                <div style={{ width: '8px', height: '8px', borderRadius: '50%', background: '#4ade80', boxShadow: '0 0 10px #4ade80', flexShrink: 0 }}></div>
                <span style={{ fontSize: '14px', fontWeight: '600', color: 'var(--text-secondary)' }}>
                  {formatAddress(account)}
                </span>
                <ChevronDown size={14} style={{ color: 'var(--text-secondary)', transition: 'transform 0.2s', transform: showMenu ? 'rotate(180deg)' : 'rotate(0deg)' }} />
              </button>

              {showMenu && (
                <div
                  className="glass-panel"
                  style={{
                    position: 'absolute', top: 'calc(100% + 8px)', right: 0,
                    minWidth: '180px', padding: '8px', borderRadius: '16px', zIndex: 100
                  }}
                >
                  <button
                    onClick={() => { disconnectWallet(); setShowMenu(false); }}
                    style={{
                      display: 'flex', alignItems: 'center', gap: '10px',
                      width: '100%', padding: '10px 14px', borderRadius: '10px',
                      background: 'transparent', border: 'none', cursor: 'pointer',
                      color: '#f87171', fontSize: '14px', fontWeight: '600',
                      transition: 'background 0.2s'
                    }}
                    onMouseEnter={e => e.currentTarget.style.background = 'rgba(248,113,113,0.1)'}
                    onMouseLeave={e => e.currentTarget.style.background = 'transparent'}
                  >
                    <LogOut size={15} />
                    Disconnect
                  </button>
                </div>
              )}
            </>
          ) : (
            <button 
              className="btn btn-primary" 
              onClick={connectWallet}
              disabled={isConnecting}
            >
              <Wallet size={18} />
              {isConnecting ? "Connecting..." : "Connect Wallet"}
            </button>
          )}
        </div>
      </div>
    </header>
  );
}


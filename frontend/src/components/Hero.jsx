import { Search } from 'lucide-react';

export default function Hero() {
  return (
    <section className="flex-center" style={{ flexDirection: 'column', textAlign: 'center', margin: '60px 0 48px', padding: '0 8px' }}>
      <div 
        className="delay-1 
        animate-fade-in"
        style={{
          display: 'inline-flex',
          background: 'rgba(247, 147, 26, 0.1)',
          border: '1px solid rgba(247, 147, 26, 0.3)',
          color: 'var(--accent-color)',
          padding: '6px 16px',
          borderRadius: '30px',
          fontSize: '14px',
          fontWeight: '600',
          marginBottom: '24px'
        }}
      >
        ✨ Live on Matsnet
      </div>
      
      <h1 className="hero-title delay-2 animate-fade-in" style={{ fontSize: '56px', fontWeight: '800', lineHeight: '1.1', marginBottom: '24px', maxWidth: '800px' }}>
        Your Web3 Identity on <span className="gradient-text">Mezo Network</span>
      </h1>
      
      <p className="hero-subtitle delay-3 animate-fade-in" style={{ fontSize: '18px', color: 'var(--text-secondary)', maxWidth: '600px', lineHeight: '1.6' }}>
        Register your ideal .poor domain name. Connect your wallet, search for an available name, and claim your decentralized identity on the Bitcoin-first Layer 2.
      </p>
    </section>
  );
}

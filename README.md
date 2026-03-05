# MezoDomains — .poor Domain Name Service on Mezo Matsnet

Register custom `.poor` domain names on [Mezo](https://mezo.org), the Bitcoin-first Layer 2. Built like ENS but for Matsnet's testnet.

![MezoDomains UI](./frontend/public/mezo-logo.png)

---

## What It Does

- 🔍 **Search** any `.poor` name to check availability on-chain
- ✍️ **Register** available domains as ERC-721 NFTs by paying a small BTC fee
- 📁 **Dashboard** — view all `.poor` domains owned by your connected wallet
- 🔗 Runs on **Mezo Matsnet** (Chain ID: `31611`, native token: `BTC`)

**Deployed Contract:** [`0xAD3F77F9404205CbC3248086Ad881c3083262823`](https://explorer.test.mezo.org/address/0xAD3F77F9404205CbC3248086Ad881c3083262823)

---

## Project Structure

```
matsnet/
├── contracts/          # Hardhat — Solidity smart contract
│   ├── contracts/MezoDomains.sol
│   ├── scripts/deploy.js
│   ├── test/MezoDomains.js
│   └── hardhat.config.js
└── frontend/           # React + Vite web app
    └── src/
        ├── App.jsx
        └── components/
            ├── Header.jsx
            ├── Hero.jsx
            ├── DomainSearch.jsx
            └── Dashboard.jsx
```

---

## Getting Started

### Prerequisites
- Node.js
- MetaMask (with Matsnet added — the app can add it automatically)
- Testnet BTC on Matsnet — get from the [Mezo faucet](https://mezo.org)

---

### 1. Smart Contract

```bash
cd contracts
npm install

# Copy and fill in your private key
cp .env.example .env
```

Edit `contracts/.env`:
```
PRIVATE_KEY=your_wallet_private_key_here
```

**Run tests:**
```bash
npx hardhat test
```

**Deploy to Matsnet:**
```bash
npx hardhat run scripts/deploy.js --network matsnet
```

Copy the printed contract address — you'll need it for the frontend.

---

### 2. Frontend

```bash
cd frontend
npm install

# Copy and fill in the deployed contract address
cp .env.example .env
```

Edit `frontend/.env`:
```
VITE_CONTRACT_ADDRESS=your_deployed_contract_address_here
```

**Start dev server:**
```bash
npm run dev
```

Open [http://localhost:5173](http://localhost:5173) in your browser.

---

## Deploying Frontend (Vercel / Netlify)

Add this environment variable in your hosting dashboard:

| Key | Value |
|-----|-------|
| `VITE_CONTRACT_ADDRESS` | `0xAD3F77F9404205CbC3248086Ad881c3083262823` |

Then run `npm run build` and deploy the `dist/` folder.

---

## Smart Contract Details

**`MezoDomains.sol`** — ERC-721 contract

| Function | Description |
|----------|-------------|
| `registerDomain(string name)` | Mint a `.poor` domain as an NFT (payable) |
| `getDomainOwner(string name)` | Returns the owner address of a domain |
| `tokenIdToDomain(uint256 id)` | Returns the domain name for a token ID |
| `nextTokenId()` | Total number of domains minted |
| `registrationFee()` | Current fee in wei (default: 0.0001 BTC) |

---

## Network Config

| Field | Value |
|-------|-------|
| Network Name | Mezo Matsnet Testnet |
| RPC URL | `https://rpc.test.mezo.org` |
| Chain ID | `31611` |
| Symbol | `BTC` |
| Explorer | `https://explorer.test.mezo.org` |

---

## ⚠️ Security

- **Never commit your `.env` file.** It is gitignored by default.
- The `VITE_CONTRACT_ADDRESS` is a public on-chain address and is safe to share.

# MezoDomains — Frontend

React + Vite web app for the MezoDomains `.poor` domain name service on Mezo Matsnet.

## Setup

```bash
npm install

# Copy env template and fill in the contract address
cp .env.example .env
```

`.env` contents:
```
VITE_CONTRACT_ADDRESS=0xAD3F77F9404205CbC3248086Ad881c3083262823
```

## Running Locally

```bash
npm run dev
# → http://localhost:5173
```

## Building for Production

```bash
npm run build
# Output: dist/
```

## Stack

- **React + Vite**
- **ethers.js** — wallet connection & contract interaction
- **lucide-react** — icons
- **Vanilla CSS** — glassmorphic dark theme

## Environment Variables

| Variable | Description |
|----------|-------------|
| `VITE_CONTRACT_ADDRESS` | Deployed `MezoDomains` contract address on Matsnet |

## Deploying (Vercel / Netlify)

Set `VITE_CONTRACT_ADDRESS` as an environment variable in your hosting dashboard, then deploy the `dist/` folder.

> See the root [README](../README.md) for full project documentation including smart contract setup.

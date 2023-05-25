#!/bin/bash

# Step 1
cd ~/metacamp/RET

# Step 2
npx create-next-app webapp --ts

# Step 3
cd webapp
npm i @solana/web3.js @solana/wallet-adapter-base @solana/wallet-adapter-react @solana/wallet-adapter-wallets
npm i @chakra-ui/react @emotion/react @emotion/styled framer-motion

# Step 4
cp ~/metacamp/RET/frontend/src/pages/index.tsx ~/metacamp/RET/webapp/src/pages/index.tsx
cp ~/metacamp/RET/frontend/src/pages/_app.tsx ~/metacamp/RET/webapp/src/pages/_app.tsx
cp ~/metacamp/RET/frontend/src/components/TokenCard.tsx ~/metacamp/RET/webapp/src/components/TokenCard.tsx
cp ~/metacamp/RET/frontend/src/components/Wallets.tsx ~/metacamp/RET/webapp/src/components/Wallets.tsx

# RET

## Set Up - Smart Contract
```
cd ~
mkdir metacamp
cd metacamp
git clone https://github.com/BingleBangle-BH/RET
cd RET/mint-nft
yarn install
yarn add ts-node
npm install ts-node --save-dev
yarn test
```

## Set Up - API / Middleware (GET)
```
sudo apt install python3
pip3 install -r requirements.txt
cd endpoints
pip3 install flask-cors
python3 middleware.py
```

## Set Up - Secrets
Create the following files and paste the Token Program's Private Key into 'ownerSecret.json' and the testing wallet's Private Key into 'destSecret.json'
- 'destSecret.json'
- 'ownerSecret.json'

## Set Up - Front End Web Application
1. Install dependencies
- Select **Yes** for _use 'src/' directory with this project?_ when prompted.
```
cd ~/metacamp/RET
npx create-next-app webapp --ts
```
2. Install Solana Wallet Adaptor & Chakra UI
```
cd webapp
npm i @solana/web3.js @solana/wallet-adapter-base @solana/wallet-adapter-react @solana/wallet-adapter-wallets
npm i @chakra-ui/react @emotion/react @emotion/styled framer-motion
```

3. Replace **src/pages/index.tsx, src/pages/_app.tsx, src/components/TokenCard.tsx** and **Wallets.tsx** inside the _webapp_ directory with the files located inside the _frontend_ directory
- Tutorial for creating the front end web application can be found [here](https://blog.anishde.dev/creating-a-custom-solana-connect-wallet-ui-with-react-and-chakra-ui)

4. 
```
cd ~/metacamp/RET/webapp
npm run dev
```

## Notes
- The API Middleware runs on port 5000
- The Front End Web Application runs on port 3000, acceessible via [http://localhost:3000/](http://localhost:3000/)
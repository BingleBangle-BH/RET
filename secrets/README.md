# Secrets
1. Create your own wallet in devnet with the following command:
```
solana-keygen new --outfile ~/.config/solana/id.json --force
```
Take note of your public key, recovery phrases and the private key that is located inside the _id.json_ file that was just created

2. Retrieve your newly created wallet's private key with the following command:
```
cat ~/.config/solana/id.json
```
3. Import your wallet into backpack with the following steps:
- Backpack > Profile > Settings > Wallets > Add (+) > Continue > Solana > Advanced Wallet Import > Private key > Paste the contents from your _id.json_
- Backpack > Profile > Preferences > Solana > RPC Connection > Devnet

4. Obtain some tokens through Solana Faucets
- https://solfaucet.com/
- https://faucet.quicknode.com/solana/devnet
- https://faucet.triangleplatform.com/solana/devnet
#!/bin/bash

# Step 1
echo "Creating New Solana Wallet:"
solana-keygen new --outfile ~/.config/solana/id.json --force

# Step 2
echo "Your New Wallet's Private Key:"
cat ~/.config/solana/id.json

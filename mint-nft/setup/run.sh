#!/bin/bash

# Step 1
python3 ~/metacamp/RET/mint-nft/endpoints/middleware.py &

# Step 2
cd ~/metacamp/RET/webapp
npm run dev &

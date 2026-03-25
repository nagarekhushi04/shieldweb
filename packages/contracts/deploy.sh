#!/bin/bash
set -e
echo "=== ShieldWeb3 Contract Deployment ==="
echo "Building threat-registry..."
cd threat-registry
cargo build --target wasm32-unknown-unknown --release
echo "Building reward-token..."
cd ../reward-token
cargo build --target wasm32-unknown-unknown --release
cd ..

echo "Deploying threat-registry to testnet..."
THREAT_ID=$(stellar contract deploy \
  --wasm threat-registry/target/wasm32-unknown-unknown/release/threat_registry.wasm \
  --source-account $STELLAR_SECRET_KEY \
  --network testnet)
echo "THREAT_REGISTRY_CONTRACT_ID=$THREAT_ID"

echo "Deploying reward-token to testnet..."
REWARD_ID=$(stellar contract deploy \
  --wasm reward-token/target/wasm32-unknown-unknown/release/reward_token.wasm \
  --source-account $STELLAR_SECRET_KEY \
  --network testnet)
echo "REWARD_TOKEN_CONTRACT_ID=$REWARD_ID"

echo "Initializing contracts..."
stellar contract invoke --id $THREAT_ID --source-account $STELLAR_SECRET_KEY --network testnet -- initialize --admin $STELLAR_PUBLIC_KEY
stellar contract invoke --id $REWARD_ID --source-account $STELLAR_SECRET_KEY --network testnet -- initialize --admin $STELLAR_PUBLIC_KEY --name "ShieldWeb3 Token" --symbol "SHW3"

echo "=== Deployment complete. Add IDs to .env ==="

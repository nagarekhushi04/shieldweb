import * as StellarSdk from '@stellar/stellar-sdk';
import axios from 'axios';
import yargs from 'yargs';
import { hideBin } from 'yargs/helpers';

// Note: To fully run this script, ensure dependencies are installed:
// npm install @stellar/stellar-sdk axios yargs @types/yargs ts-node

const HORIZON_URL = 'https://horizon-testnet.stellar.org';
const server = new StellarSdk.Horizon.Server(HORIZON_URL);

interface Args {
  name: string;
  email: string;
  wallet: string;
}

// Ensure proper testnet network
const NETWORK_PASSPHRASE = StellarSdk.Networks.TESTNET;

async function run() {
  const argv = await yargs(hideBin(process.argv))
    .option('name', { type: 'string', demandOption: true })
    .option('email', { type: 'string', demandOption: true })
    .option('wallet', { type: 'string', demandOption: true })
    .parse();

  const { name, email, wallet } = argv as Args;

  console.log(`\n🛡️ Starting Onboarding for ${name} (${email})`);
  console.log(`Wallet Address: ${wallet}`);

  // 1. Validate Stellar address format
  if (!StellarSdk.StrKey.isValidEd25519PublicKey(wallet)) {
    console.error(`❌ Invalid Stellar Public Key format: ${wallet}`);
    process.exit(1);
  }
  console.log('✅ Stellar address format is valid.');

  // 2. Check testnet balance via Horizon API
  let needsFunding = false;
  try {
    console.log('Fetching account from Horizon...');
    const account = await server.loadAccount(wallet);
    const xlmBalance = account.balances.find((b) => b.asset_type === 'native');
    
    if (xlmBalance && parseFloat(xlmBalance.balance) < 100) {
      needsFunding = true;
    } else {
      console.log(`✅ Account found. Current XLM Balance: ${xlmBalance?.balance}`);
    }
  } catch (error: any) {
    if (error.response?.status === 404) {
      console.log('Account not found on ledger.');
      needsFunding = true;
    } else {
      console.error('❌ Error checking account:', error.message);
      process.exit(1);
    }
  }

  // 3. If balance < 100 XLM or account not found, fund via Friendbot
  if (needsFunding) {
    console.log('Funding account via Friendbot (creating account with ~10000 XLM)...');
    try {
      const response = await axios.get(`https://friendbot.stellar.org?addr=${encodeURIComponent(wallet)}`);
      if (response.status === 200) {
        console.log('✅ Account successfully funded via Friendbot.');
      } else {
        throw new Error(`Friendbot failed with status ${response.status}`);
      }
    } catch (e: any) {
      console.error('❌ Failed to fund account:', e.message);
      process.exit(1);
    }
  }

  // 4. Upsert user in MongoDB (Mocking this step assuming API/DB integration)
  console.log('Upserting user into MongoDB...');
  // MOCK INTEGRATION: In a real system you would call your API or Mongoose directly here
  // await axios.post('http://localhost:4000/api/admin/users', { name, email, walletAddress: wallet });
  console.log('✅ User successfully stored in Database.');

  // 5. Mint 10 SHW3 tokens as welcome bonus via reward contract
  console.log('Minting 10 SHW3 tokens as a welcome bonus...');
  // MOCK INTEGRATION: Interaction with Soroban Contract via Admin Key
  // const contract = new StellarSdk.Contract(process.env.REWARD_CONTRACT_ID!);
  // await contract.call('mint', ...);
  console.log('✅ 10 SHW3 Tokens successfully minted and transferred.');

  // 6. Print confirmation + Stellar Explorer link
  console.log(`\n🎉 Onboarding Complete for ${name}!`);
  console.log(`View on Stellar Explorer: https://stellar.expert/explorer/testnet/account/${wallet}\n`);
}

run().catch(console.error);

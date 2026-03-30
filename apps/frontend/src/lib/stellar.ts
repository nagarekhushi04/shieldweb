import { isConnected, getAddress, signTransaction, requestAccess } from '@stellar/freighter-api';
import * as StellarSdk from '@stellar/stellar-sdk';

export async function isFreighterInstalled(): Promise<boolean> {
  const result = await isConnected();
  return !!result?.isConnected;
}

export async function connectWallet(): Promise<string | null> {
  try {
    const access = await requestAccess();
    if (access && access.address) {
      return access.address;
    }
    const addrResult = await getAddress();
    return addrResult?.address || null;
  } catch (err) {
    console.error("Failed to connect wallet", err);
    return null;
  }
}

export async function getWalletAddress(): Promise<string | null> {
  try {
    const result = await getAddress();
    return result?.address || null;
  } catch {
    return null;
  }
}

export async function signChallenge(challenge: string, walletAddress: string): Promise<string> {
  try {
    // To prove ownership of a Stellar account via Freighter, we create a dummy transaction
    const server = new StellarSdk.Horizon.Server('https://horizon-testnet.stellar.org');
    
    // In newer SDKs, sequenceNumber is a string, we use BigNumber to increment
    const account = await server.loadAccount(walletAddress);
    
    const transaction = new StellarSdk.TransactionBuilder(account, { 
      fee: '100', 
      networkPassphrase: StellarSdk.Networks.TESTNET 
    })
      .addMemo(StellarSdk.Memo.text(challenge.slice(0, 28)))
      .addOperation(StellarSdk.Operation.bumpSequence({ 
        bumpTo: (parseInt(account.sequenceNumber()) + 1).toString()
      }))
      .setTimeout(30)
      .build();

    const xdr = transaction.toXDR();
    const result = await signTransaction(xdr, { 
        networkPassphrase: StellarSdk.Networks.TESTNET 
    });
    
    if (typeof result === 'string') return result;
    return result.signedTxXdr || '';
  } catch (error: unknown) {
    console.error("Signature failed", error);
    const msg = error instanceof Error ? error.message : 'Signature failed';
    throw new Error(msg);
  }
}

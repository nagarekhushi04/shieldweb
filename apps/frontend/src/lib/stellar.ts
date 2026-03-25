import { isConnected, getAddress, signTransaction, requestAccess } from '@stellar/freighter-api';

export async function isFreighterInstalled(): Promise<boolean> {
  return await isConnected();
}

export async function connectWallet(): Promise<string | null> {
  try {
    const access = await requestAccess();
    if (access) {
      return await getAddress();
    }
    return null;
  } catch (err) {
    console.error("Failed to connect wallet", err);
    return null;
  }
}

export async function getWalletAddress(): Promise<string | null> {
  try {
    return await getAddress();
  } catch (err) {
    return null;
  }
}

export async function signChallenge(challenge: string): Promise<string> {
  // Freighter signTransaction does not exactly sign string challenges natively usually unless packed in a Tx
  // Implementing dummy signature mechanism utilizing signTransaction or as standard practice in Stellar Web3
  try {
    const tx = await signTransaction(challenge, { network: 'TESTNET' });
    return tx;
  } catch (error: any) {
    console.error("Signature failed", error);
    throw new Error(error.message || 'Signature failed');
  }
}

import * as StellarSdk from '@stellar/stellar-sdk';
import crypto from 'crypto';
import dotenv from 'dotenv';
import axios from 'axios';

dotenv.config();

const server = new StellarSdk.Horizon.Server(process.env.HORIZON_URL || 'https://horizon-testnet.stellar.org');
const networkPassphrase = StellarSdk.Networks.TESTNET;

export const hashUrl = (url: string): string => {
  return crypto.createHash('sha256').update(url).digest('hex').substring(0, 32);
};

export const checkThreatOnChain = async (urlHash: string): Promise<{found:boolean, verified:boolean, severity:number} | null> => {
    // In a real implementation this would query the Soroban contract
    // Placeholder simulation
    return { found: true, verified: false, severity: 2 };
};

export const reportThreatOnChain = async (reporterSecret: string, urlHash: string, threatType: string, severity: number): Promise<string|null> => {
    // Simulate transaction submission. Real involves Contract building, signing, submitting.
    return crypto.randomBytes(32).toString('hex');
};

export const mintRewardTokens = async (recipientAddress: string, amount: number): Promise<boolean> => {
    // Simulate token mint call
    return true;
};

export const createTestnetAccount = async (): Promise<{publicKey:string, secretKey:string}> => {
    const pair = StellarSdk.Keypair.random();
    try {
        await axios.get(`https://friendbot.stellar.org?addr=${pair.publicKey()}`);
        return { publicKey: pair.publicKey(), secretKey: pair.secret() };
    } catch (e) {
        throw new Error('Friendbot failed');
    }
};

export const getAccountBalance = async (publicKey: string): Promise<{xlm:string, shw3:string}> => {
    try {
        const account = await server.loadAccount(publicKey);
        let xlm = "0";
        account.balances.forEach((b: any) => {
            if (b.asset_type === 'native') xlm = b.balance;
        });
        return { xlm, shw3: "0" };
    } catch (e) {
        return { xlm: "0", shw3: "0" };
    }
};

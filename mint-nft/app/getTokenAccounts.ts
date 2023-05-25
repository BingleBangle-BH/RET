import { GetProgramAccountsFilter , SystemProgram, Connection, Keypair, PublicKey, TransactionMessage,VersionedTransaction, ParsedAccountData, sendAndConfirmTransaction, Transaction } from "@solana/web3.js";
import { Metaplex, keypairIdentity, bundlrStorage, toMetaplexFile, toBigNumber } from "@metaplex-foundation/js";
import { createBurnCheckedInstruction, TOKEN_PROGRAM_ID, getAssociatedTokenAddress, createBurnInstruction, getOrCreateAssociatedTokenAccount, createTransferInstruction } from "@solana/spl-token";
import * as fs from 'fs';
import {METAPLEX, WALLET, USER_WALLET, SOLANA_CONNECTION, IMAGE_LIST, CONFIG, BURN_QUANTITY, TRANSFER_AMOUNT} from './util';

export async function getTokenAccounts():Promise<string[]> {
    const filters:GetProgramAccountsFilter[] = [
        {
          dataSize: 165,    //size of account (bytes)
        },
        {
          memcmp: {
            offset: 32,     //location of our query in the account (bytes)
            bytes: WALLET.publicKey.toBase58(),  //our search criteria, a base58 encoded string
          },            
        }];
    const accounts = await SOLANA_CONNECTION.getParsedProgramAccounts(
        TOKEN_PROGRAM_ID, //new PublicKey("TokenkegQfeZyiNwAJbNbGKPFXCWuBvf9Ss623VQ5DA")
        {filters: filters}
    );
    console.log(`Found ${accounts.length} token account(s)`);
    const list: string[] = [];
    accounts.forEach((account, i) => {
        //Parse the account data
        const parsedAccountInfo:any = account.account.data;
        const mintAddress:string = parsedAccountInfo["parsed"]["info"]["mint"];
        const tokenBalance: number = parsedAccountInfo["parsed"]["info"]["tokenAmount"]["uiAmount"];
        //Log results
        console.log(`Token Account No. ${i + 1}: ${account.pubkey.toString()}`);
        console.log(`--Token Mint: ${mintAddress}`);
        console.log(`--Token Balance: ${tokenBalance}`);
        if (tokenBalance == 1){
            list.push(mintAddress);
        }
    });
    console.log(`Return list: ${list}`);
    return list;
}
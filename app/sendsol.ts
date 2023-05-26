import { GetProgramAccountsFilter , SystemProgram, Connection, Keypair, PublicKey, TransactionMessage,VersionedTransaction, ParsedAccountData, sendAndConfirmTransaction, Transaction } from "@solana/web3.js";
import { Metaplex, keypairIdentity, bundlrStorage, toMetaplexFile, toBigNumber } from "@metaplex-foundation/js";
import { createBurnCheckedInstruction, TOKEN_PROGRAM_ID, getAssociatedTokenAddress, createBurnInstruction, getOrCreateAssociatedTokenAccount, createTransferInstruction } from "@solana/spl-token";
import * as fs from 'fs';
import {METAPLEX, WALLET, USER_WALLET, SOLANA_CONNECTION, IMAGE_LIST, CONFIG, BURN_QUANTITY, TRANSFER_AMOUNT} from './util';
import sendsol_parameters from '../parameters/sendSol_parameters.json'

export async function sendSol(price: number) {
    // Create a transaction to transfer SOL
    const transaction = new Transaction().add(
        SystemProgram.transfer({
        fromPubkey: USER_WALLET.publicKey,
        toPubkey: WALLET.publicKey,
        lamports: price * 10**5, // Convert SOL to lamports
        })
    );
    
    // Sign and send the transaction
    const signature = await sendAndConfirmTransaction(SOLANA_CONNECTION, transaction, [USER_WALLET]);
    console.log(
        '\x1b[32m', //Green Text
        `   Transaction Success!🎉`,
        `\n    https://explorer.solana.com/tx/${signature}?cluster=devnet`
    );
}

sendSol(parseInt(sendsol_parameters.price));
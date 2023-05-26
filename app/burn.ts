import { GetProgramAccountsFilter , SystemProgram, Connection, Keypair, PublicKey, TransactionMessage,VersionedTransaction, ParsedAccountData, sendAndConfirmTransaction, Transaction } from "@solana/web3.js";
import { Metaplex, keypairIdentity, bundlrStorage, toMetaplexFile, toBigNumber } from "@metaplex-foundation/js";
import { createBurnCheckedInstruction, TOKEN_PROGRAM_ID, getAssociatedTokenAddress, createBurnInstruction, getOrCreateAssociatedTokenAccount, createTransferInstruction } from "@solana/spl-token";
import * as fs from 'fs';
import {METAPLEX, WALLET, USER_WALLET, SOLANA_CONNECTION, IMAGE_LIST, CONFIG, BURN_QUANTITY, TRANSFER_AMOUNT} from './util';

export async function burn(MINT_ADDRESS: string){
    console.log(`Attempting to burn ${BURN_QUANTITY} [${MINT_ADDRESS}] tokens from Owner Wallet: ${WALLET.publicKey.toString()}`);
    // Step 1 - Fetch Associated Token Account Address
    console.log(`Step 1 - Fetch Token Account`);
    const account = await getAssociatedTokenAddress(new PublicKey(MINT_ADDRESS), WALLET.publicKey);
    console.log(`    ✅ - Associated Token Account Address: ${account.toString()}`);

    // Step 2 - Create Burn Instructions
    console.log(`Step 2 - Create Burn Instructions`);
    const burnIx = createBurnInstruction(
        account,
        new PublicKey(MINT_ADDRESS),
        WALLET.publicKey,
        1
    )
    console.log(`    ✅ - Burn Instruction Created`);

    // Step 3 - Fetch Blockhash
    console.log(`Step 3 - Fetch Blockhash`);
    const { blockhash, lastValidBlockHeight } = await SOLANA_CONNECTION.getLatestBlockhash('finalized');
    console.log(`    ✅ - Latest Blockhash: ${blockhash}`);

    // Step 4 - Assemble Transaction
    console.log(`Step 4 - Assemble Transaction`);
    const messageV0 = new TransactionMessage({
        payerKey: WALLET.publicKey,
        recentBlockhash: blockhash,
        instructions: [burnIx]
    }).compileToV0Message();
    const transaction = new VersionedTransaction(messageV0);
    transaction.sign([WALLET]);
    console.log(`    ✅ - Transaction Created and Signed`);

    // Step 5 - Execute & Confirm Transaction 
    console.log(`Step 5 - Execute & Confirm Transaction`);
    const txid = await SOLANA_CONNECTION.sendTransaction(transaction);
    console.log("    ✅ - Transaction sent to network");
    const confirmation = await SOLANA_CONNECTION.confirmTransaction({
        signature: txid,
        blockhash: blockhash,
        lastValidBlockHeight: lastValidBlockHeight
    });
    if (confirmation.value.err) { throw new Error("    ❌ - Transaction not confirmed.") }
    console.log('🔥 SUCCESSFUL BURN!🔥', '\n', `https://explorer.solana.com/tx/${txid}?cluster=devnet`);
}
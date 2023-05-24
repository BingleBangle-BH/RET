import { GetProgramAccountsFilter , SystemProgram, Connection, Keypair, PublicKey, TransactionMessage,VersionedTransaction, ParsedAccountData, sendAndConfirmTransaction, Transaction } from "@solana/web3.js";
import { Metaplex, keypairIdentity, bundlrStorage, toMetaplexFile, toBigNumber } from "@metaplex-foundation/js";
import { createBurnCheckedInstruction, TOKEN_PROGRAM_ID, getAssociatedTokenAddress, createBurnInstruction, getOrCreateAssociatedTokenAccount, createTransferInstruction } from "@solana/spl-token";
import * as fs from 'fs';
import usersecret from '../secrets/destSecret.json';
import ownersecret from '../secrets/ownerSecret.json';

const SOLANA_RPC = 'https://api.devnet.solana.com';
const SOLANA_CONNECTION = new Connection(SOLANA_RPC);

const WALLET = Keypair.fromSecretKey(new Uint8Array(ownersecret));
const USER_WALLET = Keypair.fromSecretKey(new Uint8Array(usersecret));

const METAPLEX = Metaplex.make(SOLANA_CONNECTION)
    .use(keypairIdentity(WALLET))
    .use(bundlrStorage({
        address: 'https://devnet.bundlr.network',
        providerUrl: SOLANA_RPC,
        timeout: 60000,
    }));

const IMAGE_LIST = ['commander_cody.jpeg', 'commander_rex.jpeg', 'commander_verd.jpeg'];

const CONFIG = {
    uploadPath: 'uploads/',
    imgType: 'image/jpeg',
    imgName: 'Renewable energy '+Math.floor(Math.random() * 1000000),
    description: 'SOLAR POWER',
    sellerFeeBasisPoints: 500,//500 bp = 5%
    symbol: 'RET',
    creators: [
        {address: WALLET.publicKey, share: 100}
    ]
};

const MINT_ADDRESS = 'GB9Y4CiYNFGbUit23ZWNe8cgpQLuSPaSsVuWcLaQvCQJ'; 
const BURN_QUANTITY = 1; 
const TRANSFER_AMOUNT = 1;

async function uploadImage(filePath: string,fileName: string): Promise<string>  {
    console.log(`Step 1 - Uploading Image`);
    const imgBuffer = fs.readFileSync(filePath+fileName);
    const imgMetaplexFile = toMetaplexFile(imgBuffer,fileName);
    const imgUri = await METAPLEX.storage().upload(imgMetaplexFile);
    console.log(`   Image URI:`,imgUri);
    return imgUri;
}

async function getNumberDecimals(mintAddress: string):Promise<number> {
    const info = await SOLANA_CONNECTION.getParsedAccountInfo(new PublicKey(MINT_ADDRESS));
    const result = (info.value?.data as ParsedAccountData).parsed.info.decimals as number;
    return result;
}

async function uploadMetadata(imgUri: string, imgType: string, nftName: string, description: string, location: string, kwh: string, price: string) {
    console.log(`Step 2 - Uploading Metadata`);
    const { uri } = await METAPLEX
    .nfts()
    .uploadMetadata({
        name: nftName,
        description: description,
        image: imgUri,
        attributes: [
            {trait_type: 'Location', value: location},
            {trait_type: 'Kwh', value: kwh},
            {trait_type: 'Price', value: price}
        ],
        properties: {
            files: [
                {
                    type: imgType,
                    uri: imgUri,
                },
            ]
        }
    });
    console.log('   Metadata URI:',uri);
    return uri;  
}

async function mintNft(metadataUri: string, name: string, sellerFee: number, symbol: string, creators: {address: PublicKey, share: number}[]) {
    console.log(`Step 3 - Minting NFT`);
    const { nft } = await METAPLEX
    .nfts()
    .create({
        uri: metadataUri,
        name: name,
        sellerFeeBasisPoints: sellerFee,
        symbol: symbol,
        creators: creators,
        isMutable: false,
    });
    console.log(`   Success!🎉`);
    console.log(`   Minted NFT: https://explorer.solana.com/address/${nft.address}?cluster=devnet`);
}

async function mint(location: string, kwh: string, price: string) {
    console.log(`Minting ${CONFIG.imgName} to an NFT in Wallet ${WALLET.publicKey.toBase58()}.`);
    //Step 1 - Upload Image
    const imgUri = await uploadImage(CONFIG.uploadPath, IMAGE_LIST[Math.floor(Math.random() * 3)]);
    //Step 2 - Upload Metadata
    const metadataUri = await uploadMetadata(imgUri, CONFIG.imgType, CONFIG.imgName, CONFIG.description, location, kwh, price); 
    //Step 3 - Mint NFT
    mintNft(metadataUri, CONFIG.imgName, CONFIG.sellerFeeBasisPoints, CONFIG.symbol, CONFIG.creators);
}

async function burn(){
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

async function sendTokens(MINT_ADDRESS:string, DESTINATION_WALLET: string) {
    console.log(`Sending ${TRANSFER_AMOUNT} ${(MINT_ADDRESS)} from ${(WALLET.publicKey.toString())} to ${(DESTINATION_WALLET)}.`)
    //Step 1
    console.log(`1 - Getting Source Token Account`);
    let sourceAccount = await getOrCreateAssociatedTokenAccount(
        SOLANA_CONNECTION, 
        WALLET,
        new PublicKey(MINT_ADDRESS),
        WALLET.publicKey
    );
    console.log(`    Source Account: ${sourceAccount.address.toString()}`);
    
    //Step 2
    console.log(`2 - Getting Destination Token Account`);
    let destinationAccount = await getOrCreateAssociatedTokenAccount(
        SOLANA_CONNECTION, 
        WALLET,
        new PublicKey(MINT_ADDRESS),
        new PublicKey(DESTINATION_WALLET)
    );
    console.log(`    Destination Account: ${destinationAccount.address.toString()}`);

    //Step 3
    console.log(`3 - Fetching Number of Decimals for Mint: ${MINT_ADDRESS}`);
    const numberDecimals = await getNumberDecimals(MINT_ADDRESS);
    console.log(`    Number of Decimals: ${numberDecimals}`);

    //Step 4
    console.log(`4 - Creating and Sending Transaction`);
    const tx = new Transaction();
    tx.add(createTransferInstruction(
        sourceAccount.address,
        destinationAccount.address,
        WALLET.publicKey,
        TRANSFER_AMOUNT * Math.pow(10, numberDecimals)
    ))

    const latestBlockHash = await SOLANA_CONNECTION.getLatestBlockhash('confirmed');
    tx.recentBlockhash = await latestBlockHash.blockhash;    
    const signature = await sendAndConfirmTransaction(SOLANA_CONNECTION,tx,[WALLET]);
    console.log(
        '\x1b[32m', //Green Text
        `   Transaction Success!🎉`,
        `\n    https://explorer.solana.com/tx/${signature}?cluster=devnet`
    );
}

async function sendSol() {
    // Create a transaction to transfer SOL
    const transaction = new Transaction().add(
        SystemProgram.transfer({
        fromPubkey: USER_WALLET.publicKey,
        toPubkey: WALLET.publicKey,
        lamports: 1 * 10**7, // Convert SOL to lamports
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


async function getTokenAccounts():Promise<string[]> {
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


// Test
async function test(){
    //Parameters: location, kwh, price
    await mint("Woodlands", "10", "$20");

    //Get all mint address
    const list = await getTokenAccounts();
    
    //Parameters: mint address, destination wallet address
    await sendTokens(list[Math.floor(Math.random() * list.length)], '4g7fBAWCGATnyZBeHacN3UrZ1ujLF1SRayR7gjtzJaa9'); // receiver wallet address

    await sendSol();
}

test();
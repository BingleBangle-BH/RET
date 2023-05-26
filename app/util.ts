import { GetProgramAccountsFilter , SystemProgram, Connection, Keypair, PublicKey, TransactionMessage,VersionedTransaction, ParsedAccountData, sendAndConfirmTransaction, Transaction } from "@solana/web3.js";
import { Metaplex, keypairIdentity, bundlrStorage, toMetaplexFile, toBigNumber } from "@metaplex-foundation/js";

import usersecret from '../secrets/destSecret.json';
import ownersecret from '../secrets/ownerSecret.json';

const SOLANA_RPC = 'https://api.devnet.solana.com';
export const SOLANA_CONNECTION = new Connection(SOLANA_RPC);

export const WALLET = Keypair.fromSecretKey(new Uint8Array(ownersecret));
export const USER_WALLET = Keypair.fromSecretKey(new Uint8Array(usersecret));

export const IMAGE_LIST = ['commander_cody.jpeg', 'commander_rex.jpeg', 'commander_verd.jpeg'];
export const BURN_QUANTITY = 1; 
export const TRANSFER_AMOUNT = 1;

export const METAPLEX = Metaplex.make(SOLANA_CONNECTION)
    .use(keypairIdentity(WALLET))
    .use(bundlrStorage({
        address: 'https://devnet.bundlr.network',
        providerUrl: SOLANA_RPC,
        timeout: 60000,
    }));


export const CONFIG = {
    uploadPath: '../uploads/',
    imgType: 'image/jpeg',
    imgName: 'Renewable energy '+Math.floor(Math.random() * 1000000),
    description: 'SOLAR POWER',
    sellerFeeBasisPoints: 500,//500 bp = 5%
    symbol: 'RET',
    creators: [
        {address: WALLET.publicKey, share: 100}
    ]
};


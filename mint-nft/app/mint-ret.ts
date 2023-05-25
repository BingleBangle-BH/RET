import { GetProgramAccountsFilter , SystemProgram, Connection, Keypair, PublicKey, TransactionMessage,VersionedTransaction, ParsedAccountData, sendAndConfirmTransaction, Transaction } from "@solana/web3.js";
import { Metaplex, keypairIdentity, bundlrStorage, toMetaplexFile, toBigNumber } from "@metaplex-foundation/js";
import {METAPLEX, WALLET, USER_WALLET, SOLANA_CONNECTION, IMAGE_LIST, CONFIG, BURN_QUANTITY, TRANSFER_AMOUNT} from './util';
import mint_parameters from '../parameters/mint_parameters.json'
import * as fs from 'fs';

async function uploadImage(filePath: string,fileName: string): Promise<string>  {
    console.log(`Step 1 - Uploading Image`);
    const imgBuffer = fs.readFileSync(filePath+fileName);
    const imgMetaplexFile = toMetaplexFile(imgBuffer,fileName);
    const imgUri = await METAPLEX.storage().upload(imgMetaplexFile);
    console.log(`   Image URI:`,imgUri);
    return imgUri;
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

export async function mint_ret(location: string, kwh: string, price: string) {
    console.log(`Minting ${CONFIG.imgName} to an NFT in Wallet ${WALLET.publicKey.toBase58()}.`);
    //Step 1 - Upload Image
    const imgUri = await uploadImage(CONFIG.uploadPath, IMAGE_LIST[Math.floor(Math.random() * 3)]);
    //Step 2 - Upload Metadata
    const metadataUri = await uploadMetadata(imgUri, CONFIG.imgType, CONFIG.imgName, CONFIG.description, location, kwh, price); 
    //Step 3 - Mint NFT
    mintNft(metadataUri, CONFIG.imgName, CONFIG.sellerFeeBasisPoints, CONFIG.symbol, CONFIG.creators);
}

mint_ret(mint_parameters.location, mint_parameters.kwh, mint_parameters.price);
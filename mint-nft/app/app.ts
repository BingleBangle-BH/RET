import {getTokenAccounts} from './getTokenAccounts'
import {sendSol} from './sendsol'
import {sendTokens} from './sendtoken'
import {mint_ret} from './mint-ret'
import mint_parameters from '../parameters/mint_parameters.json'
import sendsol_parameters from '../parameters/sendSol_parameters.json'
import sendTokens_parameters from '../parameters/sendToken_parameters.json'



async function test(){

    //Parameters: location, kwh, price
    await mint_ret(mint_parameters.location, mint_parameters.kwh, mint_parameters.price);

    //Get all mint address
    const list = await getTokenAccounts();
    
    //Parameters: mint address, destination wallet address
    await sendTokens(list[Math.floor(Math.random() * list.length)], sendTokens_parameters.receiver); // receiver wallet address

    await sendSol(parseInt(sendsol_parameters.price));
}

test()
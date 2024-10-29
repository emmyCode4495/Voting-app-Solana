import { BN, Program } from '@coral-xyz/anchor';
import { PublicKey, Transaction } from "@solana/web3.js";
import { ACTIONS_CORS_HEADERS, ActionGetResponse, ActionPostRequest, createPostResponse } from "@solana/actions"
import { Connection } from "@solana/web3.js";
import {Votersystem} from '../../../../anchor/target/types/votersystem'


const IDL = require('../../../../anchor/target/idl/votersystem.json')

export const OPTIONS = GET

export async function GET(request: Request) {

    const actionMetaData: ActionGetResponse = {
        icon:"https://images.unsplash.com/photo-1668091818168-61a18ea51275?q=80&w=1635&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
        title:"Is FTX coming back to life",
        description:"FTX is back to business or not",
        label:"Vote",
        links:{
            actions: [
                {
                    label: "Barely back",
                    href:"/api/vote?candidate=barely-back",
                },
                {
                    label: "Fully back",
                    href:"/api/vote?candidate=fully-back"
                }
            ]
        }
    };
    return Response.json(actionMetaData, {headers: ACTIONS_CORS_HEADERS})
  }
  
  export async function POST(request: Request){
    
    const url = new URL(request.url)
    const candidate = url.searchParams.get("candidate");

    if(candidate != "barely-back" && candidate != "fully-back"){
        return new Response("invalid Candidate", {status:400, headers: ACTIONS_CORS_HEADERS})
    }

    const connection = new Connection("http://127.0.0.1:8899", "confirmed");
    const program: Program<Votersystem> = new Program(IDL, {connection})

    const body: ActionPostRequest = await request.json()
    let voter;

    try{
        voter = new PublicKey(body.account)
    }catch(error){
        return new Response("imvalid account", {status:400, headers:ACTIONS_CORS_HEADERS})
    }

    const instruction = program.methods
    .vote(candidate, new BN(1))
    .accounts({
        signer: voter,
    })
    .instruction();

    const blockhash = await connection.getLatestBlockhash();

    const transaction = new Transaction({
        feePayer: voter,
        blockhash: blockhash.blockhash,
        lastValidBlockHeight: blockhash.lastValidBlockHeight
    }).add(instruction)

    const response = await createPostResponse({
        fields:{
            transaction: transaction
        }
    });

    return Response.json(response, {headers: ACTIONS_CORS_HEADERS})
  }
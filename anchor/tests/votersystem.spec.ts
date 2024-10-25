import * as anchor from '@coral-xyz/anchor'
import {Program} from '@coral-xyz/anchor'
import {Keypair, PublicKey} from '@solana/web3.js'
import {Votersystem} from '../target/types/votersystem'
import { startAnchor } from "solana-bankrun";
import { BankrunProvider } from "anchor-bankrun";
import { publicKey } from '@coral-xyz/anchor/dist/cjs/utils';



const IDL = require('../target/idl/votersystem.json');
const votingAddress = new PublicKey("AsjZ3kWAUSQRNt2pZVeJkywhZ6gpLpHZmJjduPmKZDZZ");

describe('votersystem', () => {
  
  it('Initialize Votersystem', async () => {
    const context = await startAnchor("", [{name:"voting", programId:votingAddress }], []);
    const provider = new BankrunProvider(context);

    const votingProgram = new Program<Votersystem>(
      IDL,
      provider,
    );

    await votingProgram.methods.initializePoll(
      new anchor.BN(1),
      "Who is your favourite candidate",
      new anchor.BN(0),
      new anchor.BN(1728836508),
    ).rpc();

    const [pollAddress] = PublicKey.findProgramAddressSync(
      [new anchor.BN(1).toArrayLike(Buffer, 'le', 8)],
      votingAddress,
    )

    const poll = await votingProgram.account.poll.fetch(pollAddress);
    console.log(poll);

    expect(poll.pollId.toNumber()).toEqual(1);
    expect(poll.description).toEqual("Answer Anything");
    expect(poll.pollStart).toBeLessThan(poll.pollEnd.toNumber());
    
    
  });
});

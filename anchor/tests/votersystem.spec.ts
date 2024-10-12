import * as anchor from '@coral-xyz/anchor'
import {Program} from '@coral-xyz/anchor'
import {Keypair} from '@solana/web3.js'
import {Votersystem} from '../target/types/votersystem'
import '@types/jest';

describe('votersystem', () => {
  // Configure the client to use the local cluster.
  const provider = anchor.AnchorProvider.env()
  anchor.setProvider(provider)
  const payer = provider.wallet as anchor.Wallet

  const program = anchor.workspace.Votersystem as Program<Votersystem>

  const votersystemKeypair = Keypair.generate()

  it('Initialize Votersystem', async () => {
    await program.methods
      .initialize()
      .accounts({
        votersystem: votersystemKeypair.publicKey,
        payer: payer.publicKey,
      })
      .signers([votersystemKeypair])
      .rpc()

    const currentCount = await program.account.votersystem.fetch(votersystemKeypair.publicKey)

    expect(currentCount.count).toEqual(0)
  })

  it('Increment Votersystem', async () => {
    await program.methods.increment().accounts({ votersystem: votersystemKeypair.publicKey }).rpc()

    const currentCount = await program.account.votersystem.fetch(votersystemKeypair.publicKey)

    expect(currentCount.count).toEqual(1)
  })

  it('Increment Votersystem Again', async () => {
    await program.methods.increment().accounts({ votersystem: votersystemKeypair.publicKey }).rpc()

    const currentCount = await program.account.votersystem.fetch(votersystemKeypair.publicKey)

    expect(currentCount.count).toEqual(2)
  })

  it('Decrement Votersystem', async () => {
    await program.methods.decrement().accounts({ votersystem: votersystemKeypair.publicKey }).rpc()

    const currentCount = await program.account.votersystem.fetch(votersystemKeypair.publicKey)

    expect(currentCount.count).toEqual(1)
  })

  it('Set votersystem value', async () => {
    await program.methods.set(42).accounts({ votersystem: votersystemKeypair.publicKey }).rpc()

    const currentCount = await program.account.votersystem.fetch(votersystemKeypair.publicKey)

    expect(currentCount.count).toEqual(42)
  })

  it('Set close the votersystem account', async () => {
    await program.methods
      .close()
      .accounts({
        payer: payer.publicKey,
        votersystem: votersystemKeypair.publicKey,
      })
      .rpc()

    // The account should no longer exist, returning null.
    const userAccount = await program.account.votersystem.fetchNullable(votersystemKeypair.publicKey)
    expect(userAccount).toBeNull()
  })
})

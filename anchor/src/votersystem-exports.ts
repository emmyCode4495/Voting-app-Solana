// Here we export some useful types and functions for interacting with the Anchor program.
import { AnchorProvider, Program } from '@coral-xyz/anchor'
import { Cluster, PublicKey } from '@solana/web3.js'
import VotersystemIDL from '../target/idl/votersystem.json'
import type { Votersystem } from '../target/types/votersystem'

// Re-export the generated IDL and type
export { Votersystem, VotersystemIDL }

// The programId is imported from the program IDL.
export const VOTERSYSTEM_PROGRAM_ID = new PublicKey(VotersystemIDL.address)

// This is a helper function to get the Votersystem Anchor program.
export function getVotersystemProgram(provider: AnchorProvider) {
  return new Program(VotersystemIDL as Votersystem, provider)
}

// This is a helper function to get the program ID for the Votersystem program depending on the cluster.
export function getVotersystemProgramId(cluster: Cluster) {
  switch (cluster) {
    case 'devnet':
    case 'testnet':
      // This is the program ID for the Votersystem program on devnet and testnet.
      return new PublicKey('CounNZdmsQmWh7uVngV9FXW2dZ6zAgbJyYsvBpqbykg')
    case 'mainnet-beta':
    default:
      return VOTERSYSTEM_PROGRAM_ID
  }
}

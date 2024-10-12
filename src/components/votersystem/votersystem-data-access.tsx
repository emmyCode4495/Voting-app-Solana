'use client'

import {getVotersystemProgram, getVotersystemProgramId} from '@project/anchor'
import {useConnection} from '@solana/wallet-adapter-react'
import {Cluster, Keypair, PublicKey} from '@solana/web3.js'
import {useMutation, useQuery} from '@tanstack/react-query'
import {useMemo} from 'react'
import toast from 'react-hot-toast'
import {useCluster} from '../cluster/cluster-data-access'
import {useAnchorProvider} from '../solana/solana-provider'
import {useTransactionToast} from '../ui/ui-layout'

export function useVotersystemProgram() {
  const { connection } = useConnection()
  const { cluster } = useCluster()
  const transactionToast = useTransactionToast()
  const provider = useAnchorProvider()
  const programId = useMemo(() => getVotersystemProgramId(cluster.network as Cluster), [cluster])
  const program = getVotersystemProgram(provider)

  const accounts = useQuery({
    queryKey: ['votersystem', 'all', { cluster }],
    queryFn: () => program.account.votersystem.all(),
  })

  const getProgramAccount = useQuery({
    queryKey: ['get-program-account', { cluster }],
    queryFn: () => connection.getParsedAccountInfo(programId),
  })

  const initialize = useMutation({
    mutationKey: ['votersystem', 'initialize', { cluster }],
    mutationFn: (keypair: Keypair) =>
      program.methods.initialize().accounts({ votersystem: keypair.publicKey }).signers([keypair]).rpc(),
    onSuccess: (signature) => {
      transactionToast(signature)
      return accounts.refetch()
    },
    onError: () => toast.error('Failed to initialize account'),
  })

  return {
    program,
    programId,
    accounts,
    getProgramAccount,
    initialize,
  }
}

export function useVotersystemProgramAccount({ account }: { account: PublicKey }) {
  const { cluster } = useCluster()
  const transactionToast = useTransactionToast()
  const { program, accounts } = useVotersystemProgram()

  const accountQuery = useQuery({
    queryKey: ['votersystem', 'fetch', { cluster, account }],
    queryFn: () => program.account.votersystem.fetch(account),
  })

  const closeMutation = useMutation({
    mutationKey: ['votersystem', 'close', { cluster, account }],
    mutationFn: () => program.methods.close().accounts({ votersystem: account }).rpc(),
    onSuccess: (tx) => {
      transactionToast(tx)
      return accounts.refetch()
    },
  })

  const decrementMutation = useMutation({
    mutationKey: ['votersystem', 'decrement', { cluster, account }],
    mutationFn: () => program.methods.decrement().accounts({ votersystem: account }).rpc(),
    onSuccess: (tx) => {
      transactionToast(tx)
      return accountQuery.refetch()
    },
  })

  const incrementMutation = useMutation({
    mutationKey: ['votersystem', 'increment', { cluster, account }],
    mutationFn: () => program.methods.increment().accounts({ votersystem: account }).rpc(),
    onSuccess: (tx) => {
      transactionToast(tx)
      return accountQuery.refetch()
    },
  })

  const setMutation = useMutation({
    mutationKey: ['votersystem', 'set', { cluster, account }],
    mutationFn: (value: number) => program.methods.set(value).accounts({ votersystem: account }).rpc(),
    onSuccess: (tx) => {
      transactionToast(tx)
      return accountQuery.refetch()
    },
  })

  return {
    accountQuery,
    closeMutation,
    decrementMutation,
    incrementMutation,
    setMutation,
  }
}

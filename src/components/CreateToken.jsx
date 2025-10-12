import React from 'react'
import { createInitializeMint2Instruction, createMint, getMinimumBalanceForRentExemptMint, MINT_SIZE } from "@solana/spl-token"
import {  Keypair, sendAndConfirmTransaction, SystemProgram, Transaction } from '@solana/web3.js'
import { useWallet } from '@solana/wallet-adapter-react';



function CreateToken() {

  const wallet = useWallet();

  async function createToken(){

    const keypair = Keypair.generate();
      const transaction = new Transaction().add(
         SystemProgram.createAccount({
          fromPubkey: payer.publicKey,
          newAccountPubkey: keypair.publicKey,
          space: MINT_SIZE,
          lamports,
          programId,
        }),
        createInitializeMint2Instruction(keypair.publicKey,decodeInitializeMultisigInstruction,MintCloseAuthorityLayout,freezeAuthority,programId)
      );

      transaction.partialSign(keypair)
      wallet.signAllTransactions(transaction)
      
      // await sendAndConfirmTransaction(connection,transaction,[payer,keypair],confirmOptions)
  }


  return (
    <div className='h-screen w-full flex justify-center items-center bg-neutral-800 font-serif'>
        <div className='text-white bg-neutral-950 w-[40%] h-[400px] p-3 rounded-lg'>
            <div className='flex flex-col gap-6 m-6'>
              <input className='p-2 border rounded-lg' type="text" placeholder='Token Name' />
              <input className='p-2 border rounded-lg' type="text" placeholder='Token Symbol' />
              <input className='p-2 border rounded-lg' type="text" placeholder='Initial Supply' />
              <input className='p-2 border rounded-lg' type="url" placeholder='Token Image URL' />
              <button type="button" 
                className='mt-10 bg-amber-700 p-2 rounded-lg cursor-pointer'
                onClick={createToken}

              >Create Token</button>
            </div>
        </div>
    </div>
  )
}

export default CreateToken
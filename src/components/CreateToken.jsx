import { Keypair, SystemProgram, Transaction } from "@solana/web3.js";
import { useConnection, useWallet } from '@solana/wallet-adapter-react';
import { TOKEN_2022_PROGRAM_ID, createMintToInstruction, createAssociatedTokenAccountInstruction, getMintLen, createInitializeMetadataPointerInstruction, createInitializeMintInstruction, TYPE_SIZE, LENGTH_SIZE, ExtensionType, getAssociatedTokenAddressSync } from "@solana/spl-token"
import { createInitializeInstruction, pack } from '@solana/spl-token-metadata';
import { useState } from "react";



function CreateToken() {

    const [tokenName, setTokenName] = useState('')
    const [symbol, setSymbol] = useState('')
    const [url, setUrl] = useState('')
    const [initialSupply, setInitialSupply] = useState('')

    const { connection } = useConnection();
    const wallet = useWallet();

    async function createToken() {
        const mintKeypair = Keypair.generate();
        const metadata = {
            mint: mintKeypair.publicKey,
            name: tokenName,
            symbol: symbol,
            uri: url,
            supply: initialSupply,
            additionalMetadata: [],
        };

        const mintLen = getMintLen([ExtensionType.MetadataPointer]);
        const metadataLen = TYPE_SIZE + LENGTH_SIZE + pack(metadata).length;

        const lamports = await connection.getMinimumBalanceForRentExemption(mintLen + metadataLen);

        const transaction = new Transaction().add(
            SystemProgram.createAccount({
                fromPubkey: wallet.publicKey,
                newAccountPubkey: mintKeypair.publicKey,
                space: mintLen,
                lamports,
                programId: TOKEN_2022_PROGRAM_ID,
            }),
            createInitializeMetadataPointerInstruction(mintKeypair.publicKey, wallet.publicKey, mintKeypair.publicKey, TOKEN_2022_PROGRAM_ID),
            createInitializeMintInstruction(mintKeypair.publicKey, 9, wallet.publicKey, null, TOKEN_2022_PROGRAM_ID),
            createInitializeInstruction({
                programId: TOKEN_2022_PROGRAM_ID,
                mint: mintKeypair.publicKey,
                metadata: mintKeypair.publicKey,
                name: metadata.name,
                symbol: metadata.symbol,
                uri: metadata.uri,
                mintAuthority: wallet.publicKey,
                updateAuthority: wallet.publicKey,
            }),
        );
            
        transaction.feePayer = wallet.publicKey;
        transaction.recentBlockhash = (await connection.getLatestBlockhash()).blockhash;
        transaction.partialSign(mintKeypair);

        await wallet.sendTransaction(transaction, connection);

        console.log(`Token mint created at ${mintKeypair.publicKey.toBase58()}`);
        const associatedToken = getAssociatedTokenAddressSync(
            mintKeypair.publicKey,
            wallet.publicKey,
            false,
            TOKEN_2022_PROGRAM_ID,
        );

        console.log(associatedToken.toBase58());

        const transaction2 = new Transaction().add(
            createAssociatedTokenAccountInstruction(
                wallet.publicKey,
                associatedToken,
                wallet.publicKey,
                mintKeypair.publicKey,
                TOKEN_2022_PROGRAM_ID,
            ),
        );

        await wallet.sendTransaction(transaction2, connection);

        const transaction3 = new Transaction().add(
            createMintToInstruction(mintKeypair.publicKey, associatedToken, wallet.publicKey, 1000000000, [], TOKEN_2022_PROGRAM_ID)
        );

        await wallet.sendTransaction(transaction3, connection);

        console.log("Minted!")

        setTokenName('')
        setSymbol('')
        setInitialSupply('')
        setUrl('')


    }


  return (
    <div className='h-screen w-full flex justify-center items-center bg-neutral-800 font-serif'>
        <div className='text-white bg-neutral-950 w-[40%] h-[400px] p-3 rounded-lg'>
            <div className='flex flex-col gap-6 m-6'>
              <input 
              className='p-2 border rounded-lg' type="text" placeholder='Token Name'
              value={tokenName}
              onChange={(e)=>{setTokenName(e.target.value)}}
               />
              <input 
              className='p-2 border rounded-lg' type="text" placeholder='Token Symbol'
              value={symbol}
              onChange={(e)=>{setSymbol(e.target.value)}}
              
              />
              <input 
              className='p-2 border rounded-lg' type="text" placeholder='Initial Supply'
              value={initialSupply}
              onChange={(e)=>{setInitialSupply(e.target.value)}}
               />
              <input 
               className='p-2 border rounded-lg' type="url" placeholder='Token Image URL'
               value={url}
               onChange={(e)=>{setUrl(e.target.value)}}
                />
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
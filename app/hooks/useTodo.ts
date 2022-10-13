import {
  useAnchorWallet,
  useConnection,
  useWallet,
} from "@solana/wallet-adapter-react";
import { useEffect, useMemo, useState } from "react";
import { IDL as todoIdl } from "../constants/idl";
import { TODO_PROGRAM_PUBKEY } from "../constants";
import * as anchor from "@project-serum/anchor";
import {
  ASSOCIATED_TOKEN_PROGRAM_ID,
  TOKEN_PROGRAM_ID,
  TOKEN_2022_PROGRAM_ID,
  getAssociatedTokenAddress,
  MINT_SIZE,
  createInitializeMintInstruction,
  createAssociatedTokenAccount,
  createAssociatedTokenAccountInstruction,
} from "@solana/spl-token";

export const useTodo = () => {
  const { connection } = useConnection();
  const { publicKey } = useWallet();
  const anchorWallet = useAnchorWallet();

  const [transactionPending, setTransactionPending] = useState(false);
  const { PublicKey, SystemProgram } = anchor.web3;

  const TOKEN_METADATA_PROGRAM_ID = new PublicKey(
    "metaqbxxUerdq28cj1RbAWkYQm3ybzjb6a8bt518x1s"
  );

  const program = useMemo(() => {
    if (anchorWallet) {
      const provider = new anchor.AnchorProvider(
        connection,
        anchorWallet,
        anchor.AnchorProvider.defaultOptions()
      );
      return new anchor.Program(todoIdl as any, TODO_PROGRAM_PUBKEY, provider);
    }
  }, [connection, anchorWallet]);

  useEffect(() => {
    if (publicKey && program && !transactionPending) {
    }
  }, [publicKey, program, transactionPending]);

  // find meata data ATA
  const getMetaData = async (
    mint: anchor.web3.PublicKey
  ): Promise<anchor.web3.PublicKey> => {
    return (
      await anchor.web3.PublicKey.findProgramAddress(
        [
          Buffer.from("metadata"),
          TOKEN_METADATA_PROGRAM_ID.toBuffer(),
          mint.toBuffer(),
        ],
        TOKEN_METADATA_PROGRAM_ID
      )
    )[0];
  };

  const getMasterEdition = async (
    mint: anchor.web3.PublicKey
  ): Promise<anchor.web3.PublicKey> => {
    return (
      await anchor.web3.PublicKey.findProgramAddress(
        [
          Buffer.from("metadata"),
          TOKEN_METADATA_PROGRAM_ID.toBuffer(),
          mint.toBuffer(),
          Buffer.from("edition"),
        ],
        TOKEN_METADATA_PROGRAM_ID
      )
    )[0];
  };

  const mintNFT = async () => {
    try {
      if (program && publicKey) {
        console.log({ MINT_SIZE });
        const lamport: number =
          await program.provider.connection.getMinimumBalanceForRentExemption(
            MINT_SIZE
          );

        const mintKey: anchor.web3.Keypair = anchor.web3.Keypair.generate();

        const nftTokenAccount = await getAssociatedTokenAddress(
          mintKey.publicKey,
          publicKey
        );

        console.log("NFT Account: ", nftTokenAccount.toBase58());

        const mint_tx: anchor.web3.Transaction =
          new anchor.web3.Transaction().add(
            anchor.web3.SystemProgram.createAccount({
              fromPubkey: publicKey,
              newAccountPubkey: mintKey.publicKey,
              lamports: lamport,
              programId: TOKEN_PROGRAM_ID,
              space: MINT_SIZE,
            }),
            createInitializeMintInstruction(
              mintKey.publicKey,
              0,
              publicKey,
              publicKey
            ),
            createAssociatedTokenAccountInstruction(
              publicKey,
              nftTokenAccount,
              publicKey,
              mintKey.publicKey
            )
          );

        const res = await program.provider.sendAndConfirm?.(mint_tx, [mintKey]);

        console.log(
          await program.provider.connection.getParsedAccountInfo(
            mintKey.publicKey
          )
        );

        console.log("Account : ", res);
        console.log("Mint key : ", mintKey.publicKey.toString());
        console.log("User : ", publicKey.toString());

        const metadataAddress = await getMetaData(mintKey.publicKey);
        const masterEddition = await getMasterEdition(mintKey.publicKey);

        console.log("MetaData Address : ", metadataAddress.toBase58());
        console.log("Master Eddition : ", masterEddition.toBase58());


        const tx = await program.methods.mintNFT(mintKey.publicKey , "google.com" , "Mint #1").accounts().rpc();
      }
    } catch (error) {
      console.error(error);
    }
  };

  return { mintNFT };
};

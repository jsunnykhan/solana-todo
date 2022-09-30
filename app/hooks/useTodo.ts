import {
  useAnchorWallet,
  useConnection,
  useWallet,
} from "@solana/wallet-adapter-react";
import { useEffect, useMemo, useState } from "react";
import { IDL as todoIdl } from "../constants/idl";

import * as anchor from "@project-serum/anchor";
import { TODO_PROGRAM_PUBKEY } from "../constants";
import { findProgramAddressSync } from "@project-serum/anchor/dist/cjs/utils/pubkey";
import { utf8 } from "@project-serum/anchor/dist/cjs/utils/bytes";
import { authorFilter } from "../utils";
import { SystemProgram, PublicKey } from "@solana/web3.js";
import { todoType } from "../interface/todoInterface";
import { BN } from "bn.js";

export const useTodo = () => {
  const { connection } = useConnection();
  const { publicKey } = useWallet();
  const anchorWallet = useAnchorWallet();
  const [todo, setTodo] = useState([]);
  const [lastTodo, setLastTodo] = useState<number>(0);
  const [transactionPending, setTransactionPending] = useState(false);

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

  const findTodoAccount = async () => {
    if (program && publicKey && !transactionPending) {
      try {
        const [profilePda, bump] = findProgramAddressSync(
          [utf8.encode("USER_STATE"), publicKey.toBuffer()],
          program.programId
        );
        const profileAccount: any = await program.account.userProfile.fetch(
          profilePda
        );
        if (profileAccount) {
          setLastTodo(profileAccount.lastTodo as number);

          const todoAccount: any = await program.account.todoAccount.all([
            authorFilter(publicKey.toString()),
          ]);
          setTodo(todoAccount);
        } else {
          console.log("No data account");
        }
      } catch (error) {
        console.error(error);
      }
    }
  };

  const initUser = async () => {
    if (program && publicKey) {
      try {
        setTransactionPending(true);
        const [profilePda, bump] = findProgramAddressSync(
          [utf8.encode("USER_STATE"), publicKey.toBuffer()],
          program.programId
        );

        const tx = await program.methods
          .initializeUser()
          .accounts({
            userProfile: profilePda,
            authority: publicKey,
            systemProgram: SystemProgram.programId,
          })
          .rpc();

        console.log(tx);
      } catch (error) {
        setTransactionPending(false);
        console.log(error);
      } finally {
        setTransactionPending(false);
      }
    }
  };

  const addTodo = async () => {
    if (publicKey && program) {
      try {
        setTransactionPending(true);
        const [profilePda, bump] = findProgramAddressSync(
          [utf8.encode("USER_STATE"), publicKey.toBuffer()],
          program.programId
        );

        const [todoPda, todBump] = findProgramAddressSync(
          [
            utf8.encode("TODO_STATE"),
            publicKey.toBuffer(),
            Uint8Array.from([lastTodo]),
          ],
          program.programId
        );

        const content = prompt("Add Todo");

        if (!content) {
          return;
        }

        const tx = await program.methods
          .addTodo(content)
          .accounts({
            userProfile: profilePda,
            todoAccount: todoPda,
            authority: publicKey,
            systemProgram: SystemProgram.programId,
          })
          .rpc();
        setLastTodo((pre: number) => (pre += 1));
      } catch (error) {
        console.log(error);
      } finally {
        setTransactionPending(false);
      }
    }
  };

  const markedTodo = async (idx: number) => {
    if (publicKey && program) {
      try {
        setTransactionPending(true);
        const [profilePda, bump] = findProgramAddressSync(
          [utf8.encode("USER_STATE"), publicKey.toBuffer()],
          program.programId
        );

        const [todoPda, todBump] = findProgramAddressSync(
          [
            utf8.encode("TODO_STATE"),
            publicKey.toBuffer(),
            Uint8Array.from([idx]),
          ],
          program.programId
        );

        const tx = await program.methods
          .markTodo(idx)
          .accounts({
            userProfile: profilePda,
            todoAccount: todoPda,
            authority: publicKey,
            systemProgram: SystemProgram.programId,
          })
          .rpc();
      } catch (error) {
        console.error(error);
      } finally {
        setTransactionPending(false);
      }
    }
  };

  const removeTodo = async (idx: number) => {
    if (program && publicKey) {
      try {
        setTransactionPending(true);
        const [profilePda, bump] = findProgramAddressSync(
          [utf8.encode("USER_STATE"), publicKey.toBuffer()],
          program.programId
        );

        const [todoPda, todBump] = findProgramAddressSync(
          [
            utf8.encode("TODO_STATE"),
            publicKey.toBuffer(),
            Uint8Array.from([idx]),
          ],
          program.programId
        );

        const tx = await program.methods
          .removeTodo(idx)
          .accounts({
            userProfile: profilePda,
            todoAccount: todoPda,
            authority: publicKey,
            systemProgram: SystemProgram.programId,
          })
          .rpc();
      } catch (error) {
        console.error(error);
      } finally {
        setTransactionPending(false);
      }
    }
  };

  const updateTodo = async (idx: number, content: string) => {
    if (program && publicKey) {
      try {
        setTransactionPending(true);
        const [todoPda, todBump] = findProgramAddressSync(
          [
            utf8.encode("TODO_STATE"),
            publicKey.toBuffer(),
            Uint8Array.from([idx]),
          ],
          program.programId
        );

        const tx = await program.methods
          .updateTodo(idx, content)
          .accounts({
            authority: publicKey,
            todoAccount: todoPda,
            systemProgram: SystemProgram.programId,
          })
          .rpc();
        console.log(tx);
      } catch (error) {
        console.error(error);
      } finally {
        setTransactionPending(false);
      }
    }
  };

  const sendToken = async (
    lamport: number = 100000000,
    _to: string = "EuAh6rxJv6CJJeqUZ69ocNxn4jUMN61FKYoFXQkPu3JH"
  ) => {
    if (program && publicKey) {
      try {
        const tx = await program.methods
          .sendToken(new anchor.BN(lamport))
          .accounts({
            from: publicKey,
            to: _to,
            systemProgram: SystemProgram.programId,
          })
          .rpc();
      } catch (error) {
        console.error(error);
      }
    }
  };

  useEffect(() => {
    if (publicKey && program && !transactionPending) {
      findTodoAccount();
    }
  }, [publicKey, program, transactionPending]);

  const completeTodo = todo.filter((data: todoType) => data.account.marked);
  const pendingTodo = todo.filter((data: todoType) => !data.account.marked);

  return {
    initUser,
    addTodo,
    markedTodo,
    removeTodo,
    updateTodo,
    sendToken,
    completeTodo,
    pendingTodo,
  };
};

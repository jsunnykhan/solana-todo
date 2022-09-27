import {
  useAnchorWallet,
  useConnection,
  useWallet,
} from "@solana/wallet-adapter-react";
import { useEffect, useState } from "react";

export const useTodo = async () => {
  const { connection } = useConnection();
  const { publicKey } = useWallet();
  const anchorWallet = useAnchorWallet();

  const [todo, setTodo] = useState([]);


  useEffect(()=> {
     
  },[])
};

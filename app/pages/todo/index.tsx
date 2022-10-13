import { WalletMultiButton } from "@solana/wallet-adapter-react-ui";
import { Button } from "@solana/wallet-adapter-react-ui/lib/types/Button";
import { NextPage } from "next";
// import type { NextPage } from "next";
import Head from "next/head";
import { useEffect } from "react";
import { useTodo } from "../../hooks/useTodo";
import { todoType } from "../../interface/todoInterface";

const Home: NextPage = () => {
  const { mintNFT } = useTodo();

  useEffect(() => {
    // mintNFT();
  }, []);

  return (
    <div>
      <Head>
        <title>Todo list</title>
      </Head>

      <div>
        <button
          className="bg-zinc-900 text-white px-5 py-3 text-center"
          onClick={() => mintNFT()}
        >
          Mint NFt
        </button>
      </div>
    </div>
  );
};

export default Home;

import type { NextPage } from "next";
import Head from "next/head";
import { useEffect } from "react";
import { getProvider } from "../utils/provider";

const Home: NextPage = () => {
  useEffect(() => {
    const provider = getProvider();
    console.log(provider?.publicKey?.toString());
  }, []);
  return (
    <div>
      <Head>
        <title>Todo list</title>
      </Head>

      <main>
        <div className="m-auto flex-auto justify-center items-center">
          Solana todo list
        </div>
      </main>
    </div>
  );
};

export default Home;

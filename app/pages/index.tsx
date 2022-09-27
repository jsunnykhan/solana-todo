import { WalletMultiButton } from "@solana/wallet-adapter-react-ui";
import type { NextPage } from "next";
import Head from "next/head";

const Home: NextPage = () => {
  // need to create program (idl , program_key , provider);
  // need to create signer
  // need to fetch idl (like abi on ethereum)

  return (
    <div>
      <Head>
        <title>Todo list</title>
      </Head>

      <main>
        <div className="m-auto flex-auto justify-center items-center">
          <WalletMultiButton />
        </div>
      </main>
    </div>
  );
};

export default Home;

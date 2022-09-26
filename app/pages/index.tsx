import type { NextPage } from "next";
import Head from "next/head";


const Home: NextPage = () => {
  return (
    <div>
      <Head>
        <title>Todo list</title>
      </Head>

      <main>
        <div className="m-auto flex-auto justify-center items-center">Solana todo list</div>
      </main>
    </div>
  );
};

export default Home;

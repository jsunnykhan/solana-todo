import { WalletMultiButton } from "@solana/wallet-adapter-react-ui";
import { NextPage } from "next";
// import type { NextPage } from "next";
import Head from "next/head";
import { useTodo } from "../../hooks/useTodo";
import { todoType } from "../../interface/todoInterface";

const Home: NextPage = () => {
  const {
    pendingTodo,
    initUser,
    addTodo,
    markedTodo,
    removeTodo,
    updateTodo,
    sendToken,
    completeTodo,
  } = useTodo();

  const checkTodo = (idx: number) => {
    if (idx) {
      markedTodo(idx);
    }
  };

  const update = (idx: number, preContent: string) => {
    const data = prompt(preContent);
    if (data) {
      updateTodo(idx, data as string);
    }
  };

  return (
    <div>
      <Head>
        <title>Todo list</title>
      </Head>

      <main className="px-5 py-5">
        <div className="m-auto flex justify-between  items-center">
          <WalletMultiButton />

          <button
            onClick={() => addTodo()}
            className="bg-violet-600 text-white py-3 px-4 rounded "
          >
            Add todo
          </button>
          <button
            onClick={() => initUser()}
            className="bg-violet-600 text-white py-3 px-4 rounded "
          >
            Initialize User
          </button>
          <button
            onClick={() => sendToken()}
            className="bg-violet-600 text-white py-3 px-4 rounded "
          >
            send token
          </button>
        </div>

        {completeTodo ? (
          <div>
            <h1 className="text-lg font-bold pt-10">Todo List</h1>
            <div className="space-y-3 pb-10 pt-5">
              {pendingTodo?.map((data: todoType) => (
                <div
                  className="flex justify-between bg-slate-100 rounded px-5 py-2 items-center"
                  key={data.publicKey.toString()}
                >
                  <input
                    type="checkbox"
                    onClick={() => checkTodo(data.account.idx)}
                  />
                  <h1>{data?.account?.content}</h1>
                  <p>{data.publicKey.toString()}</p>
                  <button
                    onClick={() =>
                      update(data.account.idx, data.account.content as string)
                    }
                    className="bg-gray-400 text-base text-white px-3 py-2 rounded"
                  >
                    Update
                  </button>
                  <button
                    onClick={() => removeTodo(data.account.idx)}
                    className="bg-red-500 text-base text-white px-3 py-2 rounded"
                  >
                    Delete
                  </button>
                </div>
              ))}
            </div>
          </div>
        ) : null}

        {pendingTodo ? (
          <div>
            <h1 className="text-lg font-bold pt-10">Completed Todo</h1>
            <div className="space-y-3 pt-5 pb-10">
              {completeTodo?.map((data: todoType) => (
                <div
                  className="flex justify-between bg-slate-100 rounded px-5 py-2 items-center"
                  key={data.publicKey.toString()}
                >
                  <h1>{data?.account?.content}</h1>
                  <p>{data.publicKey.toString()}</p>

                  <button
                    onClick={() =>
                      update(data.account.idx, data.account.content as string)
                    }
                    className="bg-gray-400 text-base text-white px-3 py-2 rounded"
                  >
                    Update
                  </button>
                  <button
                    onClick={() => removeTodo(data.account.idx)}
                    className="bg-red-500 text-base text-white px-3 py-2 rounded"
                  >
                    Delete
                  </button>
                </div>
              ))}
            </div>
          </div>
        ) : null}
      </main>
    </div>
  );
};

export default Home;

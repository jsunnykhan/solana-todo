import "../styles/globals.css";
import "@solana/wallet-adapter-react-ui/styles.css"
import type { AppProps } from "next/app";
import { WalletConnectionProvider } from "../utils/WalletConnectProvider";

function MyApp({ Component, pageProps }: AppProps) {
  return (
    <WalletConnectionProvider>
      <Component {...pageProps} />
    </WalletConnectionProvider>
  );
}

export default MyApp;

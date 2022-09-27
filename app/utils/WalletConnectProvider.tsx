import { WalletAdapterNetwork } from "@solana/wallet-adapter-base";
import {
  ConnectionProvider,
  WalletProvider,
} from "@solana/wallet-adapter-react";

import {
  PhantomWalletAdapter,
  SlopeWalletAdapter,
  GlowWalletAdapter,
} from "@solana/wallet-adapter-wallets";

import { WalletModalProvider } from "@solana/wallet-adapter-react-ui";

import { clusterApiUrl } from "@solana/web3.js";
import { useMemo } from "react";

export const WalletConnectionProvider = ({ children }: any) => {
  const network = WalletAdapterNetwork.Devnet;

  const endpoint = useMemo(() => {
    if (network === WalletAdapterNetwork.Devnet) {
      return "https://ancient-smart-owl.solana-devnet.discover.quiknode.pro/403916d9cd234bb393f2ae31294766efed591bdf/";
    }
    return clusterApiUrl(network);
  }, [network]);

  const wallets = useMemo(() => [new PhantomWalletAdapter()], [network]);

  return (
    <ConnectionProvider endpoint={endpoint}>
      <WalletProvider wallets={wallets} autoConnect>
        <WalletModalProvider>{children}</WalletModalProvider>
      </WalletProvider>
    </ConnectionProvider>
  );
};

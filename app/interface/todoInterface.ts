import { PublicKey } from "@solana/web3.js";

export interface todoType {
  account: {
    authority: PublicKey;
    content: String;
    idx: number;
    marked: boolean;
  };
  publicKey: PublicKey;
}

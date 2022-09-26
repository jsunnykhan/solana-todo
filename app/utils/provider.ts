import { PhantomProvider } from "../interface/phantom-wallet";

export const getProvider = () : PhantomProvider | undefined => {
    if("solana" in window){
        const provider = window?.solana as any;

        if(provider.isPhantom) return provider as PhantomProvider;
    }
}
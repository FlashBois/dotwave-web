import type { WalletStore } from "$src/stores/walletStore";
import { PublicKey, type Connection } from "@solana/web3.js";

export const MINTER = new PublicKey('28Nuww9xsgAc2iLyxgX89JcqXb5SUJtkbuzb9M3QjpnG')

export async function useMintDevnetTokens(connection: Connection, wallet: WalletStore) {
    // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
    const solBalance = await connection.getBalance(wallet.publicKey!)

    if(solBalance < 0.01 * 1e9){
        // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
        await connection.requestAirdrop(wallet.publicKey!, 0.1 * 1e9)
    }
}
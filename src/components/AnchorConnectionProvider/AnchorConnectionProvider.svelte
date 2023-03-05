<script lang="ts">
	import { Connection, PublicKey } from '@solana/web3.js';
	import type { Commitment, ConnectionConfig } from '@solana/web3.js';
	import { AnchorProvider, Program } from '@project-serum/anchor';
	import { walletStore, type WalletStore } from '$src/stores/walletStore';
	import { anchorStore } from '$src/stores/anchorStore';
	import { IDL } from '$src/utils/Idl/protocol';

	export let network: string,
		config: Commitment | ConnectionConfig | undefined = 'processed';

	export const PROGRAM_ID = new PublicKey('xRkECZZpCjQ9PfpGvJ1R87GtVcMzJq31qZjGz9fYo95');
	const connection = new Connection(network, config);

	function defineProgramAndProvider(walletStore: WalletStore) {
		let { signTransaction, signAllTransactions, publicKey } = walletStore;

		const provider = new AnchorProvider(
			connection,
			{
				publicKey: publicKey!,
				signAllTransactions: signAllTransactions!,
				signTransaction: signTransaction!
			},
			{
				preflightCommitment: 'processed'
			}
		);

		const program = new Program(IDL, PROGRAM_ID, provider);

		anchorStore.set({
			connection,
			program,
			network
		});
	}

	$: $walletStore && $walletStore.publicKey && defineProgramAndProvider($walletStore);
</script>

<slot />

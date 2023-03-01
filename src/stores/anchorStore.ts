import { writable } from 'svelte/store';
import type { Program } from '@project-serum/anchor';
import type { Connection } from '@solana/web3.js';
import type { Protocol } from '$src/utils/Idl/protocol';

export type IAnchorStore = {
  connection: Connection;
  program: Program<Protocol>;
  network: string;
};

export const anchorStore = writable<IAnchorStore>(undefined);

import { sveltekit } from '@sveltejs/kit/vite';
import { defineConfig } from 'vitest/config';
import path from 'path';
import { fileURLToPath } from 'url';
import wasm from 'vite-plugin-wasm';

export default defineConfig({
	plugins: [sveltekit(), wasm()],
	resolve: {
		alias: {
			$src: path.resolve(path.dirname(fileURLToPath(import.meta.url)), 'src'),
			$stores: path.resolve(path.dirname(fileURLToPath(import.meta.url)), 'src', 'stores'),
			$components: path.resolve(path.dirname(fileURLToPath(import.meta.url)), 'src', 'components')
		}
	},
	define: {
		'process.env.ANCHOR_BROWSER': true
	},
	test: {
		include: ['src/**/*.{test,spec}.{js,ts}']
	},
	worker: {
		format: 'es',
		plugins: [wasm()]
	},
	optimizeDeps: {
		exclude: ['@syntect/wasm']
	}
});

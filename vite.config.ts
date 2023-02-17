import { sveltekit } from '@sveltejs/kit/vite';
import { defineConfig } from 'vitest/config';
import path from 'path';
import { fileURLToPath } from 'url';

export default defineConfig({
	plugins: [sveltekit()],
	resolve: {
		alias: {
			$src: path.resolve(path.dirname(fileURLToPath(import.meta.url)), 'src'),
			$stores: path.resolve(path.dirname(fileURLToPath(import.meta.url)), 'src', 'stores'),
			$components: path.resolve(path.dirname(fileURLToPath(import.meta.url)), 'src', 'components')
		}
	},
	test: {
		include: ['src/**/*.{test,spec}.{js,ts}']
	}
});

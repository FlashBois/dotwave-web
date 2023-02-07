import { sveltekit } from '@sveltejs/kit/vite';
import { defineConfig } from 'vitest/config';
import path from 'path';
import { fileURLToPath } from 'url';

export default defineConfig({
	plugins: [sveltekit()],
	resolve: {
		alias: {
			'$styles': path.resolve(path.dirname(fileURLToPath(import.meta.url)), 'styles'),
		}
	},
	test: {
		include: ['src/**/*.{test,spec}.{js,ts}']
	}
});

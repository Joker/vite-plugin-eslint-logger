const { normalizePath } = require('vite')
const { createFilter } = require('@rollup/pluginutils')

module.exports = function eslint(options = {}) {
	const { includeFiles, excludeFiles } = options
	const target = createFilter(includeFiles || ['**/*.js', '**/*.mjs', '**/*.cjs', '**/*.jsx', '**/*.ts', '**/*.tsx'], excludeFiles || /node_modules/)

	return {
		name: 'vite:eslint-logger',
		apply: 'serve',
		async transform(code, id) {
			const path = normalizePath(id)
			if (target(path)) console.log('transform ---', path)
		},
		async handleHotUpdate({ file }) {
			const path = normalizePath(file)
			if (target(path)) console.log('handleHotUpdate ---', path)
		},
	}
}

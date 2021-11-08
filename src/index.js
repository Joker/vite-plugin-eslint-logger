const { normalizePath } = require('vite')
const { createFilter } = require('@rollup/pluginutils')
const { Worker } = require('worker_threads')
const { resolve } = require('path')
const { logger } = require('./logger.js')

module.exports = function eslint(options = {}) {
	const { includeFiles, excludeFiles } = options
	const target = createFilter(includeFiles || ['**/*.js', '**/*.mjs', '**/*.cjs', '**/*.jsx', '**/*.ts', '**/*.tsx'], excludeFiles || /node_modules/)

	let worker = null

	return {
		name: 'vite:eslint-logger',
		apply: 'serve',

		async transform(code, id) {
			const path = normalizePath(id)
			if (target(path)) {
				// console.log('transform ---', path)
				worker.postMessage(path)
			}
		},
		async handleHotUpdate({ file }) {
			const path = normalizePath(file)
			if (target(path)) {
				// console.log('handleHotUpdate ---', path)
				worker.postMessage(path)
			}
		},
		configureServer(server) {
			const eslintOptions = { cache: true }

			worker = new Worker(resolve(__dirname, './worker.js'), { workerData: eslintOptions })
			worker.on('message', payload => {
				// console.log('worker on message ---', payload)
				payload.forEach(err => {
					logger(err)
					server.ws.send(err)
				})
			})

			server.middlewares.use((req, res, next) => {
				next()
			})
		},
	}
}

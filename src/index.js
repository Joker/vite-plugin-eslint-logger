const { normalizePath } = require('vite')
const { createFilter } = require('@rollup/pluginutils')
const { Worker } = require('worker_threads')
const { resolve } = require('path')
const { logger } = require('./logger.js')

module.exports = function eslint(options = {}) {
	const { includeFiles, excludeFiles } = options
	const target = createFilter(includeFiles || ['**/*.js', '**/*.mjs', '**/*.cjs', '**/*.jsx', '**/*.ts', '**/*.tsx'], excludeFiles || /node_modules/)
	const notrun = makeGuard()

	let worker = null

	return {
		name: 'vite:eslint-logger',
		apply: 'serve',

		async transform(code, id) {
			const path = normalizePath(id)
			if (target(path) && notrun(path)) {
				// console.log('transform ---', path)
				worker.postMessage(path)
			}
		},
		async handleHotUpdate({ file }) {
			const path = normalizePath(file)
			if (target(path) && notrun(path)) {
				// console.log('handleHotUpdate ---', path)
				worker.postMessage(path)
			}
		},
		configureServer(server) {
			const eslintOptions = { cache: true }

			worker = new Worker(resolve(__dirname, './worker.js'), { workerData: eslintOptions })
			worker.on('message', payload => {
				payload.forEach(err => {
					logger(err)
				})
				console.log("\n\n")
				if (payload.length > 0) {
					payload[0].err.frame = payload[0].err.frame.replace(/\u001b\[.*?m/g, '')
					server.ws.send(payload[0])
				}
			})

			server.middlewares.use((req, res, next) => {
				next()
			})
		},
	}
}

function makeGuard() {
	let names = []
	let tm = null
	const reset = () => (names = [])
	return path => {
		clearTimeout(tm)
		tm = setTimeout(reset, 400)

		if (names.includes(path)) return false
		names.push(path)
		return true
	}
}

const { parentPort, workerData } = require('worker_threads')
const { ESLint } = require('eslint')
const { mapper } = require('./logger.js')

const eslint = new ESLint(workerData)

parentPort.on('message', async path => {
	console.log('parentPort on message ---', path)
	if (await eslint.isPathIgnored(path)) return

	const [report] = await eslint.lintFiles(path)
	if (report.messages.length === 0) return

	parentPort.postMessage(mapper(report))
})

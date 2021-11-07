const { parentPort } = require('worker_threads')

parentPort.on('message', path => {
	console.log('parentPort on message ---', path)

	parentPort.postMessage(path)
})

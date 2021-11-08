const pc = require('picocolors')

const logger = ({
	err: {
		message,
		frame,
		plugin,
		loc: { file, line, column },
		ruleId,
	},
}) => {
	const info = pc.cyan(pc.bold('[eslint]'))
	const warn = pc.yellow(pc.bold('[eslint]'))

	console.log(`${pc.dim(new Date().toLocaleTimeString())} ${pc.red(pc.bold('[eslint]'))} ${pc.red(message)} ${pc.dim(ruleId)}
  Plugin: ${pc.magenta(plugin)}\n  File: ${pc.cyan(`${file}:${line}:${column}`)}\n${pc.yellow(pad(frame))}`)
}

const mapper = ({ filePath, messages, source }) => {
	//errorCount, fatalErrorCount, warningCount, fixableErrorCount, fixableWarningCount
	const out = messages.map(({ ruleId, severity, message, line, column, nodeType, messageId, endLine, endColumn }) => ({
		type: 'error',
		err: {
			message,
			stack: '',
			// id: '?string',
			frame: makeFrame(source, { line, column }, endColumn),
			plugin: 'vite:eslint-logger',
			// pluginCode: '?string',
			loc: {
				file: filePath,
				line,
				column,
				// endLine,
				// endColumn,
			},
			ruleId,
			// nodeType,
			// messageId,
			// severity,
		},
	}))
	// console.log(
	// 	out.forEach(el => {
	// 		console.log(el.err.loc)
	// 	})
	// )
	// console.log({ source })
	return out
}

module.exports = { mapper, logger }

function makeFrame(source, start = { line: 0, column: 0 }, endColumn = 0) {
	const range = 2
	const lines = source.split(/\r?\n/)
	const errln = lines[start.line - 1].replaceAll(/[^\s\t]/g, ' ').substring(0, start.column - 1)

	const hi = start.line > range ? start.line - range - 1 : 0
	const lo = start.line + range > lines.length ? lines.length : start.line + range
	const nc = endColumn - start.column > 0 ? endColumn - start.column : 1

	const out = lines.slice(hi, lo).map((st, i) => `${i + hi + 1} | ${st}`)
	out.splice(start.line - hi, 0, `   | ${errln}${pc.red('^'.repeat(nc))}`)

	return out.join('\n')
}

function pad(source, n = 2) {
	const lines = source.split(/\r?\n/)
	return lines.map(l => ` `.repeat(n) + l).join(`\n`)
}

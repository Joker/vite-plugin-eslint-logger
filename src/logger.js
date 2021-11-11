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
	const info = pc.bold(pc.cyan('[eslint]'))
	const warn = pc.bold(pc.yellow('[eslint]'))
	const err = pc.bold(pc.red('[eslint]'))
	console.log(`${pc.dim(new Date().toLocaleTimeString())} ${err} ${pc.red(message)}
  Plugin: ${pc.magenta(plugin+':')}${pc.dim(ruleId)}\n  File: ${pc.cyan(`${file}:${line}:${column}`)}\n${pc.yellow(pad(frame))}\n`)
}

const mapper = ({ filePath, messages, source }) => {
	// errorCount, fatalErrorCount, warningCount, fixableErrorCount, fixableWarningCount
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
	return out
}

module.exports = { mapper, logger }

function makeFrame(source, start = { line: 0, column: 0 }, endColumn = 0) {
	const range = 2
	const lines = source.split(/\r?\n/)
	const lsnum = String(lines.length).length
	const errln = lines[start.line - 1].replaceAll(/[^\s\t]/g, ' ').substring(0, start.column - 1)

	const hi = start.line > range ? start.line - range - 1 : 0
	const lo = start.line + range > lines.length ? lines.length : start.line + range
	const nc = endColumn - start.column > 0 ? endColumn - start.column : 1

	const out = lines.slice(hi, lo).map((st, i) => `${num(lsnum, i + hi + 1)}${st}`)
	out.splice(start.line - hi, 0, `${num(lsnum)}${errln}${pc.red('^'.repeat(nc))}`)

	return out.join('\n')
}

function num(...i) {
	if (i.length > 1) {
		const ln = String(i[1])
		return `${pc.gray(`${ln}${' '.repeat(i[0] - ln.length)} |`)} `
	}
	return `${' '.repeat(i[0])} ${pc.gray('|')} `
}

function pad(source, n = 2) {
	const lines = source.split(/\r?\n/)
	return lines.map(l => ` `.repeat(n) + l).join(`\n`)
}

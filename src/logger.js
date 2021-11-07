const logger = () => {}

const mapper = ({ filePath, messages, source }) => {
	//errorCount, fatalErrorCount, warningCount, fixableErrorCount, fixableWarningCount
	const out = messages.map(({ ruleId, severity, message, line, column, nodeType, messageId, endLine, endColumn }) => ({
		type: 'error',
		err: {
			message,
			stack: '',
			// id: '?string',
			frame: generateCodeFrame(source, { line, column }, endColumn),
			plugin: 'vite:eslint-logger',
			// pluginCode: '?string',
			loc: {
				file: filePath,
				line,
				column,
				// endLine,
				// endColumn,
			},
			// ruleId,
			// nodeType,
			// messageId,
			// severity,
		},
	}))
	return out
}

module.exports = { mapper, logger }

const range = 2
const splitRE = /\r?\n/

// no global export from vite =(
function generateCodeFrame(source, start, end) {
	start = posToNumber(source, start)
	end = end || start
	const lines = source.split(splitRE)
	let count = 0
	const res = []
	for (let i = 0; i < lines.length; i++) {
		count += lines[i].length + 1
		if (count >= start) {
			for (let j = i - range; j <= i + range || end > count; j++) {
				if (j < 0 || j >= lines.length) continue
				const line = j + 1
				res.push(`${line}${' '.repeat(Math.max(3 - String(line).length, 0))}|  ${lines[j]}`)
				const lineLength = lines[j].length
				if (j === i) {
					// push underline
					const pad = start - (count - lineLength) + 1
					const length = Math.max(1, end > count ? lineLength - pad : end - start)
					res.push(`   |  ` + ' '.repeat(pad) + '^'.repeat(length))
				} else if (j > i) {
					if (end > count) {
						const length = Math.max(Math.min(end - count, lineLength), 1)
						res.push(`   |  ` + '^'.repeat(length))
					}
					count += lineLength + 1
				}
			}
			break
		}
	}
	return res.join('\n')
}

function posToNumber(source, pos) {
	if (typeof pos === 'number') return pos
	const lines = source.split(splitRE)
	const { line, column } = pos
	let start = 0
	for (let i = 0; i < line - 1; i++) {
		start += lines[i].length + 1
	}
	return start + column
}
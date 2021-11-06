import { normalizePath } from 'vite'

const eslint = () => {
	return {
		name: 'vite:eslint-logger',
		apply: 'serve',
		async transform(code, id) {
			const path = normalizePath(id)
			console.log(path)
		},
		async handleHotUpdate({ file }) {
			const path = normalizePath(file)
			console.log(path)
		},
	}
}

export default eslint

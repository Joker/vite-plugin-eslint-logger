# vite-plugin-eslint-logger

A vite plugin to show ESlint logs in terminal and browser (HMR overlay)

## Getting Started

Install plugin:

```sh
$ npm install --save-dev vite-plugin-eslint-logger
```

Edit vite.config.js file:

```js
import { defineConfig } from 'vite'
import eslint from 'vite-plugin-eslint-logger'

export default defineConfig({
	plugins: [eslint()],
})
```

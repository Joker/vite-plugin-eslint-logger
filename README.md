# vite-plugin-eslint-logger

A vite plugin to show ESlint logs in terminal and browser (HMR overlay)

## Getting Started

Install plugin:

```sh
$ npm install --save-dev vite-plugin-eslint-logger
```

Edit `vite.config.js` file:

```diff
import { defineConfig } from 'vite'
+ import eslint from 'vite-plugin-eslint-logger'

export default defineConfig({
-	plugins: [],
+	plugins: [eslint()],
})
```
<img src="https://user-images.githubusercontent.com/11617/141296387-273ea45d-ddd2-4de5-894e-0cc88bd9ea73.png">
<img src="https://user-images.githubusercontent.com/11617/141296406-ac24fcb2-4fc6-4eee-8dd4-3c3e542be8ed.png">

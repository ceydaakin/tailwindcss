import fs from 'node:fs/promises'
import os from 'node:os'
import path from 'node:path'
import { expect, test } from 'vitest'
import { compile } from './compile'

test('an `@import` that failed to resolve resolves once the file exists', async () => {
  let base = await fs.mkdtemp(path.join(os.tmpdir(), 'tailwindcss-compile-'))

  try {
    let css = '@import "./accent.css";\n'
    let options = { base, onDependency: () => {} }

    await expect(compile(css, options)).rejects.toThrow(/accent\.css/)

    await fs.writeFile(path.join(base, 'accent.css'), '.accent { color: red; }\n')

    let compiler = await compile(css, options)
    expect(compiler.build([])).toContain('.accent')
  } finally {
    await fs.rm(base, { recursive: true, force: true })
  }
})

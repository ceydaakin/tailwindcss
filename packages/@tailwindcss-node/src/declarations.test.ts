import path from 'node:path'
import ts from 'typescript'
import { expect, test } from 'vitest'

// The published `.d.ts` files can only reference types that `tailwindcss`
// exports. An inferred type that points into `tailwindcss/src` ends up as an
// import of a file the package does not ship.
test('declarations only reference public types', () => {
  let root = path.resolve(__dirname, '..')
  let config = ts.getParsedCommandLineOfConfigFile(
    path.join(root, 'tsconfig.json'),
    {},
    {
      ...ts.sys,
      onUnRecoverableConfigFileDiagnostic() {},
    },
  )!

  let program = ts.createProgram([path.join(root, 'src/index.ts')], {
    ...config.options,
    declaration: true,
    emitDeclarationOnly: true,
    noEmit: false,
    outDir: path.join(root, 'dist-types'),
  })

  let result = program.emit(undefined, () => {})

  expect(
    result.diagnostics.map((diagnostic) =>
      ts.flattenDiagnosticMessageText(diagnostic.messageText, '\n'),
    ),
  ).toEqual([])
})

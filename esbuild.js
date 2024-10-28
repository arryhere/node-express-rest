import { build } from 'esbuild';

try {
  await build({
    entryPoints: ['./src/main.ts'],
    bundle: true,
    platform: 'node',
    target: ['node22'],
    format: 'cjs',
    outfile: 'dist/index.cjs',
    sourcemap: true,
    minify: true,
    treeShaking: true,
    plugins: [],
  });
} catch (error) {
  console.log('esbuild error:', error);
}

// currently esbuild has issues with esm output [format: 'esm'], so for now we are targetting cjs build
// we hope to update this to esm build output in th future, if things are fixed from node ans esbuild side

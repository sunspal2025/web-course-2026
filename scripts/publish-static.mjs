import {cp, mkdir, readFile, rm, writeFile} from 'node:fs/promises';
import path from 'node:path';
import {fileURLToPath} from 'node:url';
const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
for (const task of [10, 11, 15]) {
  const directory = path.join(root, `task${task}`);
  const source = path.join(directory, task === 15 ? 'dist/todo-angular/browser' : 'dist');
  const destination = path.join(directory, 'published');
  await rm(destination, {recursive: true, force: true});
  await mkdir(destination, {recursive: true});
  await cp(source, destination, {recursive: true});
  if (task !== 15) {
    await writeFile(path.join(destination, 'index.html'), await readFile(path.join(destination, 'source.html')));
    await rm(path.join(destination, 'source.html'));
  }
  await writeFile(path.join(directory, 'index.html'), `<!DOCTYPE html>
<html lang="ru"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width, initial-scale=1"><meta http-equiv="refresh" content="0; url=published/"><title>Лабораторная ${task}</title></head><body><p><a href="published/">Открыть лабораторную ${task}</a></p></body></html>\n`);
  console.log(`task${task}: production bundle copied to published/`);
}

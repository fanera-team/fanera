#!/usr/bin/env node
// Проверка согласованности docs/system-design. Без зависимостей, Node 20+.
// Запуск из корня репозитория: node docs/system-design/scripts/check.mjs
//
// Что ловит:
//   1. backlog: зависимость на несуществующую задачу, на саму себя, цикл;
//   2. ссылки AC-x.y / US-x на несуществующие критерии в acceptance.md;
//   3. ссылки Р-NN на несуществующие решения в decisions.md;
//   4. относительные ссылки и картинки на несуществующий файл или якорь;
//   5. SVG-схема устарела: исходник, вшитый в SVG, не совпадает с .puml
//      (render.sh не запустили). Изменения в общем _style.iuml так не видны.

import { readFileSync, readdirSync, existsSync, statSync } from 'node:fs';
import { join, dirname, relative, resolve, extname } from 'node:path';
import { fileURLToPath } from 'node:url';
import { inflateRawSync } from 'node:zlib';

const ROOT = resolve(dirname(fileURLToPath(import.meta.url)), '..');
const errors = [];
const fail = (file, msg) => errors.push(`${relative(process.cwd(), file)}: ${msg}`);

function walk(dir) {
  return readdirSync(dir).flatMap((name) => {
    const p = join(dir, name);
    return statSync(p).isDirectory() ? walk(p) : [p];
  });
}
const files = walk(ROOT);
const read = (p) => readFileSync(p, 'utf8');
const textFiles = files.filter((p) => ['.md', '.yml', '.yaml', '.puml', '.dbml'].includes(extname(p)));
const lineOf = (text, index) => text.slice(0, index).split('\n').length;

// ---------- 1. backlog ----------
{
  const file = join(ROOT, 'backlog.md');
  const tasks = new Map(); // id -> { deps, line }
  read(file).split('\n').forEach((row, i) => {
    const cells = row.split('|').map((c) => c.trim());
    const id = cells[1]?.match(/^(T\d+-\d+)/)?.[1];
    if (!id || cells.length < 7) return;
    // повтор id молча заменил бы первую строку и спрятал её ошибки
    if (tasks.has(id)) return fail(file, `строки ${tasks.get(id).line} и ${i + 1}: задача ${id} описана дважды`);
    tasks.set(id, { depsCell: cells[5], line: i + 1 });
  });
  // { id, inRange }: inRange — номер получен разворачиванием диапазона «T2-01…T2-18»
  const expand = (cell, line) => {
    const out = [];
    for (const m of cell.matchAll(/(T\d+)-(\d+)(?:\s*(?:…|\.\.\.)\s*(T\d+)-(\d+))?/g)) {
      const [, prefix, from, prefix2, to] = m;
      if (to !== undefined && (prefix2 !== prefix || Number(to) < Number(from))) {
        fail(file, `строка ${line}: диапазон ${m[0]} — разные этапы или обратный порядок`);
        continue;
      }
      const end = to ?? from;
      for (let n = Number(from); n <= Number(end); n++) {
        const id = `${prefix}-${String(n).padStart(from.length, '0')}`;
        // концы диапазона проверяем как обычные ссылки, внутренние номера — нет
        out.push({ id, inRange: to !== undefined && n !== Number(from) && n !== Number(end) });
      }
    }
    return out;
  };
  for (const [id, t] of tasks) {
    const parsed = expand(t.depsCell, t.line);
    t.deps = parsed.map((d) => d.id);
    for (const d of parsed) {
      if (d.id === id) fail(file, `строка ${t.line}: ${id} зависит от самой себя`);
      // внутри диапазона «T2-01…T2-18» могут быть пропуски номеров — их не считаем ошибкой
      else if (!tasks.has(d.id) && !d.inRange) fail(file, `строка ${t.line}: ${id} зависит от несуществующей ${d.id}`);
    }
  }
  const state = new Map();
  const visit = (id, path) => {
    if (state.get(id) === 'done') return;
    if (state.get(id) === 'active') {
      fail(file, `цикл зависимостей: ${[...path.slice(path.indexOf(id)), id].join(' → ')}`);
      return;
    }
    state.set(id, 'active');
    for (const d of tasks.get(id)?.deps ?? []) if (d !== id && tasks.has(d)) visit(d, [...path, id]);
    state.set(id, 'done');
  };
  for (const id of tasks.keys()) visit(id, []);
}

// ---------- 2. AC / US ----------
{
  const acc = read(join(ROOT, 'acceptance.md'));
  const acs = new Set([...acc.matchAll(/^\|\s*(AC-\d+\.\d+)\s*\|/gm)].map((m) => m[1]));
  const stories = new Set([...acc.matchAll(/^##\s+US-(\d+)\b/gm)].map((m) => m[1]));
  for (const file of textFiles) {
    const text = read(file);
    for (const m of text.matchAll(/\bAC-(\d+)(?:\.(\d+))?(?:\s*[–-]\s*(?:AC-)?(\d+)\.(\d+))?/g)) {
      const [, story, n, story2, n2] = m;
      const refs = n ? [`AC-${story}.${n}`] : [];
      if (n2) refs.push(`AC-${story2}.${n2}`);
      if (!n && !stories.has(story)) fail(file, `строка ${lineOf(text, m.index)}: нет истории US-${story} для ${m[0]}`);
      for (const r of refs) if (!acs.has(r)) fail(file, `строка ${lineOf(text, m.index)}: нет критерия ${r} в acceptance.md`);
    }
    for (const m of text.matchAll(/\bUS-(\d+)\b/g)) {
      if (!stories.has(m[1])) fail(file, `строка ${lineOf(text, m.index)}: нет истории US-${m[1]} в acceptance.md`);
    }
  }
}

// ---------- 3. решения Р-NN ----------
{
  const dec = read(join(ROOT, 'decisions.md'));
  const ids = new Set([...dec.matchAll(/^\|\s*(?:~~)?Р-(\d+)(?:~~)?\s*\|/gm)].map((m) => m[1]));
  for (const file of textFiles) {
    const text = read(file);
    // «Р-32…Р-42» — диапазон: проверяем концы
    for (const m of text.matchAll(/(?<![\p{L}\d])Р-(\d+)/gu)) {
      if (!ids.has(m[1])) fail(file, `строка ${lineOf(text, m.index)}: нет решения Р-${m[1]} в decisions.md`);
    }
  }
}

// ---------- 4. ссылки и якоря ----------
// Якорь по правилам GitHub: нижний регистр, без пунктуации, пробелы → «-», повторы → «-1», «-2»…
function anchorsOf(md) {
  const seen = new Map();
  const out = new Set();
  let inCode = false;
  for (const line of md.split('\n')) {
    if (/^\s*```/.test(line)) inCode = !inCode;
    const h = !inCode && line.match(/^#{1,6}\s+(.*?)\s*#*\s*$/);
    if (!h) continue;
    const base = h[1]
      .replace(/<[^>]+>/g, '')
      .replace(/!?\[([^\]]*)\]\([^)]*\)/g, '$1')
      .toLowerCase()
      .replace(/[^\p{L}\p{N}\p{M} _-]/gu, '')
      .replace(/ /g, '-');
    const n = seen.get(base) ?? 0;
    seen.set(base, n + 1);
    out.add(n ? `${base}-${n}` : base);
  }
  return out;
}
const anchorCache = new Map();
for (const file of files.filter((p) => extname(p) === '.md')) {
  const text = read(file);
  const noCode = text.replace(/```[\s\S]*?```/g, (s) => s.replace(/[^\n]/g, ' '));
  for (const m of noCode.matchAll(/!?\[[^\]]*\]\(([^)\s]+)\)/g)) {
    const target = m[1];
    if (/^(https?:|mailto:)/.test(target)) continue;
    const [path, anchor] = target.split('#');
    const where = `строка ${lineOf(text, m.index)}`;
    const abs = path ? resolve(dirname(file), decodeURI(path)) : file;
    if (!existsSync(abs)) {
      fail(file, `${where}: нет файла ${path}`);
      continue;
    }
    if (anchor && extname(abs) === '.md') {
      if (!anchorCache.has(abs)) anchorCache.set(abs, anchorsOf(read(abs)));
      if (!anchorCache.get(abs).has(decodeURIComponent(anchor))) fail(file, `${where}: нет заголовка #${anchor} в ${relative(ROOT, abs)}`);
    }
  }
}

// ---------- 5. SVG не устарели ----------
const PU = '0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz-_';
function embeddedSource(svg) {
  const s = svg.match(/<\?plantuml-src (\S+)\?>/)?.[1];
  if (!s) return null;
  const bytes = [];
  for (let i = 0; i < s.length; i += 4) {
    const [a, b, c, d] = [...s.slice(i, i + 4).padEnd(4, '0')].map((ch) => PU.indexOf(ch));
    bytes.push((a << 2) | (b >> 4), ((b & 15) << 4) | (c >> 2), ((c & 3) << 6) | d);
  }
  return inflateRawSync(Buffer.from(bytes), { finishFlush: 2 }).toString('utf8');
}
const body = (src) =>
  src
    .replace(/\r/g, '')
    .replace(/–/g, '-') // PlantUML при встраивании заменяет en-dash на дефис
    .split('\n')
    .filter((l) => !/^\s*@(start|end)uml\b/.test(l))
    .join('\n')
    .trim();
for (const puml of files.filter((p) => extname(p) === '.puml')) {
  const svgPath = puml.replace(/\.puml$/, '.svg');
  if (!existsSync(svgPath)) {
    fail(puml, 'нет SVG рядом: запусти bash docs/system-design/scripts/render.sh');
    continue;
  }
  const src = embeddedSource(read(svgPath));
  if (src === null) fail(svgPath, 'в SVG нет вшитого исходника (plantuml-src) — перерисуй render.sh');
  else if (body(src) !== body(read(puml))) fail(svgPath, 'устарел относительно .puml: запусти bash docs/system-design/scripts/render.sh');
}

// ---------- итог ----------
if (errors.length) {
  console.error(`docs/system-design: ${errors.length} проблем(ы)\n`);
  for (const e of errors) console.error(`  ✗ ${e}`);
  process.exit(1);
}
console.log('docs/system-design: согласовано ✓');

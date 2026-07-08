import fs from 'node:fs';
import path from 'node:path';
import ora from 'ora';

interface FileEntry {
  path: string;
  language: string | null;
  size: number;
  lines: number;
}

// List of binary format languages that shouldn't be read as text
const BINARY_LANGUAGES = new Set([
  'PNG', 'JPEG', 'GIF', 'WebP', 'Icon', 'Video', 'PDF', 'WebFont',
]);

// Map file extensions to language names
const LANGUAGE_MAP: Record<string, string> = {
  js: 'JavaScript',
  jsx: 'JavaScript (JSX)',
  ts: 'TypeScript',
  tsx: 'TypeScript (TSX)',
  mjs: 'JavaScript',
  cjs: 'JavaScript',
  mts: 'TypeScript',
  cts: 'TypeScript',
  py: 'Python',
  rb: 'Ruby',
  go: 'Go',
  rs: 'Rust',
  java: 'Java',
  kt: 'Kotlin',
  swift: 'Swift',
  php: 'PHP',
  cs: 'C#',
  cpp: 'C++',
  c: 'C',
  h: 'C/C++ Header',
  hpp: 'C++ Header',
  css: 'CSS',
  scss: 'SCSS',
  sass: 'SASS',
  less: 'Less',
  html: 'HTML',
  htm: 'HTML',
  json: 'JSON',
  yaml: 'YAML',
  yml: 'YAML',
  xml: 'XML',
  md: 'Markdown',
  mdx: 'MDX',
  sql: 'SQL',
  sh: 'Shell',
  bash: 'Bash',
  zsh: 'Zsh',
  fish: 'Fish',
  vue: 'Vue',
  svelte: 'Svelte',
  astro: 'Astro',
  toml: 'TOML',
  env: 'Dotenv',
  gitignore: 'Gitignore',
  dockerfile: 'Dockerfile',
  tf: 'Terraform',
  prisma: 'Prisma',
  graphql: 'GraphQL',
  gql: 'GraphQL',
  svg: 'SVG',
  png: 'PNG',
  jpg: 'JPEG',
  jpeg: 'JPEG',
  gif: 'GIF',
  webp: 'WebP',
  ico: 'Icon',
  woff: 'WebFont',
  woff2: 'WebFont',
  eot: 'WebFont',
  ttf: 'WebFont',
  otf: 'WebFont',
  mp4: 'Video',
  webm: 'Video',
  pdf: 'PDF',
  txt: 'Text',
};

function detectLanguage(filePath: string): string | null {
  const basename = path.basename(filePath).toLowerCase();
  const ext = path.extname(filePath).toLowerCase().slice(1);

  // Special named files
  if (basename === 'dockerfile') return 'Dockerfile';
  if (basename === 'makefile') return 'Makefile';
  if (basename.startsWith('.env')) return 'Dotenv';
  if (basename === '.gitignore') return 'Gitignore';

  return LANGUAGE_MAP[ext] || null;
}

export async function scanCommand(dirPath: string = '.', options?: { verbose?: boolean }) {
  const spinner = ora('Scanning directory...').start();
  const startTime = Date.now();

  try {
    const absolutePath = path.resolve(dirPath);

    // Check directory exists
    if (!fs.existsSync(absolutePath)) {
      spinner.fail(`Directory not found: ${dirPath}`);
      process.exit(1);
    }

    const stat = fs.statSync(absolutePath);
    if (!stat.isDirectory()) {
      spinner.fail(`Not a directory: ${dirPath}`);
      process.exit(1);
    }

    // Load .gitignore rules
    const { default: ignore } = await import('ignore');
    const ig = ignore();
    const gitignorePath = path.join(absolutePath, '.gitignore');

    if (fs.existsSync(gitignorePath)) {
      const gitignoreContent = fs.readFileSync(gitignorePath, 'utf-8');
      ig.add(gitignoreContent);
    }

    // Always ignore common dirs
    ig.add([
      '.git',
      'node_modules',
      '.next',
      'dist',
      'build',
      '.cache',
      'coverage',
      '.turbo',
      '.vercel',
      '.env*',
    ]);

    const files: FileEntry[] = [];
    let totalDirs = 0;
    let ignoredCount = 0;

    function walk(currentPath: string, relativePath: string) {
      let entries: fs.Dirent[];
      try {
        entries = fs.readdirSync(currentPath, { withFileTypes: true });
      } catch {
        // Permission denied, skip
        return;
      }

      for (const entry of entries) {
        const fullPath = path.join(currentPath, entry.name);
        const relPath = relativePath ? `${relativePath}/${entry.name}` : entry.name;

        // Check gitignore
        if (ig.ignores(relPath)) {
          if (options?.verbose) {
            ignoredCount++;
          }
          continue;
        }

        if (entry.isDirectory()) {
          totalDirs++;
          walk(fullPath, relPath);
        } else if (entry.isFile()) {
          const fileStat = fs.statSync(fullPath);
          const language = detectLanguage(entry.name);

          // Count lines (only for text files)
          let lines = 0;
          if (language && !BINARY_LANGUAGES.has(language)) {
            try {
              const content = fs.readFileSync(fullPath, 'utf-8');
              lines = content.split('\n').length;
            } catch {
              // Binary file, skip line count
            }
          }

          files.push({
            path: relPath,
            language,
            size: fileStat.size,
            lines,
          });
        }
      }
    }

    walk(absolutePath, '');
    spinner.stop();

    const elapsed = ((Date.now() - startTime) / 1000).toFixed(2);

    // Output: summary
    console.log('');
    console.log(`  ┌─────────────────────────────────────────────┐`);
    console.log(`  │  Scan Results                                │`);
    console.log(`  │  Directory: ${path.basename(absolutePath).padEnd(28)}│`);
    console.log(`  │  Files:     ${String(files.length).padStart(4).padEnd(28)}│`);
    console.log(`  │  Dirs:      ${String(totalDirs).padStart(4).padEnd(28)}│`);
    console.log(`  │  Time:      ${elapsed.padStart(5)}s${' '.repeat(23)}│`);
    if (options?.verbose) {
      console.log(`  │  Ignored:   ${String(ignoredCount).padStart(4).padEnd(28)}│`);
    }
    console.log(`  └─────────────────────────────────────────────┘`);
    console.log('');

    // Output: file manifest as a formatted table
    if (files.length > 0) {
      // Group by language
      const byLang: Record<string, FileEntry[]> = {};
      for (const file of files) {
        const lang = file.language || 'Other';
        if (!byLang[lang]) byLang[lang] = [];
        byLang[lang].push(file);
      }

      // Print by language group
      const sortedLangs = Object.entries(byLang).sort((a, b) => b[1].length - a[1].length);

      for (const [lang, langFiles] of sortedLangs) {
        const totalLines = langFiles.reduce((sum, f) => sum + f.lines, 0);
        const totalSize = langFiles.reduce((sum, f) => sum + f.size, 0);
        console.log(`  ${lang} (${langFiles.length} files, ${totalLines} lines, ${formatSize(totalSize)})`);
        console.log(`  ${'─'.repeat(58)}`);

        for (const file of langFiles.slice(0, 20)) {
          const sizeStr = formatSize(file.size).padStart(8);
          const linesStr = file.lines > 0 ? String(file.lines).padStart(5) : '   — ';
          console.log(`    ${linesStr} lines  ${sizeStr}  ${file.path}`);
        }

        if (langFiles.length > 20) {
          console.log(`    ... and ${langFiles.length - 20} more files`);
        }
        console.log('');
      }

      // Print files with no detected language
      if (byLang['Other']) {
        const otherFiles = byLang['Other'];
        console.log(`  Other / Unknown (${otherFiles.length} files)`);
        console.log(`  ${'─'.repeat(58)}`);
        for (const file of otherFiles.slice(0, 10)) {
          const sizeStr = formatSize(file.size).padStart(8);
          console.log(`    ${'     '}  ${sizeStr}  ${file.path}`);
        }
        if (otherFiles.length > 10) {
          console.log(`    ... and ${otherFiles.length - 10} more files`);
        }
        console.log('');
      }

      // Summary line
      const totalFiles = files.length;
      const totalLines = files.reduce((sum, f) => sum + f.lines, 0);
      const totalSize = files.reduce((sum, f) => sum + f.size, 0);
      console.log(`  Total: ${totalFiles} files, ${totalLines.toLocaleString()} lines, ${formatSize(totalSize)}`);
      console.log('');
    } else {
      console.log('  No files found.');
      console.log('');
    }
  } catch (err) {
    spinner.fail('Scan failed');
    const message = err instanceof Error ? err.message : 'Unknown error';
    console.error(`  ✗ ${message}`);
    console.log('');
    process.exit(1);
  }
}

function formatSize(bytes: number): string {
  if (bytes === 0) return '0 B';
  const units = ['B', 'KB', 'MB', 'GB'];
  const i = Math.floor(Math.log(bytes) / Math.log(1024));
  const size = bytes / Math.pow(1024, i);
  return `${size.toFixed(i === 0 ? 0 : 1)} ${units[i]}`;
}

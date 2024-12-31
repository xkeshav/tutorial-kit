import fs from 'fs';
import path from 'path';
import readline from 'readline';
import { fileURLToPath } from 'url';
import { dirname } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const kebabToCapitalized = (kebabStr) => {
  return kebabStr
    .split('-')
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(' ');
};

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout,
});

rl.question('Enter the name of the lesson: ', (lessonName) => {
  rl.question('Enter the type (part/chapter/lesson): ', (type) => {
    const basePath = path.join(__dirname, '..', 'src', 'content', 'tutorial');
    let targetPath;

    switch (type) {
      case 'part':
        targetPath = path.join(basePath, lessonName);
        if (!fs.existsSync(targetPath)) {
          fs.mkdirSync(targetPath, { recursive: true });
          fs.writeFileSync(path.join(targetPath, 'meta.md'), `---\ntype: part\ntitle: ${kebabToCapitalized(lessonName)}\n---`);

          const chapterPath = path.join(targetPath, 'Introduction');
          fs.mkdirSync(chapterPath, { recursive: true });
          fs.writeFileSync(path.join(chapterPath, 'meta.md'), `---\ntype: chapter\ntitle: Introduction\n---`);

          const lessonPath = path.join(chapterPath, '1-welcome');
          fs.mkdirSync(lessonPath, { recursive: true });
          fs.writeFileSync(path.join(lessonPath, 'content.md'), `---\ntype: lesson\ntitle: Welcome\n---\n# Welcome\n\nContent goes here.`);

          const filesPath = path.join(lessonPath, '_files');
          const solutionPath = path.join(lessonPath, '__solution');
          fs.mkdirSync(filesPath, { recursive: true });
          fs.mkdirSync(solutionPath, { recursive: true });
          fs.writeFileSync(path.join(filesPath, 'index.html'), '<!-- _files index.html content -->');
          fs.writeFileSync(path.join(solutionPath, 'index.html'), '<!-- __solution index.html content -->');

          console.log(`Created part at ${targetPath}`);
        } else {
          console.log(`Part already exists at ${targetPath}`);
        }
        break;

      case 'chapter':
        targetPath = path.join(basePath, 'basics', lessonName);
        if (!fs.existsSync(targetPath)) {
          fs.mkdirSync(targetPath, { recursive: true });
          fs.writeFileSync(path.join(targetPath, 'meta.md'), `---\ntype: chapter\ntitle: ${kebabToCapitalized(lessonName)}\n---`);

          const lessonPath = path.join(targetPath, '1-welcome');
          fs.mkdirSync(lessonPath, { recursive: true });
          fs.writeFileSync(path.join(lessonPath, 'content.md'), `---\ntype: lesson\ntitle: Welcome\n---\n# Welcome\n\nContent goes here.`);

          const filesPath = path.join(lessonPath, '_files');
          const solutionPath = path.join(lessonPath, '__solution');
          fs.mkdirSync(filesPath, { recursive: true });
          fs.mkdirSync(solutionPath, { recursive: true });
          fs.writeFileSync(path.join(filesPath, 'index.html'), '<!-- _files index.html content -->');
          fs.writeFileSync(path.join(solutionPath, 'index.html'), '<!-- __solution index.html content -->');

          console.log(`Created chapter at ${targetPath}`);
        } else {
          console.log(`Chapter already exists at ${targetPath}`);
        }
        break;

      case 'lesson':
        targetPath = path.join(basePath, 'basics', 'Introduction', lessonName);
        if (!fs.existsSync(targetPath)) {
          fs.mkdirSync(targetPath, { recursive: true });
          fs.writeFileSync(
            path.join(targetPath, 'content.md'),
            `---\ntype: lesson\ntitle: ${kebabToCapitalized(lessonName)}\n---\n# ${lessonName}\n\nContent goes here.`
          );

          const filesPath = path.join(targetPath, '_files');
          const solutionPath = path.join(targetPath, '__solution');
          fs.mkdirSync(filesPath, { recursive: true });
          fs.mkdirSync(solutionPath, { recursive: true });
          fs.writeFileSync(path.join(filesPath, 'index.html'), '<!-- _files index.html content -->');
          fs.writeFileSync(path.join(solutionPath, 'index.html'), '<!-- __solution index.html content -->');

          console.log(`Created lesson at ${targetPath}`);
        } else {
          console.log(`Lesson already exists at ${targetPath}`);
        }
        break;

      default:
        console.log('Invalid type');
        break;
    }

    rl.close();
  });
});

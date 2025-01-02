import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { dirname } from 'path';

// Parse arguments
const args = process.argv;
const inputName = args.slice(2).pop() || 'alpha';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const basePath = path.join(__dirname, 'src', 'content', 'tutorial');

// Extend String prototype with utility methods
Object.defineProperties(String.prototype, {
  titleCase: {
    value: function () {
      return this.replace(/(\w)(\w*)/g, (match, firstChar, rest) => 
        firstChar.toUpperCase() + rest.toLowerCase()
      ).replace(/[_\W]+/g, ' ');
    }
  },
  camelCase: {
    value: function () {
      return this.charAt(0).toLowerCase() + this.slice(1);
    }
  },
  kebabToCapitalized: {
    value: function () {
      return this.map((word) => word.charAt(0).toUpperCase() + word.slice(1)).join(' ');
    }
  }
});

// File type constants
const TUTORIAL_TYPE = {
  PART: 'part',
  CHAPTER: 'chapter',
  LESSON: 'lesson'
};

const FILE_TYPE = {
  META: 'meta',
  // CONTENT: 'content',
  // HTML: 'html'
}

// Map for determining filenames based on file type
const filenameMapper = new Map()
  .set(FILE_TYPE.META, (name) => `meta.md`);
  // .set(FILE_TYPE.CONTENT, (name) => `content.md`)
  // .set(FILE_TYPE.HTML, (name) => `index.html`);

// Boilerplate templates for different file types
const templateMapper = new Map();

/* Definition file template */
templateMapper.set(FILE_TYPE.META, (name) => `---
type: tutorial
template: ${name}
mainCommand: ['npm run start', 'Starting http server']
prepareCommands:
  - ['npm install', 'Installing dependencies']
---

<h1>Welcomer to the Tutorial</h1>
`);

// Component Class Definition
class Component {
  #content;
  #name = '';
  #folderPath = '';
  #fileName = 'Alpha';
  #fileType;

  constructor(name) {
    this.#name = name;
    // Assumption: All components are created inside `src/components` folder
    this.#folderPath = path.resolve('src', 'content', 'tutorial', this.#name);
  }

  prepareBoilerPlate() {
    if(fs.existsSync(this.#folderPath)) {
      return console.log('folder with same name already exists.')
    } else {
    fs.mkdirSync(this.#folderPath);
    Object.values(FILE_TYPE).map((type, i) => {
        this.generateContent({type}).createFile();
    });
  }
}

createFile() {
  const fileMetadata = {
    encoding: 'utf8',
    flag: 'w',
    mode: 0o666, // File permission mode
  };

  let fileNameWithPath = path.join(this.#folderPath, this.#fileName);
  console.log(fileNameWithPath);

  // if (this.#fileType === FILE_TYPE.CYPRESS_TEST) {
  //   fileNameWithPath = path.join('cypress', 'components', this.#fileName);
  // }

  fs.writeFile(fileNameWithPath, this.#content, fileMetadata, (err) => {
    if (err) {
      return console.log(err);
    }
    console.log('A new file saved -->', fileNameWithPath);
  });
  }

  generateContent({type}) {
    this.#fileName = filenameMapper.get(type)(this.#name);
    this.#content = templateMapper.get(type)(this.#name);
    return this; // This is MUST to chain the method
  }
}

// Example usage
const fileNameInTitleCase = inputName.titleCase();
const componentObject = new Component(fileNameInTitleCase);
componentObject.prepareBoilerPlate();



// rl.question('Enter the name of the lesson: ', (lessonName) => {
//   rl.question('Enter the type (part/chapter/lesson): ', (type) => {
//     const basePath = path.join(__dirname, '..', 'src', 'content', 'tutorial');
//     let targetPath;

//     switch (type) {
//       case 'part':
//         targetPath = path.join(basePath, lessonName);
//         if (!fs.existsSync(targetPath)) {
//           fs.mkdirSync(targetPath, { recursive: true });
//           fs.writeFileSync(path.join(targetPath, 'meta.md'), `---\ntype: part\ntitle: ${kebabToCapitalized(lessonName)}\n---`);

//           const chapterPath = path.join(targetPath, 'Introduction');
//           fs.mkdirSync(chapterPath, { recursive: true });
//           fs.writeFileSync(path.join(chapterPath, 'meta.md'), `---\ntype: chapter\ntitle: Introduction\n---`);

//           const lessonPath = path.join(chapterPath, '1-welcome');
//           fs.mkdirSync(lessonPath, { recursive: true });
//           fs.writeFileSync(path.join(lessonPath, 'content.md'), `---\ntype: lesson\ntitle: Welcome\n---\n# Welcome\n\nContent goes here.`);

//           const filesPath = path.join(lessonPath, '_files');
//           const solutionPath = path.join(lessonPath, '__solution');
//           fs.mkdirSync(filesPath, { recursive: true });
//           fs.mkdirSync(solutionPath, { recursive: true });
//           fs.writeFileSync(path.join(filesPath, 'index.html'), '<!-- _files index.html content -->');
//           fs.writeFileSync(path.join(solutionPath, 'index.html'), '<!-- __solution index.html content -->');

//           console.log(`Created part at ${targetPath}`);
//         } else {
//           console.log(`Part already exists at ${targetPath}`);
//         }
//         break;

//       case 'chapter':
//         targetPath = path.join(basePath, 'basics', lessonName);
//         if (!fs.existsSync(targetPath)) {
//           fs.mkdirSync(targetPath, { recursive: true });
//           fs.writeFileSync(path.join(targetPath, 'meta.md'), `---\ntype: chapter\ntitle: ${kebabToCapitalized(lessonName)}\n---`);

//           const lessonPath = path.join(targetPath, '1-welcome');
//           fs.mkdirSync(lessonPath, { recursive: true });
//           fs.writeFileSync(path.join(lessonPath, 'content.md'), `---\ntype: lesson\ntitle: Welcome\n---\n# Welcome\n\nContent goes here.`);

//           const filesPath = path.join(lessonPath, '_files');
//           const solutionPath = path.join(lessonPath, '__solution');
//           fs.mkdirSync(filesPath, { recursive: true });
//           fs.mkdirSync(solutionPath, { recursive: true });
//           fs.writeFileSync(path.join(filesPath, 'index.html'), '<!-- _files index.html content -->');
//           fs.writeFileSync(path.join(solutionPath, 'index.html'), '<!-- __solution index.html content -->');

//           console.log(`Created chapter at ${targetPath}`);
//         } else {
//           console.log(`Chapter already exists at ${targetPath}`);
//         }
//         break;

//       case 'lesson':
//         targetPath = path.join(basePath, 'basics', 'Introduction', lessonName);
//         if (!fs.existsSync(targetPath)) {
//           fs.mkdirSync(targetPath, { recursive: true });
//           fs.writeFileSync(
//             path.join(targetPath, 'content.md'),
//             `---\ntype: lesson\ntitle: ${kebabToCapitalized(lessonName)}\n---\n# ${lessonName}\n\nContent goes here.`
//           );

//           const filesPath = path.join(targetPath, '_files');
//           const solutionPath = path.join(targetPath, '__solution');
//           fs.mkdirSync(filesPath, { recursive: true });
//           fs.mkdirSync(solutionPath, { recursive: true });
//           fs.writeFileSync(path.join(filesPath, 'index.html'), '<!-- _files index.html content -->');
//           fs.writeFileSync(path.join(solutionPath, 'index.html'), '<!-- __solution index.html content -->');

//           console.log(`Created lesson at ${targetPath}`);
//         } else {
//           console.log(`Lesson already exists at ${targetPath}`);
//         }
//         break;

//       default:
//         console.log('Invalid type');
//         break;
//     }

//     rl.close();
//   });
// });

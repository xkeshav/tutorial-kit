console.log('hello from boilerplate');
// Import required modules
const fs = require('fs');
const path = require('path');

// Parse arguments
const args = process.argv;
const inputName = args.slice(2).pop() || 'alpha';

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
  }
});

// File type constants
const FILE_TYPE = {
  DEFINITION: 'definition',
  COMPONENT: 'component',
  STORYBOOK: 'storybook',
  STORYBOOK_DOCUMENT: 'storybookDocument',
  STYLE: 'style',
  CYPRESS_TEST: 'cypressTest'
};

// Map for determining filenames based on file type
const filenameMapper = new Map()
  .set(FILE_TYPE.DEFINITION, (name) => `${name}.d.ts`)
  .set(FILE_TYPE.COMPONENT, (name) => `${name}.tsx`)
  .set(FILE_TYPE.STORYBOOK, (name) => `${name}.stories.tsx`)
  .set(FILE_TYPE.STORYBOOK_DOCUMENT, (name) => `${name}.mdx`)
  .set(FILE_TYPE.STYLE, (name) => `${name}.module.scss`)
  .set(FILE_TYPE.CYPRESS_TEST, (name) => `${name}.cy.ts`);

// Boilerplate templates for different file types
const templateMapper = new Map();

// Example usage of filenameMapper
const fileType = FILE_TYPE.COMPONENT;
const fileName = filenameMapper.get(fileType)(inputName);
console.log(`Generated filename: ${fileName}`);

/* Definition file template */
templateMapper.set(FILE_TYPE.DEFINITION, (name) => ` /* Definition file boilerplate */
export type ${name}Props = {
  title: string; // TODO: Update as suits your component
};

export declare const ${name}: (props: ${name}Props) => JSX.Element;
`);

/* Component file template */
templateMapper.set(FILE_TYPE.COMPONENT, (name) => {
  const camelCaseName = name.camelCase();
  return `
/* Component boilerplate */
import { Fragment } from 'react';
import type { ${name}Props } from './${name}.d';
import ${camelCaseName}Style from './${name}.module.scss';

export const ${name} = (props: ${name}Props) => {
  const { title } = props;

  return (
    <Fragment>
      <div 
        className={${camelCaseName}Style.${camelCaseName}_container}
        data-cy="test--${camelCaseName}"
      >
        {'Boilerplate component with title props -->'} {title}
      </div>
    </Fragment>
  );
};
`;
});

/* Storybook file template */
templateMapper.set(FILE_TYPE.STORYBOOK, (name) => `/* Storybook boilerplate */
import type { Meta, StoryObj } from '@storybook/react';
import { ${name} } from './${name}';

type ComponentType = typeof ${name};

type MetaType = Meta<ComponentType>;

const meta: MetaType = {
  title: 'Components/${name}',
  component: ${name},
  decorators: [(story) => <div style={{padding: '2rem', outline: '1px solid pink'}}>{story}</div>],
  argTypes: {
    title: { controls: 'string' } /*TODO : update as per your component props */
  }
};

export default meta;

type Story = StoryObj<ComponentType>;

export const Default: Story = {
  args: {
    title: 'Default Title', // Adjust props as needed
  },
};

export const PrimaryStory: Story = {
name: '${name}',
  args: { title: '${name} Boilerplate Storybook'} /* Adjust props as needed */
};

`);

/* Storybook Document File Template */
templateMapper.set(FILE_TYPE.STORYBOOK_DOCUMENT, (name) => `{ /* Storybook document file boilerplate */ }
import { Meta, Primary, Canvas, Controls, Story } from '@storybook/blocks';
import * as ${name}Stories from './${name}.stories';

<Meta of={${name}Stories} />

# ${name}

This is **${name}** component.

## Props
<Controls />

## Primary
<Primary />

## Stories

### Primary Component
<Canvas of={${name}Stories.PrimaryStory} />
  `
);

/* SCSS File Template */
templateMapper.set(FILE_TYPE.STYLE, (name) => {
  /* Style file boilerplate */
  return `
    /* TODO: Update styles as per your component's requirements */
    .${name.camelCase()}_container {
      border: 1px dashed #f11f1f;
      background-color: #fbefef;
      color: black;
      padding: 2rem;
    }
  `;
});


/* SCSS file template */
templateMapper.set(FILE_TYPE.STYLE, (name) => `
/* Style file boilerplate */

/* TODO: Update style as per your component style */
.${name.camelCase()}_container {
  border: 1px dashed #f11f1f;
  background-color: #fbefef;
  color: black;
  padding: 2rem;
}
`);

/* Cypress test file template */
templateMapper.set(FILE_TYPE.CYPRESS_TEST, (name) => `/* Cypress boilerplate for component */
import 'cypress-axe';
import { ${name} } from '../../src/components/${name}/${name}';
import '../support/component';

describe('${name} component', () => {
  const axeConfiguration = {
    rules: [
      { id: 'page-has-heading-one', enabled: false },
      { id: 'html-has-lang', enabled: false },
      { id: 'landmark-one-main', enabled: false },
      { id: 'region', enabled: false },
    ]
  };

  beforeEach(() => {
    cy.log(Cypress.currentTest.title);
    cy.mount(<${name} title="Cypress component" />);
    cy.get('[data-cy="test--${name.camelCase()}"]').as('compData');
    cy.injectAxe();
  });

  it('should pass accessibility tests', () => {
    cy.checkA11y(null, axeConfiguration);
  });

  it('render with no accessibility violations', () => {
    cy.configureAxe(axeConfiguration);
    cy.checkA11y();
  });

  it('should render with title', () => {
    cy.get('@compData').should('have.text', 'Boilerplate component with title props --> cypress component');
  });

});
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
    this.#folderPath = path.resolve('src', 'components', this.#name);
  }

  prepareBoilerPlate() {
    if(fs.existsSync(this.#folderPath)) {
      return console.log('folder with same name already exists.')
    } else {
    fs.mkdirSync(this.#folderPath);
    Object.values(FILE_TYPE).map((type, i) => {
      // this.#fileType = type;
      // this.#fileName = filenameMapper.get(type)(this.#name);
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

  if (this.#fileType === FILE_TYPE.CYPRESS_TEST) {
    fileNameWithPath = path.join('cypress', 'components', this.#fileName);
  }

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

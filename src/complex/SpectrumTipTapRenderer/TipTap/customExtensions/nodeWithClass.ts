import { Node, mergeAttributes } from '@tiptap/core';
import { getNodeName, getTag, removeWhiteSpace } from './utils';

declare type Level = 1 | 2 | 3 | 4 | 5 | 6;
export interface NodeOptions {
  HTMLAttributes: Record<string, any>;
  classes: Array<string>;
  styles: Array<string>;
  excludes: string;
  level?: Level;
  nodeName?: string | undefined;
  tag: string;
}

declare module '@tiptap/core' {
  interface Commands<ReturnType> {
    nodeWithClass: {
      /**
       * Toggle a nodeWithClass
       */
      toggleNodeWithClass: (attributes: {
        class: string | unknown;
        tag?: string;
        nodeName?: string | undefined;
        level?: Level;
      }) => ReturnType;
    };
  }
}

export const nodeWithClass = Node.create<NodeOptions>({
  name: 'nodeWithClass',

  addOptions() {
    return {
      tag: 'p',
      nodeName: 'paragraph',
      classes: [''],
      styles: [''],
      level: 6,
      excludes: 'nodeWithClass',
      HTMLAttributes: {},
      shortcuts: [],
    };
  },

  content: 'inline*',

  group: 'block',

  defining: true,

  addAttributes() {
    return {
      level: {
        default: this.options.level,
        parseHTML: (element) => element.getAttribute('level'),
        renderHTML: (attributes) => {
          if (!attributes.level) {
            return {};
          }
          return {
            level: attributes.level,
          };
        },
      },
      class: {
        default: this.options.classes[0],
        parseHTML: (element) => element.getAttribute('class'),
        renderHTML: (attributes) => {
          if (!attributes.class) {
            return {};
          }
          return {
            class: attributes.class,
          };
        },
      },
      style: {
        default: this.options.styles[0],
        parseHTML: (element) => element.getAttribute('style'),
        renderHTML: (attributes) => {
          if (!attributes.style) {
            return {};
          }
          return {
            style: attributes.style,
          };
        },
      },
      tag: {
        default: 'p',
        parseHTML: (element) => element.getAttribute('tag'),
        renderHTML: (attributes) => {
          if (!attributes.tag) {
            return {};
          }
          return {
            tag: attributes.tag,
          };
        },
      },
    };
  },

  parseHTML() {
    return [
      {
        tag: this.options.tag,
        getAttrs: (element) => {
          const hasClass = (element as HTMLElement).hasAttribute('class');

          if (!hasClass) {
            return false;
          }

          return {};
        },
      },
    ];
  },

  renderHTML({ HTMLAttributes }) {
    const tag = HTMLAttributes?.tag || this?.options?.tag;
    delete HTMLAttributes?.tag;
    return [tag, mergeAttributes(this.options.HTMLAttributes, HTMLAttributes), 0];
  },

  addCommands() {
    return {
      toggleNodeWithClass:
        (attributes) =>
        ({ chain, editor }) => {
          const nodeName: string = getNodeName(editor, attributes?.tag ?? getTag(editor));
          const currentClass: string | undefined = removeWhiteSpace(
            editor.getAttributes(nodeName).class ?? ''
          );
          const currClass: string = ` ${currentClass} `;
          const regex = new RegExp(`\\b${attributes.class}\\b`, 'g');
          const newClass: string | undefined = currentClass
            ? removeWhiteSpace(currClass.replace(regex, ''))
            : undefined;

          let nodeClass: string | undefined | unknown = undefined;
          const isNewTag = attributes.tag && getTag(editor) !== attributes.tag;

          if (newClass !== currentClass && !isNewTag) {
            nodeClass = newClass ?? attributes.class;
          } else {
            if (isNewTag) {
              nodeClass = attributes.class;
            } else {
              nodeClass = removeWhiteSpace(
                `${currentClass ?? undefined} ${attributes.class ?? undefined}`
              );
            }
          }
          if (nodeClass === '') {
            nodeClass = undefined;
          }

          if (nodeName === 'heading') {
            const level: Level =
              attributes.level || editor.getAttributes(nodeName).level || this.options.level;
            return chain()
              .setHeading({ level: level })
              .updateAttributes(nodeName, {
                class: nodeClass,
                level: level,
                style: editor.getAttributes(nodeName).style ?? undefined,
              })
              .unsetBlockquote()
              .run();
          } else if (nodeName === 'blockquote') {
            return chain()
              .setParagraph()
              .setBlockquote()
              .updateAttributes(nodeName, {
                class: nodeClass,
                style: editor.getAttributes(nodeName).style ?? undefined,
              })
              .run();
          } else {
            return chain()
              .setParagraph()
              .updateAttributes(nodeName, {
                class: nodeClass,
                style: editor.getAttributes(nodeName).style ?? undefined,
              })
              .unsetBlockquote()
              .run();
          }
        },
    };
  },
});

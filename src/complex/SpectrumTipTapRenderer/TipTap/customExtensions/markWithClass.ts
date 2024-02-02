import { Mark, mergeAttributes } from '@tiptap/core';
import { getMarkName, getTag, removeWhiteSpace } from './utils';

declare type Level = 1 | 2 | 3 | 4 | 5 | 6;
export interface MarkOptions {
  HTMLAttributes: Record<string, any>;
  classes: Array<string>;
  excludes: string;
  level?: Level;
  markName?: string | undefined;
  tag: string;
}

declare module '@tiptap/core' {
  interface Commands<ReturnType> {
    markWithClass: {
      /**
       * Toggle a markWithClass
       */
      toggleMarkWithClass: (attributes: {
        class: string | unknown;
        tag?: string;
        markName?: string | undefined;
        level?: Level;
      }) => ReturnType;
    };
  }
}

export const markWithClass = Mark.create<MarkOptions>({
  name: 'markWithClass',

  addOptions() {
    return {
      tag: 'p',
      markName: 'paragraph',
      classes: [''],
      level: 6,
      excludes: 'markWithClass',
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
        rendered: false,
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
      toggleMarkWithClass:
        (attributes) =>
        ({ chain, editor }) => {
          const markName: string = getMarkName(editor, attributes?.tag ?? getTag(editor));
          const currentClass: string | undefined = removeWhiteSpace(
            editor.getAttributes(markName).class ?? ''
          );
          const currClass: string = ` ${currentClass} `;
          const regex = new RegExp(`\\b${attributes.class}\\b`, 'g');
          const newClass: string | undefined = currentClass
            ? removeWhiteSpace(currClass.replace(regex, ''))
            : undefined;

          let markClass: string | undefined | unknown = undefined;
          const isNewTag = attributes.tag && getTag(editor) !== attributes.tag;

          if (newClass !== currentClass && !isNewTag) {
            markClass = newClass ?? attributes.class;
          } else {
            if (isNewTag) {
              markClass = attributes.class;
            } else {
              markClass = removeWhiteSpace(
                `${currentClass ?? undefined} ${attributes.class ?? undefined}`
              );
            }
          }
          if (markClass === '') {
            markClass = undefined;
          }

          if (markName === 'heading') {
            const level: Level =
              attributes.level || editor.getAttributes(markName).level || this.options.level;
            return chain()
              .setHeading({ level: level })
              .updateAttributes(markName, {
                class: markClass,
                level: level,
              })
              .unsetBlockquote()
              .run();
          } else if (markName === 'blockquote') {
            return chain()
              .setParagraph()
              .setBlockquote()
              .updateAttributes(markName, {
                class: markClass,
              })
              .run();
          } else {
            return chain()
              .setParagraph()
              .updateAttributes(markName, {
                class: markClass,
              })
              .unsetBlockquote()
              .run();
          }
        },
    };
  },
});

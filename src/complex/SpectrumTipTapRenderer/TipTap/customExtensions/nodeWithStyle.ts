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
    nodeWithStyle: {
      /**
       * Toggle a nodeWithStyle
       */
      toggleNodeWithStyle: (attributes: {
        style: string | unknown;
        tag?: string;
        nodeName?: string | undefined;
        level?: Level;
      }) => ReturnType;
    };
  }
}

export const nodeWithStyle = Node.create<NodeOptions>({
  name: 'nodeWithStyle',

  addOptions() {
    return {
      tag: 'p',
      nodeName: 'paragraph',
      classes: [''],
      styles: [''],
      level: 6,
      excludes: 'nodeWithStyle',
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
          const hasStyle = (element as HTMLElement).hasAttribute('style');

          if (!hasStyle) {
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
      toggleNodeWithStyle:
        (attributes) =>
        ({ chain, editor }) => {
          const nodeName: string = getNodeName(editor, attributes?.tag ?? getTag(editor));
          const currentStyle: string | undefined = removeWhiteSpace(
            editor.getAttributes(nodeName).style ?? ''
          );
          const currStyle: string = ` ${currentStyle} `;
          let newStyle: string | undefined;
          if (typeof attributes.style === 'string') {
            const regex = new RegExp(attributes.style.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'), 'g');
            newStyle = currentStyle ? removeWhiteSpace(currStyle.replace(regex, '')) : undefined;
          } else {
            newStyle = currentStyle ? removeWhiteSpace(currStyle) : undefined;
          }

          let nodeStyle: string | undefined | unknown = undefined;
          const isNewTag = attributes.tag && getTag(editor) !== attributes.tag;

          if (newStyle !== currentStyle && !isNewTag) {
            nodeStyle = newStyle ?? attributes.style;
          } else {
            if (isNewTag) {
              nodeStyle = attributes.style;
            } else {
              nodeStyle = removeWhiteSpace(
                `${currentStyle ?? undefined} ${attributes.style ?? undefined}`
              );
            }
          }
          if (nodeStyle === '') {
            nodeStyle = undefined;
          }

          if (nodeName === 'heading') {
            const level: Level =
              attributes.level || editor.getAttributes(nodeName).level || this.options.level;
            return chain()
              .setHeading({ level: level })
              .updateAttributes(nodeName, {
                style: nodeStyle,
                level: level,
                class: editor.getAttributes(nodeName).class ?? undefined,
              })
              .unsetBlockquote()
              .run();
          } else if (nodeName === 'blockquote') {
            return chain()
              .setParagraph()
              .setBlockquote()
              .updateAttributes(nodeName, {
                style: nodeStyle,
                class: editor.getAttributes(nodeName).class ?? undefined,
              })
              .run();
          } else {
            return chain()
              .setParagraph()
              .updateAttributes(nodeName, {
                style: nodeStyle,
                class: editor.getAttributes(nodeName).class ?? undefined,
              })
              .unsetBlockquote()
              .run();
          }
        },
    };
  },
});

// import { Mark, mergeAttributes } from '@tiptap/core';
// import { removeWhiteSpace } from './utils';

// export interface MarkOptions {
//   HTMLAttributes: Record<string, any>;
//   classes: Array<string>;
//   styles: Array<string>;
//   excludes: string;
// }

// declare module '@tiptap/core' {
//   interface Commands<ReturnType> {
//     markWithStyle: {
//       /**
//        * Toggle a markWithStyle
//        */
//       toggleMarkWithStyle: (attributes: { style: string | unknown }) => ReturnType;
//     };
//   }
// }

// export const markWithStyle = Mark.create<MarkOptions>({
//   name: 'markWithStyle',

//   addOptions() {
//     return {
//       classes: [''],
//       styles: [''],
//       excludes: 'markWithStyle',
//       HTMLAttributes: {},
//     };
//   },

//   content: 'inline*',

//   group: 'block',

//   defining: true,

//   addAttributes() {
//     return {
//       class: {
//         default: this.options.classes[0],
//         parseHTML: (element) => element.getAttribute('class'),
//         renderHTML: (attributes) => {
//           if (!attributes.class) {
//             return {};
//           }
//           return {
//             class: attributes.class,
//           };
//         },
//       },
//       style: {
//         default: this.options.styles[0],
//         parseHTML: (element) => element.getAttribute('style'),
//         renderHTML: (attributes) => {
//           if (!attributes.style) {
//             return {};
//           }
//           return {
//             style: attributes.style,
//           };
//         },
//       },
//     };
//   },

//   parseHTML() {
//     return [
//       {
//         tag: 'span',
//         getAttrs: (element) => {
//           const hasStyle = (element as HTMLElement).hasAttribute('style');

//           if (!hasStyle) {
//             return false;
//           }

//           return {};
//         },
//       },
//     ];
//   },

//   renderHTML({ HTMLAttributes }) {
//     return ['span', mergeAttributes(this.options.HTMLAttributes, HTMLAttributes), 0];
//   },

//   addCommands() {
//     return {
//       toggleMarkWithStyle:
//         (attributes) =>
//         ({ chain, editor }) => {
//           const currentStyle: string | undefined = removeWhiteSpace(
//             editor.getAttributes('span').style ?? ''
//           );
//           const currStyle: string = ` ${currentStyle} `;
//           let newStyle: string | undefined;
//           if (typeof attributes.style === 'string') {
//             const regex = new RegExp(attributes.style.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'), 'g');
//             newStyle = currentStyle ? removeWhiteSpace(currStyle.replace(regex, '')) : undefined;
//           } else {
//             newStyle = currentStyle ? removeWhiteSpace(currStyle) : undefined;
//           }

//           let markStyle: string | undefined | unknown = undefined;

//           if (newStyle !== currentStyle) {
//             markStyle = newStyle ?? attributes.style;
//           } else {
//             markStyle = removeWhiteSpace(
//               `${currentStyle ?? undefined} ${attributes.style ?? undefined}`
//             );
//           }
//           if (markStyle === '') {
//             markStyle = undefined;
//           }

//           return chain()
//             .setParagraph()
//             .updateAttributes('span', {
//               style: markStyle,
//               class: editor.getAttributes('span').class ?? undefined,
//             })
//             .unsetBlockquote()
//             .run();
//         },
//     };
//   },
// });

// import { Mark, markInputRule, markPasteRule, mergeAttributes } from '@tiptap/core';
// import { removeWhiteSpace } from './utils';

// export interface MarkOptions {
//   HTMLAttributes: Record<string, any>;
//   classes: Array<string>;
//   styles: Array<string>;
//   excludes: string;
// }

// declare module '@tiptap/core' {
//   interface Commands<ReturnType> {
//     markWithStyle: {
//       /**
//        * Toggle a bold mark
//        */
//       toggleMarkWithStyle: (attributes: {
//         style: string | unknown;
//         class?: string | unknown;
//       }) => ReturnType;
//     };
//   }
// }

// export const starInputRegex = /(?:^|\s)((?:\*\*)((?:[^*]+))(?:\*\*))$/;
// export const starPasteRegex = /(?:^|\s)((?:\*\*)((?:[^*]+))(?:\*\*))/g;
// export const underscoreInputRegex = /(?:^|\s)((?:__)((?:[^__]+))(?:__))$/;
// export const underscorePasteRegex = /(?:^|\s)((?:__)((?:[^__]+))(?:__))/g;

// export const markWithStyle = Mark.create<MarkOptions>({
//   name: 'markWithStyle',

//   addOptions() {
//     return {
//       tag: 'span',
//       classes: [''],
//       styles: [''],
//       excludes: 'markWithStyle',
//       HTMLAttributes: {},
//     };
//   },

//   // parseHTML() {
//   //   return [
//   //     {
//   //       tag: 'span',
//   //     },
//   //   ];
//   // },

//   parseHTML() {
//     return [
//       {
//         tag: 'span',
//         getAttrs: (element) => {
//           const hasStyle = (element as HTMLElement).hasAttribute('style');

//           if (!hasStyle) {
//             return false;
//           }

//           return {};
//         },
//       },
//     ];
//   },

//   renderHTML({ HTMLAttributes }) {
//     return ['span', mergeAttributes(this.options.HTMLAttributes, HTMLAttributes), 0];
//   },

//   // addCommands() {
//   //   return {
//   //     toggleMarkWithStyle:
//   //       () =>
//   //       ({ commands }) => {
//   //         return commands.toggleMark(this.name);
//   //       },
//   //   };
//   // },

//   addCommands() {
//     return {
//       toggleMarkWithStyle:
//         (attributes) =>
//         ({ chain, editor }) => {
//           const currentStyle: string | undefined = removeWhiteSpace(
//             editor.getAttributes('span').style ?? ''
//           );
//           const currStyle: string = ` ${currentStyle} `;
//           let newStyle: string | undefined;
//           if (typeof attributes.style === 'string') {
//             const regex = new RegExp(attributes.style.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'), 'g');
//             newStyle = currentStyle ? removeWhiteSpace(currStyle.replace(regex, '')) : undefined;
//           } else {
//             newStyle = currentStyle ? removeWhiteSpace(currStyle) : undefined;
//           }

//           let markStyle: string | undefined | unknown = undefined;

//           if (newStyle !== currentStyle) {
//             markStyle = newStyle ?? attributes.style;
//           } else {
//             markStyle = removeWhiteSpace(
//               `${currentStyle ?? undefined} ${attributes.style ?? undefined}`
//             );
//           }
//           if (markStyle === '') {
//             markStyle = undefined;
//           }
//           console.log(this.name, markStyle);
//           return chain()
//             .toggleMark(this.name, {
//               style: markStyle,
//               class: editor.getAttributes('span').class ?? undefined,
//             })
//             .run();
//           // return chain()
//           //   .toggleMark(this.name)
//           //   .updateAttributes('span', {
//           //     style: markStyle,
//           //     class: editor.getAttributes('span').class ?? undefined,
//           //   })
//           //   .run();
//         },
//     };
//   },

//   addInputRules() {
//     return [
//       markInputRule({
//         find: starInputRegex,
//         type: this.type,
//       }),
//       markInputRule({
//         find: underscoreInputRegex,
//         type: this.type,
//       }),
//     ];
//   },

//   addPasteRules() {
//     return [
//       markPasteRule({
//         find: starPasteRegex,
//         type: this.type,
//       }),
//       markPasteRule({
//         find: underscorePasteRegex,
//         type: this.type,
//       }),
//     ];
//   },
// });

import { Mark, mergeAttributes } from '@tiptap/core';
import { removeWhiteSpace } from './utils';

export interface MarkerOptions {
  HTMLAttributes: Record<string, any>;
  classes: Array<string>;
  styles: Array<string>;
  tag: string;
  excludes: string;
  shortcuts: Array<string>;
}

declare module '@tiptap/core' {
  interface Commands<ReturnType> {
    markWithStyle: {
      /**
       * Toggle a marker
       */
      toggleMarkWithStyle: (attributes?: { style: string | unknown }) => ReturnType;
    };
  }
}

let currentMarkStyle: string | undefined = undefined;
export const markWithStyle = Mark.create<MarkerOptions>({
  name: 'markWithStyle',

  addOptions() {
    return {
      tag: 'span',
      classes: [''],
      styles: [''],
      excludes: 'markWithStyle',
      HTMLAttributes: {},
      shortcuts: [],
    };
  },

  addAttributes() {
    return {
      class: {
        default: this.options.classes[0],
        parseHTML: (element) => element.getAttribute('class'),
        renderHTML: (attributes) => {
          // console.log(attributes, '|');
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
    };
  },

  parseHTML() {
    return [
      {
        tag: this.options.tag ?? 'span',
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
    return [this.options.tag, mergeAttributes(this.options.HTMLAttributes, HTMLAttributes), 0];
  },

  addCommands() {
    return {
      toggleMarkWithStyle:
        (attributes) =>
        ({ chain, editor }) => {
          const currentStyle: string | undefined = removeWhiteSpace(
            editor.getAttributes('span').style ?? ''
          );
          const currStyle: string = ` ${currentStyle} `;
          let newStyle: string | undefined;
          if (typeof attributes?.style === 'string') {
            const regex = new RegExp(attributes.style.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'), 'g');
            newStyle = currentStyle ? removeWhiteSpace(currStyle.replace(regex, '')) : undefined;
          } else {
            newStyle = currentStyle ? removeWhiteSpace(currStyle) : undefined;
          }

          let markStyle: string | undefined | unknown = undefined;

          if (newStyle !== currentStyle) {
            markStyle = newStyle ?? attributes?.style;
          } else {
            markStyle = removeWhiteSpace(
              `${currentStyle ?? undefined} ${attributes?.style ?? undefined}`
            );
          }
          if (markStyle === '') {
            markStyle = undefined;
          }
          console.log(currentStyle, currStyle, newStyle, markStyle);
          return chain()
            .toggleMark(this.name, {
              style: markStyle,
              class: editor.getAttributes('textStyle').class ?? undefined,
            })
            .run();
        },
    };
  },
});

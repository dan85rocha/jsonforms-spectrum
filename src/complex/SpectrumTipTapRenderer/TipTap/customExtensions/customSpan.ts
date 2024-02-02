import { TextStyle } from '@tiptap/extension-text-style';

export const CustomSpan = TextStyle.extend({
  addAttributes() {
    return {
      class: {
        default: null,
        rendered: true,
        parseHTML: (element: any) => element.getAttribute('class'),
        renderHTML: (attributes: any) => {
          return {
            class: attributes.class,
          };
        },
      },
      style: {
        default: null,
        rendered: true,
        parseHTML: (element: any) => element.getAttribute('style'),
        renderHTML: (attributes: any) => {
          return {
            style: attributes.style,
          };
        },
      },
    };
  },
});

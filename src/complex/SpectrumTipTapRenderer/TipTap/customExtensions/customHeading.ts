import { Heading } from '@tiptap/extension-heading';

export const CustomHeading = Heading.extend({
  addAttributes() {
    return {
      level: {
        default: 1,
        rendered: false,
      },
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

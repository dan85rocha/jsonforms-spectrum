import { Paragraph } from '@tiptap/extension-paragraph';

export const CustomParagraph = Paragraph.extend({
  addAttributes() {
    return {
      class: {
        default: null,
        // Customize the HTML parsing (for example, to load the initial content)
        parseHTML: (element: any) => element.getAttribute('class'),
        // … and customize the HTML rendering.
        renderHTML: (attributes: any) => {
          return {
            class: attributes.class,
          };
        },
      },
      style: {
        default: null,
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

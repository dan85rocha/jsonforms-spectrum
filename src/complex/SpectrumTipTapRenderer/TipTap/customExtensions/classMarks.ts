import { Mark, mergeAttributes } from '@tiptap/core';

export interface MarkerOptions {
  HTMLAttributes: Record<string, any>;
  classes: Array<string>;
  tag: string;
  excludes: string;
  shortcuts: Array<string>;
}

declare module '@tiptap/core' {
  interface Commands<ReturnType> {
    marker: {
      /**
       * Set a marker
       */
      setMarker: (attributes?: { class: string } | { class: string; tag: string }) => ReturnType;
      /**
       * Toggle a marker
       */
      toggleMarker: (attributes?: { class: string } | { class: string; tag: string }) => ReturnType;
      /**
       * Unset a marker
       */
      unsetMarker: () => ReturnType;
    };
  }
}

export const Marker = Mark.create<MarkerOptions>({
  name: 'marker',

  addOptions() {
    return {
      tag: 'span',
      classes: [''],
      excludes: 'marker',
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
          if (!attributes.class) {
            return {};
          }
          return {
            class: attributes.class,
          };
        },
      },
      tag: {
        default: 'span',
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
      setMarker:
        (attributes) =>
        ({ commands }) => {
          return commands.setMark(this.name, attributes);
        },
      toggleMarker:
        (attributes) =>
        ({ commands }) => {
          return commands.toggleMark(this.name, attributes);
        },
      unsetMarker:
        () =>
        ({ commands }) => {
          return commands.unsetMark(this.name);
        },
    };
  },
});

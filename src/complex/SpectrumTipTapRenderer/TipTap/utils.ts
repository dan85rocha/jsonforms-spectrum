import { Editor } from '@tiptap/react';

export const getTag = (editor: Editor) => {
  if (editor.isActive('heading')) {
    return `h${editor.getAttributes('heading').level}`;
  } else if (editor.isActive('blockquote')) {
    return 'blockquote';
  } else if (editor.isActive('span')) {
    return 'span';
  } else {
    return 'p';
  }
};

export const getNodeName = (editor: any, tag?: string) => {
  if (tag) {
    if (tag.startsWith('h') && tag.length === 2) {
      return 'heading';
    } else if (tag === 'blockquote') {
      return 'blockquote';
    } else if (tag === 'span') {
      return 'span';
    } else {
      return 'paragraph';
    }
  } else {
    if (editor.isActive('heading')) {
      return 'heading';
    } else if (editor.isActive('blockquote')) {
      return 'blockquote';
    } else if (editor.isActive('span')) {
      return 'span';
    } else {
      return 'paragraph';
    }
  }
};

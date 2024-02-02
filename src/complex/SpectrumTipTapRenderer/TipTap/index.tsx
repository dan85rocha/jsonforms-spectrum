import * as React from 'react';
import { useEditor, EditorContent } from '@tiptap/react';
import Highlight from '@tiptap/extension-highlight';
import TypographyExtension from '@tiptap/extension-typography';
import UnderlineExtension from '@tiptap/extension-underline';
import Link from '@tiptap/extension-link';
import TextAlign from '@tiptap/extension-text-align';
import Focus from '@tiptap/extension-focus';
import Superscript from '@tiptap/extension-superscript';
import Subscript from '@tiptap/extension-subscript';
import ProjectCreateContentToolbar from './Toolbar';
import {
  nodeWithClass,
  markWithClass,
  markWithStyle,
  nodeWithStyle,
  markToggleClass,
  CustomSpan,
  CustomHeading,
  CustomParagraph,
} from './customExtensions';
import { Blockquote } from '@tiptap/extension-blockquote';
import { Bold } from '@tiptap/extension-bold';
import { BulletList } from '@tiptap/extension-bullet-list';
import { Code } from '@tiptap/extension-code';
import { CodeBlock } from '@tiptap/extension-code-block';
import { Dropcursor } from '@tiptap/extension-dropcursor';
import { HardBreak } from '@tiptap/extension-hard-break';
import { History } from '@tiptap/extension-history';
import { HorizontalRule } from '@tiptap/extension-horizontal-rule';
import { Italic } from '@tiptap/extension-italic';
import { ListItem } from '@tiptap/extension-list-item';
import { OrderedList } from '@tiptap/extension-ordered-list';
import { Strike } from '@tiptap/extension-strike';
import Document from '@tiptap/extension-document';
import Text from '@tiptap/extension-text';
import { Flex } from '@adobe/react-spectrum';
import TableRow from '@tiptap/extension-table-row';
import TableCell from '@tiptap/extension-table-cell';
import TableHeader from '@tiptap/extension-table-header';
import Table from '@tiptap/extension-table';
import Image from '@tiptap/extension-image';

interface TipTapProps {
  EditorJSONCallback: any;
  returnMode: any;
  noToolbar: boolean;
  readOnly: boolean;
  uischema: any;
}

export default function EditorComponent({
  content,
  EditorJSONCallback,
  noToolbar = false,
  returnMode = false,
  readOnly = false,
  uischema,
}: TipTapProps & {
  content: string;
}) {
  const editor = useEditor({
    editable: !readOnly,
    extensions: [
      // StarterKit,
      Blockquote,
      Bold,
      BulletList,
      Code,
      CodeBlock,
      CustomHeading,
      CustomParagraph,
      Document,
      Dropcursor,
      HardBreak,
      Highlight,
      History,
      HorizontalRule,
      Italic,
      Link,
      ListItem,
      OrderedList,
      Strike,
      Subscript,
      Superscript,
      Text,
      TypographyExtension,
      UnderlineExtension,
      nodeWithClass,
      markWithClass,
      markWithStyle,
      markToggleClass,
      nodeWithStyle,
      CustomSpan,
      Image.configure({
        inline: true,
        HTMLAttributes: {
          // AEM editor forces this size
          width: 240,
          height: 140,
        },
      }),
      Table,
      TableHeader,
      TableRow,
      TableCell,
      TextAlign.configure({
        types: ['heading', 'paragraph'],
      }),
      Focus.configure({
        className: 'has-focus',
        mode: 'all',
      }),
    ],
    content:
      returnMode === 'text' || returnMode === 'markdown'
        ? content.replace(/\n/g, '<br />')
        : content,
  });

  const firstRender = React.useRef(true);
  React.useEffect(() => {
    if (firstRender.current) {
      firstRender.current = false;
      return;
    }
    const delayDebounceFn = setTimeout(() => {
      if (returnMode === 'text' || returnMode === 'markdown') {
        EditorJSONCallback(editor?.getText());
      } else {
        EditorJSONCallback(editor?.getHTML());
      }
    }, 500);

    return () => clearTimeout(delayDebounceFn);
  }, [editor?.getHTML()]);

  if (!editor) return null;

  return (
    <Flex direction='column'>
      {!noToolbar && (
        <ProjectCreateContentToolbar editor={editor} readOnly={readOnly} uischema={uischema} />
      )}
      <EditorContent
        editor={editor}
        className={`${noToolbar ? 'noToolbar' : ''} ${readOnly ? 'readOnly' : ''}`}
      />
    </Flex>
  );
}

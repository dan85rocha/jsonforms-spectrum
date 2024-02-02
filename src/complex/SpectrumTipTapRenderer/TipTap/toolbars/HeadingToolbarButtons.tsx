import React from 'react';
import { Editor } from '@tiptap/react';

import { Flex, ToggleButton, Picker, Item } from '@adobe/react-spectrum';
import { getNodeName } from '../utils';

export default function HeadingToolbarButtons({
  editor,
  readOnly,
}: {
  editor: Editor;
  readOnly: boolean;
}) {
  const currentText = () => {
    if (editor.isActive('heading')) {
      'H' + editor.getAttributes('heading').level;
    } else if (editor.isActive('blockquote')) {
      ('Blockquote');
    } else {
      ('Paragraph');
    }
  };

  const picker = true;

  let options = [
    { name: 'Paragraph' },
    { name: 'H2' },
    { name: 'H3' },
    { name: 'H4' },
    { name: 'H5' },
    { name: 'H6' },
    { name: 'Blockquote' },
  ];
  let [heading, setHeading]: any = React.useState(null);

  const pickerChange = (selected: string) => {
    setHeading(selected);
    switch (selected) {
      case 'Paragraph':
        editor
          .chain()
          .focus()
          .toggleNodeWithClass({
            class: editor.getAttributes(getNodeName(editor)).class,
            tag: 'p',
          })
          .unsetBlockquote()
          .run();
        break;
      case 'H1':
        editor
          .chain()
          .focus()
          .toggleNodeWithClass({
            class: editor.getAttributes(getNodeName(editor)).class,
            tag: 'h1',
            level: 1,
          })
          .unsetBlockquote()
          .run();
        break;
      case 'H2':
        editor
          .chain()
          .focus()
          .toggleNodeWithClass({
            class: editor.getAttributes(getNodeName(editor)).class ?? undefined,
            tag: 'h2',
            level: 2,
          })
          .unsetBlockquote()
          .run();
        break;
      case 'H3':
        editor
          .chain()
          .focus()
          .toggleNodeWithClass({
            class: editor.getAttributes(getNodeName(editor)).class,
            tag: 'h3',
            level: 3,
          })
          .unsetBlockquote()
          .run();
        break;
      case 'H4':
        editor
          .chain()
          .focus()
          .toggleNodeWithClass({
            class: editor.getAttributes(getNodeName(editor)).class,
            tag: 'h4',
            level: 4,
          })
          .unsetBlockquote()
          .run();
        break;
      case 'H5':
        editor
          .chain()
          .focus()
          .toggleNodeWithClass({
            class: editor.getAttributes(getNodeName(editor)).class,
            tag: 'h5',
            level: 5,
          })
          .unsetBlockquote()
          .run();
        break;
      case 'H6':
        editor
          .chain()
          .focus()
          .toggleNodeWithClass({
            class: editor.getAttributes(getNodeName(editor)).class,
            tag: 'h6',
            level: 6,
          })
          .unsetBlockquote()
          .run();
        break;
      case 'Blockquote':
        editor
          .chain()
          .focus()
          .setParagraph()
          .toggleNodeWithClass({
            class: editor.getAttributes(getNodeName(editor)).class,
            tag: 'blockquote',
          })
          .run();
        break;
      default:
        break;
    }
  };

  React.useEffect(() => {
    setHeading(
      editor.isActive('heading')
        ? 'H' + editor.getAttributes('heading').level
        : editor.isActive('blockquote')
        ? 'Blockquote'
        : 'Paragraph'
    );
  }, [editor, currentText]);
  // React.useEffect(() => {
  //   setHeading(currentText());
  // }, [editor, currentText]);

  return (
    <Flex alignItems='center'>
      {picker ? (
        <Picker
          aria-label='Picker'
          label={false}
          items={options}
          selectedKey={heading}
          onSelectionChange={(selected: any) => pickerChange(selected)}
          maxWidth='size-1600'
          isDisabled={readOnly}
        >
          {(item) => <Item key={item.name}>{item.name}</Item>}
        </Picker>
      ) : (
        <div>
          {options.map((item: any, _index: number) => {
            return (
              <ToggleButton
                UNSAFE_className='ToggleButton'
                aria-label={item.name}
                isQuiet
                isSelected={heading === item.name}
                key={item.name}
                onPress={() => pickerChange(item.name)}
              >
                <strong>{item.name}</strong>
              </ToggleButton>
            );
          })}
        </div>
      )}
    </Flex>
  );
}

/*
  The MIT License

  Copyright (c) 2017-2019 EclipseSource Munich
  https://github.com/eclipsesource/jsonforms

  Copyright (c) 2022 headwire.com, Inc
  https://github.com/headwirecom/jsonforms-react-spectrum-renderers

  Permission is hereby granted, free of charge, to any person obtaining a copy
  of this software and associated documentation files (the "Software"), to deal
  in the Software without restriction, including without limitation the rights
  to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
  copies of the Software, and to permit persons to whom the Software is
  furnished to do so, subject to the following conditions:

  The above copyright notice and this permission notice shall be included in
  all copies or substantial portions of the Software.

  THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
  IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
  FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
  AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
  LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
  OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN
  THE SOFTWARE.
*/
import React from 'react';
import { ArrayControlProps, OwnPropsOfControl, createDefaultValue } from '@jsonforms/core';
import { Flex, Heading, Text, View } from '@adobe/react-spectrum';
import SpectrumArrayModalItem from './ModalItemComponent';
import { DragAndDrop } from '../ArrayUtils';
import AddDialog from './AddDialog';
import { withHandleChange, HandleChangeProps } from '../../util';
import { indexOfFittingSchemaObject, AddItemButton } from '../ArrayUtils';

const SpectrumArrayModalControl = React.memo(
  ({
    addItem,
    data,
    enabled,
    handleChange,
    label,
    moveDown,
    moveUp,
    path,
    removeItems,
    renderers,
    schema,
    uischema,
    uischemas,
  }: ArrayControlProps & OwnPropsOfControl & HandleChangeProps) => {
    const [selectedIndex, setSelectedIndex] = React.useState(0);
    const [open, setOpen] = React.useState(false);
    const [moveUpIndex, setMoveUpIndex]: any = React.useState(null);
    const [openedIndex, setOpenedIndex] = React.useState<number | undefined>(undefined);
    const handleClose = () => setOpen(false);

    const [indexOfFittingSchemaArray, setIndexOfFittingSchemaArray] = React.useState(
      data?.map((boundData: any) => (boundData ? undefined : 999)) ?? []
    );

    React.useEffect(() => {
      setIndexOfFittingSchemaArray(
        data?.map((boundData: any) => (boundData ? undefined : 999)) ?? []
      );
    }, []);

    const handleRemoveItem = React.useCallback(
      (path: string, value: any) => () => {
        if (removeItems) {
          removeItems(path, [value])();
        }
        indexOfFittingSchemaArray.splice(value, 1);
      },
      [removeItems]
    );

    const handleOnConfirm = (handleClose: any, indexOfFittingSchema: number) => {
      setIndexOfFittingSchemaArray([
        ...indexOfFittingSchemaArray,
        Math.floor(indexOfFittingSchema),
      ]);
      if (schema.oneOf) {
        addItem(path, createDefaultValue(schema.oneOf[indexOfFittingSchema]))();
      }
      indexOfFittingSchemaObject[path + `.${data?.length}`] = selectedIndex;
      setSelectedIndex(0);
      handleClose();
    };

    const duplicateContent = (indexToDuplicate: number) => {
      handleChange(path, [
        ...(data as any[]).filter((_, index) => index < indexToDuplicate),
        data[indexToDuplicate],
        data[indexToDuplicate],
        ...(data as any[]).filter((_, index) => index > indexToDuplicate),
      ]);
    };

    const callbackOpenedIndex = (index: number | undefined) => {
      setOpenedIndex(index);
    };

    const onPressHandler = React.useCallback(() => {
      if (uischema?.options?.picker) {
        window.postMessage({
          type: 'customPicker:open',
          open: true,
          schema,
          current: {
            path,
          },
        });
      } else if (schema?.oneOf?.length === 1) {
        addItem(path, createDefaultValue(schema.oneOf[0]))();
      } else {
        setOpen(true);
      }
    }, [open]);

    const handleCustomPickerMessage = (e: MessageEvent) => {
      if (e?.data?.type === 'customPicker:return' && e?.data?.path === path && e?.data?.data) {
        let newData = data ? [...data] : [];
        if (e?.data?.index && typeof e.data.index === 'number') {
          newData[e.data.index] = e.data.data;
        } else {
          newData.push(e.data.data);
        }
        handleChange(path, newData);
      }
    };

    React.useEffect(() => {
      if (uischema?.options?.picker) {
        window.addEventListener('message', handleCustomPickerMessage);
        return () => {
          window.removeEventListener('message', handleCustomPickerMessage);
        };
      }
    }, [data]);

    const sortMode: string | boolean = uischema?.options?.sortMode ?? 'DragAndDrop';

    const ArrayItem = (index: number) => (
      <SpectrumArrayModalItem
        callbackOpenedIndex={callbackOpenedIndex}
        duplicateItem={duplicateContent}
        enabled={enabled}
        index={index}
        path={path}
        removeItem={handleRemoveItem}
        renderers={renderers}
        schema={schema}
        uischema={uischema}
        uischemas={uischemas}
      ></SpectrumArrayModalItem>
    );

    return (
      <View id='json-form-array-wrapper'>
        <Flex direction='row' justifyContent='space-between'>
          <Heading level={4}>{label}</Heading>
          <AddDialog
            uischema={uischema}
            handleClose={handleClose}
            selectedIndex={selectedIndex}
            schema={schema}
            setSelectedIndex={setSelectedIndex}
            handleOnConfirm={handleOnConfirm}
            open={open}
          />
        </Flex>
        <Flex id={`spectrum-renderer-arrayContentWrapper_${path}`} direction='column'>
          {data?.length ? (
            <>
              {sortMode ? (
                <DragAndDrop
                  callbackOpenedIndex={callbackOpenedIndex}
                  data={data}
                  enabled={enabled}
                  handleChange={handleChange}
                  handleRemoveItem={handleRemoveItem}
                  indexOfFittingSchemaArray={indexOfFittingSchemaArray}
                  moveDown={moveDown}
                  moveUp={moveUp}
                  moveUpIndex={moveUpIndex}
                  onPressHandler={onPressHandler}
                  openedIndex={openedIndex}
                  path={path}
                  removeItems={removeItems}
                  renderers={renderers}
                  schema={schema}
                  setMoveUpIndex={setMoveUpIndex}
                  uischema={uischema}
                  uischemas={uischemas}
                />
              ) : (
                (data as any[]).map((_, index) => {
                  indexOfFittingSchemaObject[`${path}itemQuantity`] = data?.length;
                  return (
                    <Flex
                      key={index}
                      direction='row'
                      alignItems='stretch'
                      flex='auto inherit'
                      marginBottom={'size-100'}
                    >
                      {ArrayItem(index)}
                    </Flex>
                  );
                })
              )}
            </>
          ) : (
            <Text>No data</Text>
          )}
          <AddItemButton onPressFunction={() => onPressHandler()} />
        </Flex>
      </View>
    );
  }
);

export default withHandleChange(SpectrumArrayModalControl);

import React from 'react';
import {
  ActionButton,
  ActionMenu,
  Flex,
  Heading,
  Item,
  Text,
  Tooltip,
  TooltipTrigger,
  View,
} from '@adobe/react-spectrum';

import Delete from '@spectrum-icons/workflow/Delete';
import Edit from '@spectrum-icons/workflow/Edit';
import Close from '@spectrum-icons/workflow/Close';
import { settings } from '../../../util';
import ModalItemDelete from './DeleteDialog';
import FolderSearch from '@spectrum-icons/workflow/FolderSearch';
import { findValue } from '../../../util';

interface ArrayModalItemHeaderProps {
  childData: any;
  childLabel: string;
  customPicker: { enabled: boolean; handler: (current?: object) => void };
  data: any;
  expanded: boolean;
  handleExpand: () => void;
  index: number;
  keyNumber?: number;
  layout: any;
  path: string;
  removeItem?: (path: string, value: number) => () => void;
  uischema?: any;
}

export default function ModalItemHeader({
  childLabel,
  customPicker,
  data,
  expanded,
  handleExpand,
  index,
  layout,
  path,
  removeItem,
  uischema,
}: ArrayModalItemHeaderProps) {
  const noData = data === undefined || Object.keys(data).length === 0 || !data?.['_path'];
  const [deleteModalOpen, setDeleteModalOpen] = React.useState(false);
  const actionMenuTriggered = (action: any) => {
    const testArr = action.split('-');
    testArr[0] = testArr[0].toLowerCase();
    const actionName: any = testArr.join('');

    const lookupObj: any = {
      delete: () => setDeleteModalOpen(true),
    };

    lookupObj[actionName]();
  };

  childLabel =
    uischema.options?.label ||
    findValue(data, uischema.options?.dataAsLabel) ||
    layout?.label ||
    childLabel ||
    `Media ${index + 1}`;

  const mediaType =
    uischema.options?.mediaType || findValue(data, uischema.options?.dataAsMediaType) || undefined;

  const imageSrc =
    typeof uischema.options?.dataAsImage === 'number'
      ? Object.values(data)[uischema.options?.dataAsImage]
      : findValue(data, uischema.options?.dataAsImage) ?? undefined;

  return (
    <View aria-selected={expanded} UNSAFE_className='array-item-header'>
      <Flex direction='row' margin='size-50' justifyContent='space-between' alignItems='center'>
        <TooltipTrigger delay={settings.toolTipDelay} placement={'top'}>
          <ActionButton
            flex={'1 1 auto'}
            isQuiet
            onPress={() => handleExpand()}
            aria-label={`expand-item-${childLabel}`}
            isDisabled={noData}
          >
            {imageSrc && (
              <img
                src={imageSrc}
                height='50'
                width='50'
                alt='Preview Picture'
                style={{ objectFit: 'cover', marginRight: '10px', marginLeft: '2px' }}
              />
            )}
            <Text UNSAFE_className='spectrum-array-item-name' UNSAFE_style={{ textAlign: 'left' }}>
              <Heading level={4} UNSAFE_style={{ margin: 0 }}>
                {childLabel}
              </Heading>
              <Text
                UNSAFE_className='spectrum-array-item-name'
                UNSAFE_style={{ textAlign: 'left' }}
              >
                {mediaType}
              </Text>
            </Text>
          </ActionButton>
          <Tooltip>{data?._path || imageSrc || childLabel}</Tooltip>
        </TooltipTrigger>
        <View>
          <Flex gap={'size-0'}>
            <ActionMenu align='end' onAction={actionMenuTriggered} isQuiet={true}>
              <Item key='delete' textValue={`delete-item-${childLabel}`}>
                <Text>Delete</Text>
                <Delete size='S' />
              </Item>
            </ActionMenu>

            <TooltipTrigger delay={settings.toolTipDelay}>
              <ActionButton
                onPress={customPicker.handler}
                isQuiet={true}
                aria-label={`change-reference-${childLabel}`}
              >
                <FolderSearch aria-label='Change Reference' size='S' />
              </ActionButton>
              <Tooltip>Change Content Fragment Reference</Tooltip>
            </TooltipTrigger>
            {!noData && (
              <TooltipTrigger delay={settings.toolTipDelay}>
                <ActionButton
                  onPress={() => handleExpand()}
                  isQuiet={true}
                  aria-label={`expand-item-${childLabel}`}
                >
                  {expanded ? (
                    <Close aria-label='Close' size='S' />
                  ) : (
                    <Edit aria-label='Edit' size='S' />
                  )}
                </ActionButton>
                <Tooltip>{expanded ? 'Close' : 'Edit'}</Tooltip>
              </TooltipTrigger>
            )}
            <ModalItemDelete
              deleteModalOpen={deleteModalOpen}
              expanded={expanded}
              handleExpand={handleExpand}
              index={index}
              path={path}
              removeItem={removeItem}
              setDeleteModalOpen={setDeleteModalOpen}
            />
          </Flex>
        </View>
      </Flex>
    </View>
  );
}

import React from 'react';
import {
  ActionButton,
  ActionMenu,
  Flex,
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

interface ArrayModalItemHeaderProps {
  data: any;
  expanded: boolean;
  index: number;
  path: string;
  handleExpand: () => void;
  removeItem?: (path: string, value: number) => () => void;
  childLabel: string;
  childData: any;
  customPicker: {
    enabled: boolean;
    handler: (current?: object) => void;
  };
  layout: any;
  uischema: any;
}

export default function ModalItemHeader({
  data,
  expanded,
  index,
  path,
  handleExpand,
  removeItem,
  childLabel,
  customPicker,
  layout,
  uischema,
}: ArrayModalItemHeaderProps) {
  const noData = !data?.['_path'];
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

  const pathFilter = uischema?.options?.pathFilter;

  let displayPath = '';
  if (typeof pathFilter === 'string') {
    displayPath = data?._path?.replace(pathFilter, '') || '';
  } else {
    displayPath = data?._path?.split('/').slice(3).join('/') || '';
    if (displayPath) {
      displayPath = `/${displayPath}`;
    }
  }

  childLabel = childLabel || layout?.label;

  const showItemNumber = uischema?.options?.showItemNumber ?? false;

  return (
    <View
      aria-selected={expanded}
      UNSAFE_className='array-item-header'
      UNSAFE_style={expanded ? { zIndex: 50 } : {}}
    >
      <Flex direction='row' margin='size-50' justifyContent='space-between' alignItems='center'>
        {showItemNumber && (
          <View UNSAFE_className='spectrum-array-item-number'>
            <Text>{index + 1}</Text>
          </View>
        )}
        <ActionButton
          flex={'1 1 auto'}
          isQuiet
          onPress={() => handleExpand()}
          aria-label={`expand-item-${childLabel}`}
          isDisabled={noData}
        >
          {data?._path && displayPath ? (
            <Text
              UNSAFE_style={{
                position: 'absolute',
                direction: 'rtl',
                opacity: 0.7,
                bottom: -5,
                left: 0,
                fontSize: '12px',
                height: 18,
                maxWidth: 'calc(100% - 12px)',
                textOverflow: 'ellipsis',
                overflow: 'hidden',
                whiteSpace: 'nowrap',
                textAlign: 'left',
                alignSelf: 'start',
                justifyContent: 'start',
              }}
            >
              {/* The "&lrm;" fixes an issue caused by the direction: 'rtl' property */}
              &lrm;{displayPath}
            </Text>
          ) : null}
          <Text
            UNSAFE_className='spectrum-array-item-name'
            UNSAFE_style={{
              paddingLeft: 0,
              textAlign: 'left',
              width: '100%',
              transform: data?._path && displayPath ? 'translateY(-20%)' : '',
              fontWeight: 600,
            }}
          >
            {childLabel}
          </Text>
        </ActionButton>
        <View>
          {noData ? (
            <Flex gap={'size-0'}>
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
            </Flex>
          ) : (
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
              <ModalItemDelete
                deleteModalOpen={deleteModalOpen}
                setDeleteModalOpen={setDeleteModalOpen}
                removeItem={removeItem}
                path={path}
                index={index}
                expanded={expanded}
                handleExpand={handleExpand}
              />
            </Flex>
          )}
        </View>
      </Flex>
    </View>
  );
}

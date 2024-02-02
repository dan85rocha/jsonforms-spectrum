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
  Divider,
} from '@adobe/react-spectrum';

import Delete from '@spectrum-icons/workflow/Delete';
import Edit from '@spectrum-icons/workflow/Edit';
import Close from '@spectrum-icons/workflow/Close';
import ChevronUp from '@spectrum-icons/workflow/ChevronUp';
import ChevronDown from '@spectrum-icons/workflow/ChevronDown';
import Duplicate from '@spectrum-icons/workflow/Duplicate';
import { settings } from '../../util';
import { DeleteArrayItem } from '.';
import FolderSearch from '@spectrum-icons/workflow/FolderSearch';

interface SpectrumItemHeaderProps {
  DNDHandle?: any;
  JsonFormsDispatch: any;
  childData: any;
  childLabel: string;
  customPicker?: { enabled: boolean; handler: (current?: object) => void };
  duplicateItem: (index: number) => () => void;
  enableDetailedView: boolean;
  expanded: boolean;
  handleExpand: () => void;
  index: number;
  path: string;
  removeItem: (path: string, value: number) => () => void;
  uischema: any;
}

export const SpectrumItemHeader = ({
  DNDHandle = false,
  JsonFormsDispatch,
  childData,
  childLabel,
  customPicker,
  duplicateItem,
  enableDetailedView,
  expanded,
  handleExpand,
  index,
  path,
  removeItem,
  uischema,
}: SpectrumItemHeaderProps) => {
  const [deleteModalOpen, setDeleteModalOpen] = React.useState(false);
  const actionMenuTriggered = (action: any) => {
    const testArr = action.split('-');
    testArr[0] = testArr[0].toLowerCase();
    const actionName: any = testArr.join('');

    const lookupObj: any = {
      delete: () => setDeleteModalOpen(true),
      duplicate: () => duplicateItem(index),
    };

    lookupObj[actionName]();
  };

  const showItemNumber = uischema?.options?.showItemNumber ?? false;
  const pathFilter = uischema?.options?.pathFilter;

  let displayPath = '';
  if (typeof pathFilter === 'string') {
    displayPath = childData?._path?.replace(pathFilter, '') || '';
  } else {
    displayPath = childData?._path?.split('/').slice(3).join('/') || '';
    if (displayPath) {
      displayPath = `/${displayPath}`;
    }
  }

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
        {uischema?.options?.noAccordion ? (
          <View UNSAFE_className='JsonFormsDispatchContainer'>{JsonFormsDispatch}</View>
        ) : (
          <ActionButton
            flex={'1 1 auto'}
            isQuiet
            onPress={() => handleExpand()}
            aria-label={`expand-item-${childLabel}`}
          >
            {childData?._path && displayPath ? (
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
                transform: childData?._path && displayPath ? 'translateY(-20%)' : '',
                fontWeight: 600,
              }}
            >
              {childLabel}
            </Text>
          </ActionButton>
        )}
        <View>
          <Flex gap={'size-0'}>
            <ActionMenu align='end' onAction={actionMenuTriggered} isQuiet={true}>
              <Item key='delete' textValue={`delete-item-${childLabel}`}>
                <Text>Delete</Text>
                <Delete size='S' />
              </Item>

              <Item key='duplicate' textValue={`duplicate-item-${childLabel}`}>
                <Text>Duplicate</Text>
                <Duplicate size='S' />
              </Item>
            </ActionMenu>

            {customPicker?.enabled && (
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
            )}

            {uischema?.options?.noAccordion ? null : (
              <TooltipTrigger delay={settings.toolTipDelay}>
                <ActionButton
                  onPress={() => handleExpand()}
                  isQuiet={true}
                  aria-label={`expand-item-${childLabel}`}
                >
                  {expanded ? (
                    enableDetailedView ? (
                      <Close aria-label='Close' size='S' />
                    ) : (
                      <ChevronUp aria-label='Collapse' size='S' />
                    )
                  ) : enableDetailedView ? (
                    <Edit aria-label='Edit' size='S' />
                  ) : (
                    <ChevronDown aria-label='Expand' size='S' />
                  )}
                </ActionButton>
                <Tooltip>
                  {expanded
                    ? enableDetailedView
                      ? 'Close'
                      : 'Collapse'
                    : enableDetailedView
                    ? 'Edit'
                    : 'Expand'}
                </Tooltip>
              </TooltipTrigger>
            )}
            {DNDHandle && (!enableDetailedView || (enableDetailedView && !expanded)) && (
              <>
                <Divider orientation='vertical' size='M' marginStart={'size-100'} />
                {DNDHandle}
              </>
            )}
            <DeleteArrayItem
              deleteModalOpen={deleteModalOpen}
              setDeleteModalOpen={setDeleteModalOpen}
              removeItem={removeItem}
              path={path}
              index={index}
              expanded={expanded}
              handleExpand={handleExpand}
            />
          </Flex>
        </View>
      </Flex>
    </View>
  );
};

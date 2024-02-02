import ArrowDown from '@spectrum-icons/workflow/ArrowDown';
import ArrowUp from '@spectrum-icons/workflow/ArrowUp';
import DragHandle from '@spectrum-icons/workflow/DragHandle';
import { SortButtons } from './index';

interface SortIconsProps {
  DragHandleRef: any;
  data: any;
  disabled: boolean;
  grabbedIndex: number | null;
  index: number;
  keyboardClass: string;
  moveDown: any;
  moveUp: any;
  onBlur: any;
  onFocus: any;
  onKeyDown: any;
  onMouseEnter: any;
  onMouseLeave: any;
  onTouchMove: any;
  path: any;
  removeItems: any;
  uischema: any;
  upOrDown: string;
  userIsOnMobileDevice: boolean;
}

export const SortIcons = ({
  DragHandleRef,
  data,
  disabled,
  grabbedIndex,
  index,
  keyboardClass,
  moveDown,
  moveUp,
  onBlur,
  onFocus,
  onKeyDown,
  onMouseEnter,
  onMouseLeave,
  onTouchMove,
  path,
  removeItems,
  uischema,
  upOrDown,
  userIsOnMobileDevice,
}: SortIconsProps) => {
  const sortMode: string | boolean = uischema?.options?.sortMode ?? 'DragAndDrop';
  const isKeyboardUser = !!Array.from(document.getElementsByClassName('keyboard-user')).length;
  return sortMode === 'arrows' ? (
    <div
      className={`arrowContainer grabbable ${sortMode === 'arrows' ? '' : 'grabcursor'} ${
        disabled ? 'disabledMovement' : ''
      }`}
      onBlur={onBlur}
      onFocus={onFocus}
      onKeyDown={onKeyDown}
      onMouseEnter={onMouseEnter}
      onMouseLeave={onMouseLeave}
      onTouchMove={onTouchMove}
      ref={DragHandleRef}
    >
      <SortButtons
        autoFocus={isKeyboardUser && grabbedIndex === index}
        data={data}
        disabled={disabled}
        index={index}
        moveDown={moveDown}
        moveUp={moveUp}
        path={path}
        removeItems={removeItems}
        uischema={uischema}
        upOrDown={upOrDown}
        userIsOnMobileDevice={userIsOnMobileDevice}
      />
    </div>
  ) : (
    <button
      disabled={disabled}
      ref={DragHandleRef}
      autoFocus={isKeyboardUser && grabbedIndex === index}
      className={`grabbable ${disabled ? 'disabledMovement' : ''}`}
      onFocus={onFocus}
      onBlur={onBlur}
      onMouseEnter={onMouseEnter}
      onMouseLeave={onMouseLeave}
      onTouchMove={onTouchMove}
      onKeyDown={onKeyDown}
    >
      <ArrowUp
        aria-label='Arrow Up'
        size='S'
        alignSelf='center'
        width={'100%'}
        UNSAFE_className={
          keyboardClass === 'keyboardUp' && index === grabbedIndex
            ? 'keyboardMovement'
            : 'keyboardUser'
        }
      />
      <ArrowDown
        aria-label='Arrow Down'
        size='S'
        alignSelf='center'
        width={'100%'}
        UNSAFE_className={
          keyboardClass === 'keyboardDown' && index === grabbedIndex
            ? 'keyboardMovement'
            : 'keyboardUser'
        }
      />
      <DragHandle
        aria-label='Drag and Drop Handle'
        size='L'
        alignSelf='center'
        width={'100%'}
        UNSAFE_className={'mouseDragHandle'}
      />
    </button>
  );
};

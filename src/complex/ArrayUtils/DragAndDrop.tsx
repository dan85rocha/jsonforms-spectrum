import React from 'react';
import { Button, Flex } from '@adobe/react-spectrum';
import SpectrumArrayModalItem from '../ArrayModal/ModalItemComponent';
import { swap, clamp } from './utils';
import { useSprings, useSpringRef, animated } from '@react-spring/web';
import { useDrag } from '@use-gesture/react';
import Add from '@spectrum-icons/workflow/Add';
import { checkIfUserIsOnMobileDevice } from '../../util';
import { SortIcons } from './index';
interface ArrayModalControlDragAndDropProps {
  callbackOpenedIndex: any;
  data: any;
  enabled: boolean;
  handleChange: any;
  handleRemoveItem: any;
  indexOfFittingSchemaArray: any[];
  moveDown: any;
  moveUp: any;
  moveUpIndex: number | null;
  onPressHandler: any;
  openedIndex: number | undefined;
  path: string;
  removeItems: any;
  renderers: any;
  schema: any;
  setMoveUpIndex: any;
  uischema: any;
  uischemas: any;
}

export const DragAndDrop = ({
  callbackOpenedIndex,
  data,
  enabled,
  handleChange,
  handleRemoveItem,
  indexOfFittingSchemaArray,
  moveUpIndex,
  onPressHandler,
  openedIndex,
  path,
  removeItems,
  renderers,
  schema,
  setMoveUpIndex,
  uischema,
  uischemas,
}: ArrayModalControlDragAndDropProps) => {
  if (!data) {
    return null;
  }
  const sortModeDnD: boolean = uischema?.options?.sortMode !== 'arrows' ? true : false;
  const [upOrDown, setUpOrDown] = React.useState<'up' | 'down'>('up');
  const [rerender, setRerender] = React.useState<number>(0);
  const [isMoving, setIsMoving] = React.useState<boolean>(false);
  const [delayHandler, setDelayHandler] = React.useState<any>(null);
  const [grabbedIndex, setGrabbedIndex] = React.useState<number | null>(null);
  const [hoveredIndex, setHoveredIndex] = React.useState<number | null>(null);
  const [touchMovement, setTouchMovement] = React.useState<boolean>(false);
  const [openedIndexArray, setOpenedIndexArray] = React.useState<number[]>([]);
  const order: any = React.useRef<number[]>(data?.map((_: any, index: any) => index));
  const COMPONENT_HEIGHT: number = 70;
  const fn =
    (order: number[], active: boolean = false) =>
    (index: number) =>
      active
        ? {
            y: order.indexOf(index) * COMPONENT_HEIGHT,
            immediate: false,
            keys: false,
          }
        : {
            y: order.indexOf(index) * COMPONENT_HEIGHT,
            immediate: true,
            keys: false,
          };
  const [springs, setSprings] = useSprings(data?.length ?? 0, fn(order.current));
  const DragHandleRef: any = useSpringRef();

  const bind: any = useDrag(
    ({ args: [originalIndex], active, movement: [, y] }) => {
      if (originalIndex !== null && grabbedIndex !== null) {
        if (touchMovement) {
          setTouchMovement(false);
          setGrabbedIndex(null);
        }
        const curRow = clamp(
          Math.round((originalIndex * COMPONENT_HEIGHT + y) / COMPONENT_HEIGHT),
          0,
          data?.length - 1
        );
        const newOrder = swap(
          order.current,
          order.current.indexOf(order.current[originalIndex]),
          order.current.indexOf(order.current[curRow])
        );
        setSprings.start(fn(newOrder, active)); // Feed springs new style data, they'll animate the view without causing a single render

        if (
          order.current.indexOf(order.current[originalIndex]) ===
            order.current.indexOf(order.current[curRow]) ||
          order.current === newOrder
        ) {
          return;
        }

        if (!active) {
          finalChange(newOrder);
        }
      }
    },
    {
      pointer: { keys: false },
    }
  );

  const finalChange = (newOrder: any) => {
    order.current = newOrder;
    handleChange(
      path,
      data.map((_: any, index: number) => data[newOrder[index]])
    );
    setGrabbedIndex(null);
    setSprings.start(fn(newOrder, false));
    setIsMoving(false);
    setRerender((x: number) => x + 1);
  };

  let [keyboardClass, setKeyboardClass] = React.useState('');

  const move = (pressedKey: string, index: number) => {
    setIsMoving(true);
    let newOrder: any = false;
    let newGrabbedIndex: number | null = null;
    if (pressedKey === 'ArrowUp' && index > 0) {
      setKeyboardClass('keyboardUp');
      newGrabbedIndex = index - 1;
      newOrder = swap(
        order.current,
        order.current.indexOf(order.current[index]),
        order.current.indexOf(order.current[index - 1])
      );
      setSprings.start(fn(newOrder, true));
      setTimeout(() => {
        setGrabbedIndex(index - 1);
        finalChange(newOrder);
        setKeyboardClass('');
        setGrabbedIndex(index - 1);
      }, 500);
      setUpOrDown('up');
    } else if (pressedKey === 'ArrowDown' && index < data?.length - 1) {
      setKeyboardClass('keyboardDown');
      newGrabbedIndex = index + 1;
      newOrder = swap(
        order.current,
        order.current.indexOf(order.current[index]),
        order.current.indexOf(order.current[index + 1])
      );
      setSprings.start(fn(newOrder, true));
      setTimeout(() => {
        setGrabbedIndex(index + 1);
        finalChange(newOrder);
        setKeyboardClass('');
      }, 500);
      setUpOrDown('down');
    }
    setTimeout(() => {
      setGrabbedIndex(newGrabbedIndex);
    }, 500);
  };

  const duplicateContent = (index: number) => {
    const newData = [...data, data[index]];
    order.current = newData.map((_: any, index: any) => index);
    handleChange(path, newData);
    setSprings.start(fn(newData, false));
  };

  React.useEffect(() => {
    if (openedIndex === undefined) {
      order.current = data?.map((_: any, index: any) => index);
      setSprings.start(fn(order.current, false));
    } else {
      const index = openedIndexArray.indexOf(openedIndex);
      if (index === -1) {
        setOpenedIndexArray([...openedIndexArray, openedIndex]);
      } else {
        const newArray = [...openedIndexArray];
        newArray.splice(index, 1);
        setOpenedIndexArray(newArray);
        if (openedIndexArray.length === 0) {
          order.current = data?.map((_: any, index: any) => index);
          setSprings.start(fn(order.current, false));
        }
      }
    }
  }, [openedIndex]);

  React.useEffect(() => {
    order.current = data?.map((_: any, index: any) => index);
    setGrabbedIndex(null);
    setSprings.start(fn(order.current, false));
  }, [data]);

  const enableTouch = (index: number) => {
    if (!sortModeDnD) return;
    setGrabbedIndex(index);
    setTouchMovement(true);
  };

  const showAddBetween = (index: number) => {
    setDelayHandler(
      setTimeout(() => {
        setHoveredIndex(index);
      }, 500)
    );
  };

  const hideAddBetween = () => {
    clearTimeout(delayHandler);
    setHoveredIndex(null);
  };

  const addBetween = (index: number, event: any) => {
    setMoveUpIndex(index);
    onPressHandler();
    event?.target?.blur();
  };

  React.useEffect(() => {
    if (moveUpIndex !== null) {
      const newOrder = swap(
        order.current,
        order.current.indexOf(order.current[data.length - 1]),
        order.current.indexOf(order.current[moveUpIndex])
      );
      finalChange(newOrder);
      setMoveUpIndex(null);
    } else {
      order.current = data?.map((_: any, index: any) => index);
      setSprings.start(fn(order.current, false));
      finalChange(order.current);
      setMoveUpIndex(null);
    }
  }, [data.length]);

  const userIsOnMobileDevice: boolean = checkIfUserIsOnMobileDevice(
    navigator.userAgent.toLowerCase()
  );

  const expanded = openedIndexArray.length || openedIndex !== undefined;

  const textAreaLabel = (textAreaObject: any) => {
    if (typeof uischema?.options?.detail !== 'object') {
      return null;
    }

    // create a temporary element to hold the HTML string
    const tempEl = document.createElement('div');
    tempEl.innerHTML = textAreaObject?.html;

    // get the first element and its first child text node
    const firstElement = tempEl.firstChild;
    const firstText = firstElement?.firstChild;

    // extract the text content
    return firstText?.textContent;
  };

  const modalItem = (index: number, disabled: boolean = false) => (
    <SpectrumArrayModalItem
      customLabel={textAreaLabel(data[index])}
      callbackOpenedIndex={callbackOpenedIndex}
      openIndex={openedIndex}
      duplicateItem={duplicateContent}
      enabled={enabled}
      index={index}
      indexOfFittingSchema={indexOfFittingSchemaArray}
      path={path}
      removeItem={handleRemoveItem}
      renderers={renderers}
      schema={schema}
      uischema={uischema}
      uischemas={uischemas}
      DNDHandle={
        <SortIcons
          DragHandleRef={DragHandleRef}
          data={data}
          disabled={disabled}
          grabbedIndex={grabbedIndex}
          index={index}
          keyboardClass={keyboardClass}
          moveDown={() => move('ArrowDown', index)}
          moveUp={() => move('ArrowUp', index)}
          onBlur={() => setGrabbedIndex(null)}
          onFocus={() => setGrabbedIndex(index)}
          onMouseEnter={() => setGrabbedIndex(index)}
          onMouseLeave={() => setGrabbedIndex(null)}
          onTouchMove={() => enableTouch(index)}
          path={path}
          removeItems={removeItems}
          uischema={uischema}
          upOrDown={upOrDown}
          userIsOnMobileDevice={userIsOnMobileDevice}
          onKeyDown={(e: any) => {
            if (e.key === 'ArrowUp' || e.key === 'ArrowDown') {
              move(e.key, index);
            }
          }}
        />
      }
    />
  );

  if (expanded && uischema.options.enableDetailedView === false) {
    return (
      <div
        style={{
          display: 'flex',
          flexDirection: 'column',
          minHeight: data?.length ? COMPONENT_HEIGHT * data?.length : 0,
          position: 'relative',
          touchAction: 'none',
          transformOrigin: '50% 50% 0px',
          gap: '8px',
          marginBottom: '8px',
        }}
      >
        {springs?.map(({}, index: number) => (
          <div key={`${path}+${index}`}>
            <div
              style={{
                display: userIsOnMobileDevice ? 'none' : 'flex',
                justifyContent: 'center',
                opacity: hoveredIndex === index ? 1 : 0,
                position: 'relative',
                marginTop: '-8px',
                height: '8px',
                alignItems: 'center',
                width: '100%',
                zIndex: 80,
              }}
              key={`${path}_${index}_addBetween`}
              onMouseEnter={() => showAddBetween(index)}
              onMouseLeave={() => hideAddBetween()}
              onFocus={() => setHoveredIndex(index)}
              onBlur={() => hideAddBetween()}
              className='add-container'
            >
              <Button variant='cta' onPress={(event: any) => addBetween(index, event)}>
                <Add />
              </Button>
            </div>
            {modalItem(index, true)}
          </div>
        ))}
      </div>
    );
  }

  return (
    <div
      style={{
        display: 'flex',
        flexDirection: 'column',
        height: data?.length ? COMPONENT_HEIGHT * data?.length : 0,
        position: 'relative',
        touchAction: 'none',
        transformOrigin: '50% 50% 0px',
      }}
    >
      {springs?.map(({ y }, index: number) => (
        <animated.div
          {...bind(index)}
          key={`${path}_${index}_${rerender}`}
          style={{
            position: 'absolute',
            touchAction: 'none',
            transformOrigin: '50% 50% 0px',
            width: '100%',
            y,
            zIndex: grabbedIndex === index ? 30 : 20,
          }}
          height={COMPONENT_HEIGHT + 'px'}
        >
          <div
            style={{
              display: userIsOnMobileDevice ? 'none' : 'flex',
              justifyContent: 'center',
              opacity: hoveredIndex === index ? 1 : 0,
              position: 'absolute',
              top: '-20px',
              width: '100%',
              zIndex: 80,
            }}
            key={`${path}_${index}_addBetween`}
            onMouseEnter={() => showAddBetween(index)}
            onMouseLeave={() => hideAddBetween()}
            onFocus={() => setHoveredIndex(index)}
            onBlur={() => hideAddBetween()}
            className='add-container'
          >
            <Button
              variant='cta'
              onPress={(event: any) => addBetween(index, event)}
              UNSAFE_style={{ zIndex: 81 }}
            >
              <Add />
            </Button>
          </div>
          <Flex
            direction='row'
            alignItems='stretch'
            flex='auto inherit'
            UNSAFE_style={{ zIndex: grabbedIndex === index ? 30 : 20 }}
          >
            {modalItem(index, isMoving)}
          </Flex>
        </animated.div>
      ))}
    </div>
  );
};

import React from 'react';
import {
  Dispatch,
  CoreActions,
  DispatchPropsOfArrayControl,
  update,
  ArrayControlProps,
  OwnPropsOfControl,
} from '@jsonforms/core';
import {
  ctxDispatchToControlProps,
  ctxToArrayControlProps,
  JsonFormsStateContext,
  withJsonFormsContext,
} from '@jsonforms/react';

const mapDispatchToArrayControlProps = (
  dispatch: Dispatch<CoreActions>
): DispatchPropsOfArrayControl => ({
  addItem: (path: string, value: any) => () => {
    dispatch(update(path, (array: any[]) => (array ? [...array, value] : [value])));
  },
  removeItems: (path: string, toDelete: number[]) => () => {
    dispatch(update(path, (array: any[]) => array.filter((_, index) => !toDelete.includes(index))));
  },
  moveUp: (path, toMove: number) => () => {
    dispatch(
      update(path, (array: any[]) =>
        toMove > 0 && toMove < array.length
          ? array.map(
              (_, index) =>
                array[
                  index > toMove || index < toMove - 1
                    ? index
                    : index === toMove
                    ? toMove - 1
                    : toMove
                ]
            )
          : array
      )
    );
  },
  moveDown: (path, toMove: number) => () => {
    dispatch(
      update(path, (array: any[]) =>
        toMove < array.length - 1
          ? array.map(
              (_, index) =>
                array[
                  index < toMove || index > toMove + 1
                    ? index
                    : index === toMove
                    ? toMove + 1
                    : toMove
                ]
            )
          : array
      )
    );
  },
});

const ctxDispatchToArrayControlProps = (dispatch: Dispatch<CoreActions>) => ({
  ...ctxDispatchToControlProps(dispatch as any),
  ...React.useMemo(() => mapDispatchToArrayControlProps(dispatch as any), [dispatch]),
});

const withContextToArrayControlProps =
  (Component: React.ComponentType<ArrayControlProps>) =>
  ({ ctx, props }: JsonFormsStateContext & ArrayControlProps) => {
    const stateProps = ctxToArrayControlProps(ctx, props);
    const dispatchProps = ctxDispatchToArrayControlProps(ctx.dispatch);

    return <Component {...props} {...stateProps} {...dispatchProps} />;
  };

export const withJsonFormsArrayControlProps = (
  Component: React.ComponentType<ArrayControlProps>,
  memoize = true
): React.ComponentType<OwnPropsOfControl> =>
  withJsonFormsContext(withContextToArrayControlProps(memoize ? React.memo(Component) : Component));

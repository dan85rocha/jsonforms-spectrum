import React from 'react';
import {
  Button,
  ButtonGroup,
  Content,
  Dialog,
  DialogContainer,
  Divider,
  Heading,
} from '@adobe/react-spectrum';

interface DeleteArrayItemProps {
  deleteModalOpen: boolean;
  expanded: boolean;
  handleExpand: () => void;
  index: number;
  path: string;
  removeItem: (path: string, value: number) => () => void;
  setDeleteModalOpen: (value: boolean) => void;
}

export const DeleteArrayItem = ({
  deleteModalOpen,
  expanded,
  handleExpand,
  index,
  path,
  removeItem,
  setDeleteModalOpen,
}: DeleteArrayItemProps) => {
  const [durationBeforeDelete, setDurationBeforeDelete] = React.useState(0);
  const onPressStartHandler = () => {
    if (expanded) {
      handleExpand();
      setDurationBeforeDelete(700);
    }
  };

  const onPressEndHandler = () => {
    setDeleteModalOpen(false);
    setTimeout(() => {
      removeItem(path, index)();
    }, durationBeforeDelete);
  };

  return (
    <DialogContainer onDismiss={() => setDeleteModalOpen(false)}>
      {deleteModalOpen && (
        <Dialog>
          <Heading>Delete Item?</Heading>
          <Divider />
          <Content>Are you sure you wish to delete this item?</Content>
          <ButtonGroup>
            <Button variant='secondary' onPress={() => setDeleteModalOpen(false)}>
              Cancel
            </Button>
            <Button
              autoFocus
              variant='cta'
              onPressStart={onPressStartHandler}
              onPressEnd={onPressEndHandler}
            >
              Delete
            </Button>
          </ButtonGroup>
        </Dialog>
      )}
    </DialogContainer>
  );
};

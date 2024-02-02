import { ActionButton, Tooltip, TooltipTrigger } from '@adobe/react-spectrum';
import { settings } from '../../util';
import Add from '@spectrum-icons/workflow/Add';

interface AddItemButtonProps {
  onPressFunction: () => void;
}
export const AddItemButton = ({ onPressFunction }: AddItemButtonProps) => {
  return (
    <TooltipTrigger delay={settings.toolTipDelay}>
      <ActionButton
        onPress={() => onPressFunction()}
        isQuiet={true}
        aria-label='add a new item'
        UNSAFE_className='add-item'
      >
        <Add aria-label='Add a new Item' size='L' />
      </ActionButton>
      <Tooltip>Add a new Item</Tooltip>
    </TooltipTrigger>
  );
};

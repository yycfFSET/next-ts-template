import * as DropdownMenuPrimitive from '@radix-ui/react-dropdown-menu';
import {
  DropdownMenu as DropDownMenuDefault,
  DropdownMenuContent,
  //   DropdownMenuGroup,
  //   DropdownMenuItem,
  //   DropdownMenuLabel,
  //   DropdownMenuShortcut,
  DropdownMenuTrigger
} from '@/components/ui/dropdown-menu';
// import { MoreHorizontal } from 'lucide-react';

interface DropDownMenuProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  content?: React.ReactNode;
}

export const DropDownMenu: React.FC<DropDownMenuProps & DropdownMenuPrimitive.DropdownMenuProps> = ({
  children,
  open,
  content,
  onOpenChange,
  ...restProps
}) => {
  return (
    <DropDownMenuDefault open={open} onOpenChange={onOpenChange} {...restProps}>
      <DropdownMenuTrigger className="focus:outline-none">{children}</DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-[200px]">
        {content}
      </DropdownMenuContent>
    </DropDownMenuDefault>
  );
};
import {FC, ReactNode} from 'react';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from './ui/tooltip';

interface Props {
    label: string;
    children: ReactNode;
    side?: 'left' | 'right'| 'top' | 'bottom';
    align?: 'start' | 'center' | 'end';
    sideOffset?: number;
    alignOffset?: number;
}

const Hint:FC<Props> = ({label,children,side,align,sideOffset,alignOffset}) => {
    return (
        <TooltipProvider>
            <Tooltip delayDuration={100}>
                <TooltipTrigger asChild>
                    {children}
                </TooltipTrigger>
                <TooltipContent className='z-[500000]'  side={side} align={align} sideOffset={sideOffset} alignOffset={alignOffset}>
                    <p className="font-semibold capitalize">
                        {label}
                    </p>
                </TooltipContent>
            </Tooltip>
        </TooltipProvider>
    );
};

export default Hint;
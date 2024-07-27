
import { Program } from '@/types';
import {create} from 'zustand';

type Props = {
    isOpen?:boolean;
    onOpen:(program:Program)=>void;
    onClose:()=>void;
    program?: Program
}

export const useChangeStepModal = create<Props>((set)=>({
    isOpen:false,
    onOpen:(program)=>set({isOpen:true,program}),
    onClose:()=>set({isOpen:false,program:undefined}),
}));
import { Program } from '@/types';
import {create} from 'zustand';

type Props = {
    isOpen?:boolean;
    onOpen:(project_id:number,data?:Program)=>void;
    onClose:()=>void;
    program?: Program;
    project_id?:number;
}

export const useProgramModal = create<Props>((set)=>({
    isOpen:false,
    onOpen:(project_id,program)=>set({isOpen:true,project_id,program}),
    onClose:()=>set({isOpen:false,program:undefined,project_id:undefined}),
}))
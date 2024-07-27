
import {create} from 'zustand';

type Props = {
    isOpen?:boolean;
    onOpen:(data:number)=>void;
    onClose:()=>void;
    id?: number
}

export const useArchiveProject = create<Props>((set)=>({
    isOpen:false,
    onOpen:(id)=>set({isOpen:true,id}),
    onClose:()=>set({isOpen:false,id:undefined}),
}));
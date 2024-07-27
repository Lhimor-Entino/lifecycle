import { Project } from '@/types';
import {create} from 'zustand';

type Props = {
    isOpen?:boolean;
    onOpen:(data?:Project)=>void;
    onClose:()=>void;
    project?: Project
}

export const useProjectModal = create<Props>((set)=>({
    isOpen:false,
    onOpen:(project)=>set({isOpen:true,project}),
    onClose:()=>set({isOpen:false,project:undefined}),
}))
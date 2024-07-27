import { ChangeManagementRequest } from '@/types';
import {create} from 'zustand';

type Props = {
    isOpen?:boolean;
    onEditOpen:(project_id:number,data?:ChangeManagementRequest)=>void;
    onClose:()=>void;
    // cr_request?: ChangeManagementRequest;
    cmr_id?:number;
}

export const useChangeManagementModal = create<Props>((set)=>({
    isOpen:false,
    onEditOpen:(cmr_id,cr_request)=>set({isOpen:true,cmr_id}),
    onClose:()=>set({isOpen:false,cmr_id:undefined}),
}))
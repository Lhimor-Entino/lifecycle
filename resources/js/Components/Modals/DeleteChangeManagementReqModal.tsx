import { FC, useState } from "react";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from "../ui/alert-dialog";
import { Button } from "../ui/button";
import { useArchiveProject } from "@/Hooks/useArchiveProject";
import { Inertia } from "@inertiajs/inertia";
import { toast } from "sonner";
import { Loader2 } from "lucide-react";
import { useDeleteChangeManagementReq } from "@/Hooks/useDeleteChangeManagementModal";

const DeleteChangeManagementReqModal:FC = () => {
    const {isOpen,id,onClose} = useDeleteChangeManagementReq();
    const [loading,setLoading] = useState(false);

    if(!id) return null;
    if(!isOpen) return null;

    const onConfirm = () => {
        Inertia.post(route('changeMngt.destroy',{id}),{},{
            onSuccess:()=>{
                toast.success('Change Management Request deleted.');
                onClose();
            },
            onError:()=>toast.error('Something Went Wrong. Please try again....'),
            onStart:()=>setLoading(true),
            onFinish:()=>setLoading(false)
        });
    }

    return (
        <AlertDialog open onOpenChange={onClose}>
            <AlertDialogContent>
                <AlertDialogHeader>
                <AlertDialogTitle>
                    Delete this Request? 
                </AlertDialogTitle>
                <AlertDialogDescription>
                    You can't revert this action.
                </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                    <AlertDialogCancel disabled={loading}>Cancel</AlertDialogCancel>
                    <Button onClick={onConfirm} disabled={loading}>
                        {loading&&<Loader2 className="h-5 w-5 mr-2 animate-spin" />}    
                        Proceed
                    </Button>
                </AlertDialogFooter>
            </AlertDialogContent>
        </AlertDialog>
    )
}
export default DeleteChangeManagementReqModal
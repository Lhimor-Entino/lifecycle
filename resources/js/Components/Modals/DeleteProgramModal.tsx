import { FC, useState } from "react";
import { AlertDialog, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from "../ui/alert-dialog";
import { Button } from "../ui/button";
import { useDeleteProgram } from "@/Hooks/useDeleteProgram";
import { Loader2 } from "lucide-react";
import { Inertia } from "@inertiajs/inertia";
import { toast } from "sonner";

const DeleteProgramModal:FC = () => {
    const {isOpen,id,onClose} = useDeleteProgram();
    const [loading,setLoading] = useState(false);

    

    if(!id) return null;
    if(!isOpen) return null;

    const onConfirm = () => {
        Inertia.post(route('programs.destroy',{id}),{},{
            onSuccess:()=>{
                toast.success('Program Deleted');
                onClose();
            },
            onError:()=>toast.error('Something Went Wrong. Please try again....'),
            onStart:()=>setLoading(true),
            onFinish:()=>setLoading(false)
        });
    }

    return (
        <AlertDialog open={isOpen} onOpenChange={onClose}>
            <AlertDialogContent>
                <AlertDialogHeader>
                    <AlertDialogTitle>
                        Delete This Program?
                    </AlertDialogTitle>
                    <AlertDialogDescription>
                        Warning! This action cannot be undone.
                    </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                    <AlertDialogCancel disabled={loading}>Cancel</AlertDialogCancel>
                    <Button onClick={onConfirm} disabled={loading}>
                        {loading&&<Loader2 className="h-5 w-5 mr-2 animate-spin" />}
                        Delete
                    </Button>
                </AlertDialogFooter>
            </AlertDialogContent>
        </AlertDialog>
    )
}
export default DeleteProgramModal
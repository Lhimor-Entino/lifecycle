import { useDeleteProject } from "@/Hooks/useDeleteProject";
import { Inertia } from "@inertiajs/inertia";
import { useState } from "react";
import { toast } from "sonner";
import { AlertDialog, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from "../ui/alert-dialog";
import { Button } from "../ui/button";
import { Loader2 } from "lucide-react";

const DeleteProjectModal = () => {
    const {isOpen,id,onClose} = useDeleteProject();
    const [loading,setLoading] = useState(false);

    if(!id) return null;
    if(!isOpen) return null;

    const onConfirm = () => {
        Inertia.post(route('projects.destroy',{id}),{},{
            onSuccess:()=>{
                toast.success('Project Permanently Deleted');
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
                        Permanently Delete This Project?
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
export default DeleteProjectModal
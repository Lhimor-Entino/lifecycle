import { FC, useState } from "react";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from "../ui/alert-dialog";
import { Button } from "../ui/button";
import { useArchiveProject } from "@/Hooks/useArchiveProject";
import { Inertia } from "@inertiajs/inertia";
import { toast } from "sonner";
import { Loader2 } from "lucide-react";

const ArchiveProjectModal:FC = () => {
    const {isOpen,id,onClose} = useArchiveProject();
    const [loading,setLoading] = useState(false);

    if(!id) return null;
    if(!isOpen) return null;

    const onConfirm = () => {
        Inertia.post(route('projects.archive',{id}),{},{
            onSuccess:()=>{
                toast.success('Project Archived');
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
                    Archive this Project?
                </AlertDialogTitle>
                <AlertDialogDescription>
                    You can still restore it later.
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
export default ArchiveProjectModal
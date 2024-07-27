import { useChangeStepModal } from "@/Hooks/useChangeStepModal"
import { PageProps } from "@/types";
import { Inertia, Page } from "@inertiajs/inertia";
import { usePage } from "@inertiajs/inertia-react";
import { Select, SelectContent, SelectGroup, SelectItem, SelectLabel, SelectTrigger, SelectValue } from "../ui/select";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader } from "../ui/dialog";
import { DialogTitle } from "@radix-ui/react-dialog";
import { Button } from "../ui/button";
import { useEffect, useState } from "react";
import { toast } from "sonner";
import { Loader2 } from "lucide-react";

const ChangeStepModal = () => {
    const {isOpen,program,onClose} = useChangeStepModal();
    const [step_id,setStepId] = useState('0');
    const {steps} = usePage<Page<PageProps>>().props;
    
    const [loading,setLoading] = useState(false);
    useEffect(()=>{
        if(!isOpen) return;
        setStepId(program?.step_id.toString()||'0');
    },[isOpen,program]);

    const onSubmit = () =>{
        if(!program) return;
        if(step_id==='0') return toast.info('Please select a step');
        Inertia.post(route('programs.next_step',{id:program.id}),{step_id},{
            onStart:()=>setLoading(true),
            onSuccess:()=>{
                onClose();
                toast.success('Done!');
            },
            onError:()=>toast.error('An error occurred. Please try again later.'),
            onFinish:()=>setLoading(false)
        })
    }

    return (
        <Dialog open={isOpen} onOpenChange={onClose}>
            <DialogContent >
                <DialogHeader>
                <DialogTitle>{program?.name}</DialogTitle>
                <DialogDescription>
                    Change next step for {program?.name}
                </DialogDescription>
                </DialogHeader>                
                <Select value={step_id} onValueChange={e=>setStepId(e)}>
                    <SelectTrigger className="w-full">
                        <SelectValue placeholder="Select a step" />
                    </SelectTrigger>
                    <SelectContent className="z-[500] max-h-[20rem]">
                        <SelectGroup>
                        <SelectLabel>Steps</SelectLabel>
                        {
                            steps.map(step=>(
                                <SelectItem key={step.id} value={step.id.toString()}>{step.name}</SelectItem>
                            ))
                        }
                        </SelectGroup>
                    </SelectContent>
                </Select>
                <DialogFooter>
                    <Button onClick={onSubmit} size='sm' type="submit" disabled={loading}>
                        {loading&&<Loader2 className='w-5 h-5 mr-2 animate-spin' />}
                        Save changes
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    )
}
export default ChangeStepModal
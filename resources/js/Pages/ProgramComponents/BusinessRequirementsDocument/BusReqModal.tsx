import { AlertDialog, AlertDialogContent, AlertDialogDescription, AlertDialogHeader, AlertDialogTitle } from '@/Components/ui/alert-dialog';
import { Button } from '@/Components/ui/button';
import { Input } from '@/Components/ui/input';
import { Label } from '@/Components/ui/label';
import { Program } from '@/types';
import { useForm } from '@inertiajs/inertia-react';
import { Loader2 } from 'lucide-react';
import {FC, FormEventHandler, useEffect} from 'react';
import { toast } from 'sonner';

interface Props {
    program:Program;
    isOpen:boolean;
    onClose:()=>void;
}

const BusReqModal:FC<Props> =  ({program,isOpen,onClose}) => {
    const {data,setData,processing,reset,post} = useForm({
        volume:'',
        turnaround:'',
        accuracy:'',
        output_format:'',
        program_id:'',
       
    });
    const onSubmit:FormEventHandler<HTMLFormElement> = e => {
        e.preventDefault();
        const href = program.project.business_requirement_document ? route('business_requirement.update',{id:program.project.business_requirement_document.id}) : route('business_requirement.store');
        post(href,{
            onSuccess:()=>onClose(),
            onError:e=>{
                console.error(e);
                toast.error('Failed to create Business Requirements Document. Try again');
            }
        });
    }

    useEffect(()=>{
        if(!isOpen) reset();
        if(isOpen) {
            setData(val=>({
                ...val,
                volume:program.business_requirement_document?.volume ?? '',
                turnaround:program.business_requirement_document?.turnaround ?? '',
                accuracy:program.business_requirement_document?.accuracy ?? '',
                output_format:program.business_requirement_document?.output_format ?? '',
                program_id:program.id.toString()
            }));
        }
    },[isOpen,program]);

    return (
        <AlertDialog open={isOpen} onOpenChange={()=>onClose()}>
            <AlertDialogContent>
                <AlertDialogHeader>
                    <AlertDialogTitle>
                        Business Requirements Document
                    </AlertDialogTitle>
                    <AlertDialogDescription>
                        {program.business_requirement_document?'Update':'Create'} Business Requirements Document .
                     
                        {program.change_requests.length > 0 ? 
                        <div className='flex flex-col mt-3'>
                            <p className='text-black  font-bold dark:text-white'><i>Reminder :</i></p>
                           <p className='mt-2 text-yellow-700 dark:text-yellow-300 '>Upon creating a change management request, all fields from the previous Business Requirements Document (BRD) will automatically be included when saved.</p>
                        </div>
                        : ""}
                    </AlertDialogDescription>
                </AlertDialogHeader>
                <form onSubmit={onSubmit} className='flex flex-col gap-y-3.5'>
                    <div className='space-y-1'>
                        <Label htmlFor='volume'>Volume</Label>
                        <Input disabled={processing} required autoComplete='off' autoFocus id='volume' name='volume' value={data.volume} onChange={(e)=>setData('volume',e.target.value)} placeholder='Volume' />
                    </div>
                    <div className='space-y-1'>
                        <Label htmlFor='turnaround'>Turnaround</Label>
                        <Input disabled={processing} required autoComplete='off' id='turnaround' name='turnaround' value={data.turnaround} onChange={(e)=>setData('turnaround',e.target.value)} placeholder='Turnaround' />
                    </div>
                    <div className='space-y-1'>
                        <Label htmlFor='accuracy'>Accuracy</Label>
                        <Input disabled={processing} required autoComplete='off' id='accuracy' name='accuracy' value={data.accuracy} onChange={(e)=>setData('accuracy',e.target.value)} placeholder='Accuracy' />
                    </div>
                    <div className='space-y-1'>
                        <Label htmlFor='output_format'>Output Format</Label>
                        <Input disabled={processing} required autoComplete='off' id='output_format' name='output_format' value={data.output_format} onChange={(e)=>setData('output_format',e.target.value)} placeholder='Output Format' />
                    </div>
                    <div className='flex items-center justify-end gap-x-2'>
                        
                        <Button onClick={onClose} type='button' disabled={processing} size='sm' variant='secondary'>
                            Cancel
                        </Button>
                        
                        <Button disabled={processing} size='sm' variant='outline'>
                            {processing && <Loader2 className='w-5 h-5 animate-spin' />}
                            {program.business_requirement_document?'Update':'Create'}
                        </Button>
                    </div>
                </form>
            </AlertDialogContent>
        </AlertDialog>
    );
};

export default BusReqModal;
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

const TeqReqModal:FC<Props> =  ({program,isOpen,onClose}) => {
    const {data,setData,processing,reset,post} = useForm({
        accuracy:'',
        output_format:'',
        program_id:''
    });
    const onSubmit:FormEventHandler<HTMLFormElement> = e => {
        e.preventDefault();
        const href = program.techinical_requirement_document ? route('tech_requirement.update',{id:program.techinical_requirement_document.id}) : route('tech_requirement.store');
        post(href,{
            onSuccess:()=>onClose(),
            onError:e=>{
                console.error(e);
                toast.error('Failed to create Technical Requirements Document. Try again');
            }
        });
    }

    useEffect(()=>{
        if(!isOpen) reset();
        if(isOpen) {
            setData(val=>({
                ...val,
                accuracy:program.techinical_requirement_document?.accuracy ?? '',
                output_format:program.techinical_requirement_document?.output_format ?? '',
                program_id:program.id.toString()
            }));
        }
    },[isOpen,program]);

    return (
        <AlertDialog open={isOpen} onOpenChange={()=>onClose()}>
            <AlertDialogContent>
                <AlertDialogHeader>
                    <AlertDialogTitle>
                        Technical Requirements Document
                    </AlertDialogTitle>
                    <AlertDialogDescription>
                        {program.techinical_requirement_document?'Update':'Create'} Technical Requirements Document for {program.name}
                    </AlertDialogDescription>
                </AlertDialogHeader>
                <form onSubmit={onSubmit} className='flex flex-col gap-y-3.5'>
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
                            {program.techinical_requirement_document?'Update':'Create'}
                        </Button>
                    </div>
                </form>
            </AlertDialogContent>
        </AlertDialog>
    );
};

export default TeqReqModal;
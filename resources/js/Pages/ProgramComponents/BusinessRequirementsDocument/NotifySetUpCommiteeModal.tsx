import { Button } from '@/Components/ui/button';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '@/Components/ui/dialog';
import { Input } from '@/Components/ui/input';
import { Label } from '@/Components/ui/label';
import { Separator } from '@/Components/ui/separator';
import { PageProps, Program } from '@/types';
import {FC, useEffect, useState} from 'react';
import { ToItem } from '../TechnicalRequirementsDocument/TRDNotificationModal';
import useEditorConfig from '@/Hooks/useEditorConfig';
import TipTap from '@/Components/TipTap';
import { cn, ddcImgUrl } from '@/lib/utils';
import { Ban, Loader2, Send } from 'lucide-react';
import { toast } from 'sonner';
import { Inertia, Page } from '@inertiajs/inertia';
import {  usePage } from '@inertiajs/inertia-react';

interface Props {
    program:Program;
    isOpen:boolean;
    onClose:()=>void;
}

const NotifySetUpCommiteeModal:FC<Props> = ({program,isOpen,onClose}) => {
    const [sJ,setSj]=useState("");
    const {software_testers,setup_committee,pc_head,software_manager} = usePage<Page<PageProps>>().props
    const [emailMsg,setEmailMsg] = useState("");
    const [sending,setSending] = useState(false);
    

       
    const {editor} = useEditorConfig();

    useEffect(()=>{        
        setEmailMsg(generateEmail(program));
        setSj(generateSubject(program));
    },[isOpen,program]);

    const onSubmit = () =>{
        if (!editor) return;

        if (editor.getHTML().length<25) return toast.info('Email Request Message is too short');
        if (!sJ||sJ.length<20) return toast.info('Subject Line is too short');
        const notif = toast.loading("Sending Email. Please do not close this page...");

      
        Inertia.post(route('programs.notify_setup_comitee'),{
            subject:sJ,
            body:editor.getHTML(),
            //@ts-ignore
            emails:program.program_testers,
            program_id:program.id,
            setup_committee : JSON.stringify(setup_committee.concat(pc_head)),
            software_manager: JSON.stringify(software_manager),
            program_testers: JSON.stringify(software_testers),

        },{
            onStart:()=>setSending(true),
            onError:()=> toast.error('An error occurred. Please try again later.',{id:notif}),
            onSuccess:()=>{
                toast.success('Email Sent Successfully',{id:notif});
                onClose();
            },
            onFinish:()=>setSending(false)
        });
    }


    return (
        <Dialog open={isOpen} onOpenChange={onClose}>
            <DialogContent className='max-w-[90vw] max-h-[95vh] h-full flex flex-col space-x-1.5'>
                
                <div className='w-full flex flex-col space-y-1.5'>
                    <p className='font-semibold text-lg'>Notify Setup Committtee that TRD is done and setup can be scheduled</p>
                    <Separator />
                    <div className='flex space-x-1.5 items-center justify-end'>
                        <Label htmlFor='subject' className=''>Subject:</Label>
                        <Input disabled={sending} id='subject' value={sJ} onChange={e=>setSj(e.target.value)}  className='flex-1' />
                    </div>
                    <div className='flex space-x-1.5 items-center justify-end'>
                        <Label htmlFor='to' className=''>To:</Label>
                        <div className='flex-1 flex items-center flex-wrap min-h-[2.75rem] p-2 rounded-md bg-background border border-muted gap-1.5'>
                            {
                                ([...program.project.project_coordinators,...setup_committee,...pc_head]).map(address=><ToItem key={address.id} to={address} onRemove={()=>{}} />)
                            }
                          
                              <ToItem key={software_manager.id} to={software_manager} onRemove={()=>{}} />
                      
                        </div>
                    </div>
                    <div className='flex space-x-1.5 items-center justify-end'>
                        <Label htmlFor='to' className=''>CC:</Label>
                        <div className='flex-1 flex items-center flex-wrap min-h-[2.75rem] p-2 rounded-md bg-background border border-muted gap-1.5'>
                            {
                                ([...program.program_programmers,...software_testers]).map(address=><ToItem key={address.id} to={address} onRemove={()=>{}} />)
                            }
                        </div>
                    </div>
                    <Separator />
                    
                    <div className={cn('w-full flex-1 flex flex-col max-h-fit overflow-y-auto',sending?'opacity-50':'opacity-100')}>
                        <TipTap editor={editor!} content={emailMsg} />
                    </div>
                    <div className='flex items-center justify-end space-x-1.5'>
                        <Button onClick={onClose} disabled={sending} variant='secondary' size='sm' className='text-base flex items-center space-x-1.5'>
                            <Ban className='w-4 h-4' />
                            <span>Cancel</span>
                        </Button>
                        <Button disabled={sending} onClick={onSubmit} variant='outline' size='sm' className='text-base flex items-center space-x-1.5'>
                            {!sending?<Send className='w-4 h-4' />:<Loader2 className='h-4 w-4 animate-spin' />}
                            <span>Send Notification</span>
                        </Button>
                    </div>
                </div>
            </DialogContent>
        </Dialog>
    );
};

export default NotifySetUpCommiteeModal;


const generateSubject = (program:Program):string =>{
    if(!program) return "";
    const title = `${program.project.name} - ${program.name}`
    return `Schedule SetUp - ${title}`
}



const generateEmail = (program:Program):string=>{
    if(!program) return "";

    return `
    <table>
        <tbody>
            <tr>
                <th rowspan="2" align='right'>
                    <img alt='DDC'  src='${ddcImgUrl}' />
                </th>
                <td>
                    <p>Information Security Management System</p>
                    <p>SOFTWARE DEVELOPMENT LIFECYCLE</p>
                </td>
                
            </tr>
        </tbody>
    </table>
    
    Hi Set Up Committee,
    <br>
    <br>
    TRD is Done. Please schedule Set Up.
    <br>
    <br>
    Project:&nbsp;<strong>${program.project.name} - ${program.name}</strong><br>
    
    Thanks.
    
    
    `;
}

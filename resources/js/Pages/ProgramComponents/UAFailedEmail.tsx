import { Dialog, DialogContent } from '@/Components/ui/dialog';
import { Input } from '@/Components/ui/input';
import { Label } from '@/Components/ui/label';
import { Separator } from '@/Components/ui/separator';
import useEditorConfig from '@/Hooks/useEditorConfig';
import { cn, ddcImgUrl } from '@/lib/utils';
import { PageProps, Program, UAResponsible, UserAcceptance } from '@/types';
import {FC, useEffect, useState} from 'react';
import { ToItem } from './TechnicalRequirementsDocument/TRDNotificationModal';
import TipTap from '@/Components/TipTap';
import { Button } from '@/Components/ui/button';
import { Ban, Loader2, Send, User } from 'lucide-react';
import { toast } from 'sonner';
import { Inertia,Page } from '@inertiajs/inertia';
import { usePage } from '@inertiajs/inertia-react';

interface Props {
    program:Program;
    ua:UserAcceptance;
    isOpen:boolean;
    onClose:()=>void;
}

const UAFailedEmail:FC<Props> = ({program,ua,isOpen,onClose}) => {
    const [sending,setSending] = useState(false);    
    const [emailMsg,setEmailMsg] = useState("");   
    const [sJ,setSj] = useState("");
    const {editor} = useEditorConfig();
    const {software_manager,setup_committee,pc_head,software_testers,auth} = usePage<Page<PageProps>>().props
    const onSubmit = () =>{
        if (!editor) return;

        if (editor.getHTML().length<25) return toast.info('Email Request Message is too short');
        if (!sJ||sJ.length<20) return toast.info('Subject Line is too short');
        const notif = toast.loading("Sending Email. Please do not close this page...");
        Inertia.post(route('user_acceptance.failed_test'),{
            subject:sJ,
            body:editor.getHTML(),
            //@ts-ignore
            emails:program.program_testers,
            program_id:program.id,
            setup_committee : JSON.stringify(setup_committee.concat(pc_head)),
            software_manager: JSON.stringify(software_manager),
            program_testers: JSON.stringify(software_testers),
            // cc_email: JSON.stringify(auth.user)
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

    useEffect(()=>{
        setEmailMsg(generateEmail(program,ua));
        setSj(generateSubject(program,ua));
    },[isOpen,ua]);
    return (
        <Dialog open={isOpen} onOpenChange={onClose}>
            <DialogContent className='max-w-[90vw] max-h-[95vh] h-full flex flex-col space-x-1.5'>
                <div className='w-full h-full flex flex-col space-y-1.5'>
                    <p className='font-semibold text-lg'>User Acceptance Failed Test Email</p>
                    <Separator />
                    <div className='flex space-x-1.5 items-center justify-end'>
                        <Label htmlFor='subject' className=''>Subject:</Label>
                        <Input disabled={sending} id='subject' value={sJ} onChange={e=>setSj(e.target.value)}  className='flex-1' />
                    </div>
                    <div className='flex space-x-1.5 items-center justify-end'>
                        <Label htmlFor='to' className=''>To:</Label>
                        <div className='flex-1 flex items-center flex-wrap min-h-[2.75rem] p-2 rounded-md bg-background border border-muted gap-1.5'>
                            {
                                ([...program.program_testers,...program.project.project_coordinators,...setup_committee,...[software_manager],...pc_head])
                                .map(address=><ToItem key={address.id} to={address} onRemove={()=>{}} />)
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

export default UAFailedEmail;



const generateSubject = (program:Program,ua:UserAcceptance):string =>{
    const responsibleLabel = ()=>{

        switch(ua.responsible){
            case 'it':
                return 'IT Staff';
            case 'pc':
                return 'Project Coordinator';
            case 'prod':
                return 'Production';
            default:
                return 'N/A';
        }

    }
    if(!program) return "";
    const title = `${program.project.name} - ${program.name}`
    return `${responsibleLabel()} User Acceptance Failed Test - ${title}`
}



const generateEmail = (program:Program,ua:UserAcceptance):string=>{
    if(!program) return "";
    const {items} = ua;
    const uaItems = items.reduce((acc,item)=> {
        return acc+`
        <tr>
            <td>${item.description}</td>
            <td>${item.status===1?'✓':''}</td>            
            <td>${item.status!==1?'✓':''}</td>
        </tr>
        `
    } ,"");

    const responsibleLabel = ()=>{

        switch(ua.responsible){
            case 'it':
                return 'IT Staff';
            case 'pc':
                return 'Project Coordinator';
            case 'prod':
                return 'Production';
            default:
                return 'N/A';
        }

    }
    
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
    
    Hi All,
    <br>
    <br>
    Please see below for Failed User Acceptance Tests - ${responsibleLabel()}.
    <br>
    Project Name:&nbsp;<strong>${program.project.name} - ${program.name}</strong><br>
    Person Responsible:&nbsp;<strong>${responsibleLabel()}</strong><br>
    Prepared By:&nbsp;<strong>${ua.user.first_name} ${ua.user.last_name}</strong><br>
    
    <br>
    <br>

    <table>
        <thead>
            <tr>
                <th>
                    Requirements
                </th>
                <th>
                    Yes
                </th>
                <th>
                    No
                </th>
            </tr>
        </thead>
        <tbody>
            ${uaItems}
        </tbody>
    </table>
    
    
    <br><br>
    Remarks: <br> ${ua.remarks}
    <br><br>
    Thanks.
    <br><br>
    
    
    `;
}
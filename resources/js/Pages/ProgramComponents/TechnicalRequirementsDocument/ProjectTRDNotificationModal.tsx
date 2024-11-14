import TipTap from '@/Components/TipTap';
import { Button } from '@/Components/ui/button';
import { Dialog, DialogContent } from '@/Components/ui/dialog';
import { Input } from '@/Components/ui/input';
import { Label } from '@/Components/ui/label';
import { Popover, PopoverTrigger } from '@/Components/ui/popover';
import { Separator } from '@/Components/ui/separator';
import useEditorConfig from '@/Hooks/useEditorConfig';
import { cn, ddcImgUrl } from '@/lib/utils';
import { BusinessRequirementsDocument, BusinessRequirementsDocumentItem, PageProps, Program, User } from '@/types';
import { Inertia, Page } from '@inertiajs/inertia';
import { usePage } from '@inertiajs/inertia-react';
import { Ban, Loader2, MailPlus, Send, XCircle } from 'lucide-react';
import { FC, MouseEventHandler, useEffect, useState } from 'react';
import { toast } from 'sonner';

interface Props {
    isOpen: boolean;
    onClose: () => void;
    program: Program[] | undefined;
}

const ProjectTRDNotificationModal: FC<Props> = ({ isOpen, onClose, program }) => {
  
    if(!program || program.length < 0) return
    console.log(program)
    const [sending, setSending] = useState(false);
    const [emailMsg, setEmailMsg] = useState("");
    const [sJ, setSj] = useState("");
    const { editor } = useEditorConfig();

    const [emailMsg1, setEmailMsg1] = useState("");
    const [sJ1, setSj1] = useState("");
    const { editor: editor2 } = useEditorConfig();



    const { software_testers, setup_committee, software_manager, pc_head } = usePage<Page<PageProps>>().props
    useEffect(() => {
        setEmailMsg(generateEmail(program));
        setSj(generateSubject(program));
        setEmailMsg1(generateEmail2(program));
        setSj1(generateSubject2(program));
    }, [isOpen, program]);

    const onSubmit = () => {
        if (!editor) return;

        if (editor.getHTML().length < 25) return toast.info('Email Request Message is too short');
        if (!sJ || sJ.length < 1) return toast.info('Subject Line is too short');
        const notif = toast.loading("Sending Email. Please do not close this page...");
        Inertia.post(route('programs.trd_notif'), {
            subject: sJ,
            body: editor.getHTML(),
            //@ts-ignore
            // emails:program.program_testers,
            emails: software_testers,
            program_id: program[0].id,
            setup_committee: JSON.stringify(setup_committee.concat(pc_head)),
            software_manager: JSON.stringify(software_manager)
        }, {
            onStart: () => setSending(true),
            onError: () => toast.error('An error occurred. Please try again later.', { id: notif }),
            onSuccess: () => {

                toast.success('Email Sent Successfully', { id: notif });
                if (!editor2) return;

                if (editor2.getHTML().length < 25) return toast.info('Email Request Message is too short');
                if (!sJ1 || sJ1.length < 20) return toast.info('Subject Line is too short');

                Inertia.post(route('programs.notify_setup_comitee'), {
                    subject: sJ1,
                    body: editor2.getHTML(),
                    //@ts-ignore
                    emails: program.program_testers,
                    program_id: program[0].id,
                    setup_committee: JSON.stringify(setup_committee.concat(pc_head)),
                    software_manager: JSON.stringify(software_manager),
                    program_testers: JSON.stringify(software_testers),

                }, {
                    onStart: () => setSending(true),
                    onError: () => toast.error('An error occurred. Please try again later.', { id: notif }),
                    onSuccess: () => {
                        toast.success('Email Sent Successfully', { id: notif });
                        onClose();
                    },
                    onFinish: () => setSending(false)
                });
                onClose();

            },
            onFinish: () => setSending(false)
        });
    }


    return (
        <Dialog open={isOpen} onOpenChange={onClose}>
            <DialogContent className='max-w-[90vw] max-h-[95vh] h-full flex flex-col space-x-1.5'>
                <div className='w-full flex flex-col space-y-1.5'>
                    <p className='font-semibold text-lg'>TRD Notification</p>

                    <Separator />
                    <div className='flex space-x-1.5 items-center justify-end'>
                        <Label htmlFor='subject' className=''>Subject:</Label>
                        <Input disabled={sending} id='subject' value={sJ} onChange={e => setSj(e.target.value)} className='flex-1' />
                    </div>
                    <div className='flex space-x-1.5 items-center justify-end'>
                        <Label htmlFor='to' className=''>To:</Label>
                        <div className='flex-1 flex items-center flex-wrap min-h-[2.75rem] p-2 rounded-md bg-background border border-muted gap-1.5'>
                            {/* {
                                program.program_testers.map(address=><ToItem key={address.id} to={address} onRemove={()=>{}} />)
                            } */}
                            {
                                ([...software_testers, ...setup_committee, ...pc_head]).map(address => <ToItem key={address.id} to={address} onRemove={() => { }} />)
                            }
                            <ToItem key={software_manager.id} to={software_manager} onRemove={() => { }} />
                        </div>
                    </div>
                    <div className='flex space-x-1.5 items-center justify-end'>
                        <Label htmlFor='to' className=''>CC:</Label>
                        <div className='flex-1 flex items-center flex-wrap min-h-[2.75rem] p-2 rounded-md bg-background border border-muted gap-1.5'>
                            {
                                ([...program[0]?.project?.project_coordinators || []]).map(address => <ToItem key={address.id} to={address} onRemove={() => { }} />)
                            }
                        </div>
                    </div>
                    <Separator />
                </div>
                <div className={cn('w-full flex-1 flex flex-col max-h-fit overflow-y-auto', sending ? 'opacity-50' : 'opacity-100')}>
                    <TipTap editor={editor!} content={emailMsg} />
                </div>
                <div style={{ display: "none" }} className={cn('w-full flex-1 flex flex-col max-h-fit overflow-y-auto', sending ? 'opacity-50' : 'opacity-100')}>
                    <TipTap editor={editor2!} content={emailMsg1} />
                </div>
                <div className='flex items-center justify-end space-x-1.5'>
                    <Button onClick={onClose} disabled={sending} variant='secondary' size='sm' className='text-base flex items-center space-x-1.5'>
                        <Ban className='w-4 h-4' />
                        <span>Cancel</span>
                    </Button>
                    <Button disabled={sending} onClick={onSubmit} variant='outline' size='sm' className='text-base flex items-center space-x-1.5'>
                        {!sending ? <Send className='w-4 h-4' /> : <Loader2 className='h-4 w-4 animate-spin' />}
                        <span>Send Notification</span>
                    </Button>
                </div>
            </DialogContent>
        </Dialog>
    );
};

export default ProjectTRDNotificationModal;


interface ToItemProps {
    onRemove: (user: User) => void;
    to: User;
}

export const ToItem: FC<ToItemProps> = ({ onRemove, to }) => {

    // const handleRemove:MouseEventHandler = (e) =>{
    //     e.stopPropagation();
    //     onRemove(to);
    // }


    return (
        <Button variant='secondary' className='!cursor-default relative group' size='sm'>
            {/* <XCircle onClick={handleRemove} className='opacity-30 group-hover:opacity-100 transition duration-300 cursor-pointer text-destructive h-4 w-4 absolute top-0 right-0' /> */}
            <span className=''>{`${to.first_name} ${to.last_name || ''}`}</span>
        </Button>
    );
}


const generateEmail = (program: Program[]): string => {
    if (!program) return "";
    const url = route('projects.show', { id:program[0]?.project_id });

   
    //  const {items} = business_requirement_document;
    // const [items,setItems] = useState<BusinessRequirementsDocumentItem[]>([]);

    const items: BusinessRequirementsDocumentItem[] = program.flatMap((d) => 
        d.business_requirement_document.items.map((f,index) => ({
            id: f.id,
            bus_req_doc_id: f.bus_req_doc_id,
            guid: f.guid,
            module: f.module,
            applicable_roles: f.applicable_roles,
            description: f.description,
            program_name: index === 0 ? d.name :""
        }))
    );
    

    let itemContents = items.reduce((prev, item) => prev + `
    <tr>
        <td ><u><b>${item.program_name}</b></u></td>
        <td>${item.id.toString()}</td>
        <td>${item.module}</td>
        <td>${item.applicable_roles}</td>
        <td>${item.description}</td>
    </tr>
    `, "");



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
    
    Hi Testers,
    <br>
    <br>
    Create Technical Requirements Document Notification.
    <br>
    <br>
    Project:&nbsp;<strong>${program[0]?.project?.name}</strong><br>
    
    <table>
        <thead>
            <tr>
                 <th>Program Name</th>
                <th>BR#</th>
                <th>Module/Field</th>
                <th>Applicable Roles</th>
                <th>Description</th>
            </tr>
        </thead>
        <tbody>
            ${itemContents}
        </tbody>
    </table>
    <br><br>
    Please create a Technical Requirement Document based on the Business Requirements above.
    <br />
    Please click the link below to view the Business Requirements Document:
    <br>
    <br>
    <a href='${url}'>${program[0]?.project?.name} Business Requirements Document</a>
    <br><br>
    Thanks.
    <br><b></b><br>`;
}


const generateSubject = (program: Program[]): string => {
    if (!program) return "";
    const title = `${program[0]?.project?.name}`
    return `Create TRD - ${title}`
}


const generateSubject2 = (program: Program[]): string => {
    if (!program) return "";
    const title = `${program[0]?.project?.name}`
    return `Schedule SetUp - ${title}`
}



const generateEmail2 = (program: Program[]): string => {
    if (!program) return "";

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
    Project:&nbsp;<strong>${program[0]?.project?.name}</strong><br>
    
    Thanks.
    
    
    `;
}

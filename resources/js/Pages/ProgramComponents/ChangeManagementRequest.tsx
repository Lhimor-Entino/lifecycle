import { Button } from '@/Components/ui/button';
import { Table, TableBody, TableHead, TableHeader, TableRow,TableCell } from '@/Components/ui/table';
import { ChangeManagementRequest, Program, UserAcceptance } from '@/types';
import {FC, useState} from 'react';
import { format } from 'date-fns';
import Hint from '@/Components/Hint';
import { MailWarning, Pencil, Trash2 } from 'lucide-react';
import NewCrModal from './ChangeManagementRequest/NewCrModal';
import { useDeleteChangeManagementReq } from '@/Hooks/useDeleteChangeManagementModal';
import { useChangeManagementModal } from '@/Hooks/useChangeManagementModal';
import ChangerequestEmailNotification from './ChangeRequestEmailNotification';
import { toast } from 'sonner';

interface Props {
    program:Program;
}

const SOURCE_OF_REQ: string[] = ['Client Request','Incident or Problem Resolution','']

const ChangeManagementRequest:FC<Props> = ({program}) => {
    const [showNewCr,setShowNewCr] = useState(false);
    const [showChangerequestEmail,setShowChangerequestEmail] = useState(false);
    const {change_requests} = program;

    const onEdit = () =>{

    }
    const onDelete = () => {

    }
    const onNotify= () => {
        setShowChangerequestEmail(true)
    }

    const handleOpenCRF = () => {

        let allTestPassed : UserAcceptance[] = []

         allTestPassed = program.user_acceptances.filter(ua => ua.program_id === program.id && ua.items.every(item=>item.status === 1));
        if(allTestPassed.length < 1){
            toast.info("Cannot process the change management request without user acceptance. Ensure necessary approvals.");
            return ; // If any status is not "success", return false
        }

   
        setShowNewCr(true)
    }

    return (
        <>
            <div className='w-full h-full border rounded-lg flex flex-col gap-y-2.5 p-2.5'>
                <Button onClick={()=>handleOpenCRF()} size='sm' className='ml-auto'>
                    Add Change Request
                </Button>
    
                <Table>
                    <TableHeader>
                        <TableRow>
                            <TableHead>Proposed By</TableHead>
                            <TableHead>Title</TableHead>
                            <TableHead>Date Created</TableHead>
                            <TableHead>Schedule</TableHead>
                            <TableHead>Source of Change Request</TableHead>
                            <TableHead className="text-right">Actions</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {
                            change_requests.map((c_req,index) => (
                                 <ChangeRequestItem key={index} cr={c_req} onEdit={onEdit} onDelete={onDelete} onNotify={onNotify}/>
                            ))
                        }
                    </TableBody>
                </Table>
            </div>
            <NewCrModal program={program} open={showNewCr} onClose={()=>setShowNewCr(false)} />
            <ChangerequestEmailNotification program={program} isOpen={showChangerequestEmail} onClose={()=>setShowChangerequestEmail(false)} />
        </>
    );
};

export default ChangeManagementRequest;

interface ChangeRequestItemProps{
    cr:ChangeManagementRequest;
    onEdit:(cr:ChangeManagementRequest)=>void;
    onDelete:(cr:ChangeManagementRequest)=>void;
    onNotify:(cr:ChangeManagementRequest)=>void;
   
}

const ChangeRequestItem:FC<ChangeRequestItemProps> = ({cr,onEdit,onDelete,onNotify}) =>{
    const {user} = cr;
    const fullName = `${user.first_name} ${user.last_name}`;
    const {onOpen} = useDeleteChangeManagementReq()
    const {onEditOpen} = useChangeManagementModal()
    const source = () =>{
        if(cr.client_request===1) return 'Client Request';
        if(cr.incident_or_problem_resolution===1) return 'Incident or Problem Resolution';
        if(cr.enhancement===1) return 'Enhancement';
        if(cr.business_requirement===1) return 'Business Requirement';
        if(cr.procedural===1) return 'Procedural';
        if(cr.others===1) return cr.others_description;
        return 'N/A'
    }

    return (
        <TableRow>
            <TableCell className='text-left'>{fullName}</TableCell>
            <TableCell>{cr.title}</TableCell>
            <TableCell>{format(new Date(cr.created_at),'PPp')}</TableCell>
            <TableCell>{cr.schedule}</TableCell>
            <TableCell>{source()}</TableCell>
            <TableCell className='text-right'>
                <div className='flex items-center justify-end gap-x-2'>
                    <Hint label='Edit'>                        
                        <Button onClick={()=>onEditOpen(cr.id)} variant='outline' size='icon'>
                            <Pencil className='h-5 w-5' />
                        </Button>
                    </Hint>
                    <Hint label='Delete'>                        
                        <Button variant='destructive' size='icon' onClick={() =>onOpen(cr.id)}>
                            <Trash2 className='h-5 w-5' />
                        </Button>
                    </Hint>
                    
                    <Hint label='Notify Programmers'>                        
                        <Button onClick={()=>onNotify(cr)} variant='outline' size='icon'>
                            <MailWarning className='h-5 w-5' />
                        </Button>
                    </Hint>
                </div>
            </TableCell>
        </TableRow>
    )
}
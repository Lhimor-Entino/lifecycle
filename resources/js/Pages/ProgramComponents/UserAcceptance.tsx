import { Button } from '@/Components/ui/button';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/Components/ui/table';
import { Program, UserAcceptance } from '@/types';
import {FC,  useState} from 'react';
import NewUAModal from './UserAcceptance/NewUAModal';
import { format, set } from 'date-fns';
import UpdateUAModal from './UserAcceptance/UpdateUAModal';
import Hint from '@/Components/Hint';
import { MailCheckIcon, MailWarningIcon, Pencil, Trash2 } from 'lucide-react';
import UAFailedEmail from './UAFailedEmail';
import UASuccessEmail from './UASuccessEmail';

interface Props {
    program:Program;
}

const UserAcceptance:FC<Props> = ({program}) => {
    const [showNewUa,setShowNewUa] = useState(false);
    const [showFailedEMail,setShowFailedEMail] = useState(false);
    const [showSuccessEMail,setShowSuccessEMail] = useState(false);
    
    const [showUpdateUa,setShowUpdateUa] = useState(false);
    const {user_acceptances} = program;
    const [selectedUA,setSelectedUA] = useState<UserAcceptance|undefined>();


    const editUa = (ua:UserAcceptance) =>{
        setSelectedUA(ua);
        setShowUpdateUa(true);
    }

    const emailFailedTest = (ua:UserAcceptance) =>{
        setSelectedUA(ua);
        setShowFailedEMail(true);
    }

    const emailCompletedTest = (ua:UserAcceptance) =>{
        setSelectedUA(ua);
        setShowSuccessEMail(true);
    }
    

    return (
        <>
            <div className='w-full h-full border rounded-lg flex flex-col gap-y-2.5 p-2.5'>
                <Button onClick={()=>setShowNewUa(true)} size='sm' className='ml-auto'>
                    Add User Acceptance
                </Button>
                <Table>
                    <TableHeader>
                        <TableRow>
                            <TableHead>Prepared By</TableHead>
                            <TableHead>Responsible</TableHead>
                            <TableHead>Date Created</TableHead>
                            <TableHead>All Tests Passed</TableHead>
                            <TableHead className="text-right">Actions</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {user_acceptances.map((ua)=><UAItem emailCompletedTest={emailCompletedTest} emailFailedTest={emailFailedTest} onEdit={editUa} key={ua.id} ua={ua} />)}
                    </TableBody>
                </Table>
            </div>
            <NewUAModal onClose={()=>setShowNewUa(false)} open={showNewUa} program={program} />
            {!!selectedUA&&<UpdateUAModal  open={showUpdateUa} onClose={()=>setShowUpdateUa(false)} program={program} user_acceptance={selectedUA} />}
            {!! selectedUA && <UAFailedEmail isOpen={showFailedEMail} onClose={() => setShowFailedEMail(false)} program={program} ua={selectedUA} />}
            {!!selectedUA && <UASuccessEmail isOpen={showSuccessEMail} onClose={() => setShowSuccessEMail(false)} program={program} ua={selectedUA} />}
        </>
    );
};

export default UserAcceptance;

interface UAItemProps {
    ua:UserAcceptance;
    onEdit:(ua:UserAcceptance)=>void;
    emailFailedTest:(ua:UserAcceptance)=>void;
    emailCompletedTest:(ua:UserAcceptance)=>void;
}

const UAItem:FC<UAItemProps> = ({ua,onEdit,emailFailedTest,emailCompletedTest}) => {
    const fullName = `${ua.user.first_name} ${ua.user.last_name}`;
    // allTestPassed = all up items status = 1
    const allTestPassed = ua.items.every(item=>item.status === 1);


    const responsibleLabel = ua.responsible === 'it' ? 'IT Staff' : ua.responsible === 'pc' ? 'Project Coordinator' : ua.responsible === 'prod' ? 'Production' : 'N/A';


    return(
        <TableRow>
            <TableCell>{fullName}</TableCell>
            <TableCell>{responsibleLabel}</TableCell>
            <TableCell>{format(new Date(ua.created_at),'PPp')}</TableCell>
            <TableCell>
                <span className='font-bold tracking-wide'>
                    {allTestPassed?'YES':'NO'}
                </span>
            </TableCell>
            <TableCell className='text-right'>
                <div className='flex items-center justify-end gap-x-2'>
                    <Hint label='Edit'>                        
                        <Button onClick={()=>onEdit(ua)} variant='outline' size='icon'>
                            <Pencil className='h-5 w-5' />
                        </Button>
                    </Hint>
                    <Hint label='TODO: Delete'>                        
                        <Button variant='destructive' size='icon'>
                            <Trash2 className='h-5 w-5' />
                        </Button>
                    </Hint>
                    
                    {allTestPassed?(                        
                        <Hint label='Send an Email to inform of completed tests'>                        
                            <Button onClick={()=>emailCompletedTest(ua)} variant='secondary' size='icon'>
                                <MailCheckIcon className='h-5 w-5' />
                            </Button>
                        </Hint>
                    ):(                        
                        <Hint label='Send an Email to inform of failed tests'>                        
                            <Button onClick={()=>emailFailedTest(ua)} variant='default' size='icon'>
                                <MailWarningIcon className='h-5 w-5' />
                            </Button>
                        </Hint>
                    )}
                </div>
            </TableCell>
        </TableRow>
    )
}


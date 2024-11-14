import { FC, FormEventHandler, useEffect, useState } from 'react';
import { BusinessRequirementsDocument, BusinessRequirementsDocumentItem, PageProps, Program, Project, User } from '@/types';
import { ScrollArea } from '@/Components/ui/scroll-area';
import { Button } from '@/Components/ui/button';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/Components/ui/table';
import BusReqModal from './BusinessRequirementsDocument/BusReqModal';
import { format } from 'date-fns';
import { FilePlus2, ListTodo, Loader2, MailPlus, PencilLineIcon, Trash2 } from 'lucide-react';
import Hint from '@/Components/Hint';
import BusReqItemModal from './BusinessRequirementsDocument/BusReqItemModal';
import { Inertia, Page } from '@inertiajs/inertia';
import { toast } from 'sonner';
import { cn } from '@/lib/utils';
import TRDNotificationModal from './TechnicalRequirementsDocument/TRDNotificationModal';
import useRestriction from '@/Hooks/useRestriction';
import { usePage } from '@inertiajs/inertia-react';

interface Props {
    program: Program;

}
interface BusReq {
    id: number;
    program_id: number;
    user_id: number;
    volume: string;
    turnaround: string;
    accuracy: string;
    output_format: string;
    program: Program;
    user: User;
}

const BusinessRequirementsDocument: FC<Props> = ({ program }) => {
    const [showNewBusinessRequirementsDocument, setShowNewBusinessRequirementsDocument] = useState(false);
    const [showNewBusinessRequirementsItem, setShowNewBusinessRequirementsItem] = useState(false);
    const { usePcRestriction } = useRestriction()
    const [showTRDNotificationModal, setShowTRDNotificationModal] = useState(false);
    const { auth, projects } = usePage<Page<PageProps>>().props
    const [busReq, setBusReq] = useState<Program | undefined>(undefined)
    const {business_requirement_document : BRD} = program.project
    const openTRDNotificationModal = () => {

        if (!program.business_requirement_document) return;
        //if(program.business_requirement_document.items.length <1) return toast.error('Cannot notify System Tester to create TRD. No Business Requirements Items found');
        setShowTRDNotificationModal(true);

    }
  


    useEffect(() => {
        console.log("prog",program)
    },[program])
    return (
        <>
            <div className='w-full h-full border rounded-lg flex items-center justify-center'>
         
                {
                    !BRD ? (
                        <div className='flex flex-col gap-y-5'>
                            <h3 className='text-lg !font-bold'>
                                No Business Requirements Document
                            </h3>
                            <Button onClick={() => setShowNewBusinessRequirementsDocument(true)}>
                                Create Business Requirements Document
                            </Button>
                        </div>
                    ) : (
                        <div className='h-full w-full flex flex-col gap-y-0.5 px-2.5 py-3'>
                            <div className='h-auto flex items-center justify-between gap-x-2'>
                                {/* {JSON.stringify(busReq)} */}
                                <div className='space-y-1 text-xs'>
                                    <p>Created By: &nbsp; {BRD?.user?.first_name} {BRD.user?.last_name}</p>
                                    
                                    <p>Created At:  &nbsp; {
                                        (new Date(BRD?.created_at || ""), 'PP')}</p>
                                    <p>Position:  &nbsp;{auth.user.position}</p>

                                </div>

                                <div className='flex items-center justify-center gap-x-2 py-3.5'>
                                    <Hint label='Add Item'>
                                        <Button disabled={!usePcRestriction(auth.user.department)} onClick={() => setShowNewBusinessRequirementsItem(true)} size='icon' variant='secondary'>
                                            <FilePlus2 />
                                        </Button>
                                    </Hint>
                                    <Hint label='Edit '>
                                        <Button disabled={!usePcRestriction(auth.user.department)} onClick={() => setShowNewBusinessRequirementsDocument(true)} size='icon' variant='outline'>
                                            <PencilLineIcon />
                                        </Button>
                                    </Hint>
                                    <Hint label='Notify System Tester to create TRD '>
                                        <Button disabled={!usePcRestriction(auth.user.department)} onClick={openTRDNotificationModal} size='icon' >
                                            <MailPlus />
                                        </Button>
                                    </Hint>
                                </div>

                            </div>
                            <div className='py-3.5 flex flex-col gap-y-1.5 text-sm h-auto'>
                                <div className='flex items-center justify-between gap-x-2'>
                                    <div className='w-1/2 flex items-center gap-3'>
                                        <p className='text-muted-foreground'>BRD No.</p>
                                        <p className=' font-bold'> {`BRD-000${BRD?.id}`}</p>
                                    </div>

                                </div>
                                <div className='flex items-center justify-between gap-x-2'>
                                    <div className='w-1/2 flex items-center justify-between'>
                                        <p className='text-muted-foreground'>Client Name</p>
                                        <p>{program.project.name}</p>
                                    </div>
                                    <div className='w-1/2 flex items-center justify-between'>
                                        <p className='text-muted-foreground'>Program Name</p>
                                        <p>{program.name}</p>
                                    </div>
                                </div>
                                <div className='flex items-center justify-between gap-x-2'>
                                    <div className='w-1/2 flex items-center justify-between'>
                                        <p className='text-muted-foreground'>Volume</p>
                                        <p>{BRD?.volume}</p>
                                    </div>
                                    <div className='w-1/2 flex items-center justify-between'>
                                        <p className='text-muted-foreground'>Turnaround</p>
                                        <p>{BRD?.turnaround}</p>
                                    </div>
                                </div>
                                <div className='flex items-center justify-between gap-x-2'>
                                    <div className='w-1/2 flex items-center justify-between'>
                                        <p className='text-muted-foreground'>Accuracy</p>
                                        <p>{BRD?.accuracy}</p>
                                    </div>
                                    <div className='w-1/2 flex items-center justify-between'>
                                        <p className='text-muted-foreground'>Output Format</p>
                                        <p>{BRD?.output_format}</p>
                                    </div>
                                </div>
                            </div>
                            <Table className='flex-1'>
                                <TableHeader className='!border-2 sticky top-0 bg-background z-50'>
                                    <TableRow>
                                        <TableHead className='!border !font-light'>
                                            BR#
                                        </TableHead>
                                        <TableHead className='!border !font-light'>
                                            Module
                                        </TableHead>
                                        <TableHead className='!border !font-light'>
                                            Applicable Roles
                                        </TableHead>
                                        <TableHead className='!border !font-light'>
                                            Description
                                        </TableHead>
                                        <TableHead className='!border !font-light'>
                                            Delete
                                        </TableHead>


                                    </TableRow>

                                </TableHeader>
                                <TableBody>
                                        
                                    {
                                       program?.business_requirement_document_item?.map((item) => (
                                            <BRItem key={item.id} item={item} user={auth.user} restriction={usePcRestriction} />
                                        ))
                                    }
                                </TableBody>
                            </Table>
                        </div>
                    )
                }

            </div>
            <BusReqModal program={program} isOpen={showNewBusinessRequirementsDocument} onClose={() => setShowNewBusinessRequirementsDocument(false)} />
                
              {!!program.project.business_requirement_document && <BusReqItemModal project_id={program.project_id} openTRDNotificationModal={openTRDNotificationModal} program_id={program.id} bus_req_id={program?.project?.business_requirement_document.id} isOpen={showNewBusinessRequirementsItem} onClose={() => setShowNewBusinessRequirementsItem(false)} />}
            {!!program.business_requirement_document && <TRDNotificationModal program={program} isOpen={showTRDNotificationModal} onClose={() => setShowTRDNotificationModal(false)} />}
        </>
    );
};

export default BusinessRequirementsDocument;

interface BRItemProps {
    item: BusinessRequirementsDocumentItem;
    restriction: any
    user: User
}

const BRItem: FC<BRItemProps> = ({ item, restriction, user }) => {
    const [loading, setLoading] = useState(false);

    const onDelete = () => {
        Inertia.post(route('business_requirement.item.destroy', { id: item.id }), {}, {
            onStart: () => setLoading(true),
            onFinish: () => setLoading(false),
            onError: () => toast.error('Failed to delete Business Requirements Item. Try again')
        });
    }

    const Icon = loading ? Loader2 : Trash2;

    return (
        <TableRow>
            <TableCell className='!border'>{item.id}</TableCell>
            <TableCell className='!border'>{item.module}</TableCell>
            <TableCell className='!border'>{item.applicable_roles}</TableCell>
            <TableCell className='!border'>{item.description}</TableCell>

            <TableCell className='!border'>
                <Button disabled={loading || !restriction(user.department)} onClick={onDelete} size='icon' variant='destructive'>
                    <Icon className={cn(loading && 'animate-spin')} />

                </Button>
            </TableCell>


        </TableRow>
    );
}

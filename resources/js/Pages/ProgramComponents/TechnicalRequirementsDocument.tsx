import { Button } from '@/Components/ui/button';
import { PageProps, Program, TechnicalRequirementsDocumentItem, User } from '@/types';
import {FC, useEffect, useState} from 'react';
import TeqReqModal from './TechnicalRequirementsDocument/TeqReqModal';
import { format } from 'date-fns';
import { Separator } from '@/Components/ui/separator';
import { FilePlus, FolderGit2, GitBranchPlusIcon, InfoIcon, MailPlus, MoreHorizontal, MoreVertical, PencilLine, Trash2Icon, ViewIcon,  } from 'lucide-react';
import { TableBody, TableCell, TableHead, TableHeader, TableRow,Table } from '@/Components/ui/table';
import TeqReqItemModal from './TechnicalRequirementsDocument/TeqReqItemModal';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuTrigger } from '@/Components/ui/dropdown-menu';
import { Inertia, Page } from '@inertiajs/inertia';
import { toast } from 'sonner';
import { cn } from '@/lib/utils';
import NotifySetUpCommiteeModal from './BusinessRequirementsDocument/NotifySetUpCommiteeModal';
import { Badge } from '@/Components/ui/badge';
import { usePage } from '@inertiajs/inertia-react';
import TegReqItemPreviousVersion from './TechnicalRequirementsDocument/TegReqItemPreviousVersion';
import { ScrollArea } from '@/Components/ui/scroll-area';
import useRestriction from '@/Hooks/useRestriction';

interface Props {
    program:Program;
}

const TechnicalRequirementsDocument:FC<Props> = ({program}) => {
    const [showNewTechnicalRequirementsDocument,setShowNewTechnicalRequirementsDocument] = useState(false);
    const [showNewTechnicalRequirementsItem,setShowNewTechnicalRequirementsItem] = useState(false);
    const [showNotifySetUpCommitee,setShowNotifySetUpCommitee] = useState(false);
    const {trd_items,auth} = usePage<Page<PageProps>>().props
        const {business_requirement_document : BRD} = program.project
    const {usePcRestriction} = useRestriction()
    const handleNotifySetUpCommitee = () =>{
        if(!program.techinical_requirement_document) return;
        if(program.techinical_requirement_document.items.length<1) return toast.error('Cannot notify Setup Commitee. No TRD Items found');
        setShowNotifySetUpCommitee(true);
    }

    const getNextVersion = (current_version:string) => {
        let new_v : string = current_version
        if (!current_version?.includes("-")){
             current_version + "-v1"
             new_v = current_version + "-v1"
            
            return new_v
        }  

 
        const base_version: string = new_v?.split('-')[0];
        const version:number = parseInt(new_v?.split('-')[1].split('')[1]) + 1;


        return `${base_version}-v${version}`
    }

    const createNewTrdVersion = () => {
        if(!program.techinical_requirement_document_item){
           
            return
        }
        const new_trd_item:TechnicalRequirementsDocumentItem[] = program.techinical_requirement_document_item.filter(t => t.is_active === 0).map((ti,index) => ({    
            id:ti.id,
            teq_req_doc_id:ti.teq_req_doc_id,
            bus_req_doc_item_id:ti.bus_req_doc_item_id,
            req_description:ti.req_description,
            test_case_id: getNextVersion(ti.test_case_id),
            test_case_description:'',
            test_case_remarks:'',
            test_case_status:'ongoing',
            is_active:0
        }))

        const old_trd_item = program.techinical_requirement_document_item.filter(t => t.is_active === 0).map((ti)=>(ti.id))

        const postData = {
            new_trd_item : new_trd_item,
            program_id: program.id,
            trd_doc_id: program.project.business_requirement_document.id,
            old_trd_item: old_trd_item
        }

  
         Inertia.post(route('tech_requirement.create_new_trd_test_case'),{
            //@ts-ignore
            postData}, {
            onSuccess : () => {
                toast.success("New TRD versions created.")
            }
         });
   
    }
    const handleCreateNewTrdItem = () => {
        if(!program.techinical_requirement_document_item){
            toast.error("No Trd")
            return
        }
        const hasfailedTrd = program.techinical_requirement_document_item.filter(ti => ti.test_case_status === "failed" && ti.is_active === 0)
        console.log(hasfailedTrd);
        
        if (hasfailedTrd.length < 1){
            toast(
            <div className='flex items-center flex-col justify-end'>
                <div className='flex items-center'>
                    <InfoIcon className='h-8 w-8 mr-2' />
                    <p>There are no failed TRD status. Are you sure to create New versions?</p>
                </div>   
                <Button size={"sm"} className='mt-3 w-full' onClick={() => createNewTrdVersion()}>
                    Proceed
                </Button>
             </div>,
              {
                style: {backgroundColor: "#ffd60a"},     
                duration: 3000,
              });

              return
        }
       
        createNewTrdVersion()
        
    }

console.log("TECH",program)
    
    return (
        <>

            <div className='w-full h-full border rounded-lg flex items-center justify-center'>
            
                {
                    //!program.techinical_requirement_document ?(
                        !program.project.business_requirement_document ?(
                        <div className='flex flex-col gap-y-5'>
                            <h3 className='text-lg !font-bold'>
                                No Technical Requirements Document
                            </h3>
                            <Button onClick={()=>setShowNewTechnicalRequirementsDocument(true)}>
                                Create Technical Requirements Document
                            </Button>
                        </div>
                    ):(
                        <>
                            <div className='h-full container mx-auto px-5 py-2.5 flex flex-col gap-y-0.5'>
                                <div className='h-auto flex items-center justify-between gap-x-2'>
                                    <p className='flex-1 font-semibold text-lg tracking-wide'>
                                        Technical Requirements Document  
                                    </p>
                           
                                    <div className='flex items-center gap-x-3.5 text-sm'>
                                        <div className='flex flex-col gap-y-1.5'>
                                            <div className='flex items-center justify-between'>
                                                <p>
                                                    TRD No.
                                                </p>
                                                <p className='ml-2 font-bold'>
                                                    {`BRD-000${program.project.business_requirement_document.id}-TRD-000${program.project.business_requirement_document.id}`}
                                                   
                                                </p>
                                            </div>
                                            <div className='flex items-center justify-between'>
                                                <p>
                                                    Date:
                                                </p>
                                                <p>
                                                    {format(new Date(program.project.business_requirement_document.created_at),'PP')}
                                                </p>
                                            </div>
                                        </div>
                                        <DropdownMenu>
                                            <DropdownMenuTrigger asChild>                                                
                                                <Button disabled={!usePcRestriction(auth.user.department)} size='icon' className='rounded-full' variant='ghost'>
                                                    <MoreVertical />
                                                </Button>
                                            </DropdownMenuTrigger>
                                            <DropdownMenuContent side='left'>
                                                <DropdownMenuLabel>Options</DropdownMenuLabel>
                                                <DropdownMenuSeparator />
                                                <DropdownMenuItem onClick={()=>handleCreateNewTrdItem()}>
                                                    <GitBranchPlusIcon className='h-4 w-4 mr-2' />
                                                    Create New TRD versions
                                                </DropdownMenuItem>
                                                <DropdownMenuItem onClick={()=>toast.info('Please go to Business Requirement Documents and add an Item.')}>
                                                    <FilePlus className='h-4 w-4 mr-2' />
                                                    New TRD Item
                                                </DropdownMenuItem>
                                  
                                                <DropdownMenuItem onClick={handleNotifySetUpCommitee}>
                                                    <MailPlus className='h-4 w-4 mr-2' />
                                                    Notify Setup Committtee
                                                </DropdownMenuItem>
                                            </DropdownMenuContent>
                                        </DropdownMenu>
                                    </div>
                                </div>
                                
                                <Separator />
                                <div className='py-3.5 flex flex-col gap-y-1.5 text-sm h-auto'>
                                    <div className='flex items-center justify-between gap-x-2'>
                                        <div className='w-1/2 flex items-center justify-between'>
                                            <p className='text-muted-foreground'>Client Name</p>
                                            
                                            <p>{program.project.client_name}</p>
                                        </div>
                                        <div className='w-1/2 flex items-center justify-between'>
                                            <p className='text-muted-foreground'>Program Name</p>
                                            <p>{program.name}</p>
                                        </div>
                                    </div>
                                    <div className='flex items-center justify-between gap-x-2'>
                                        <div className='w-1/2 flex items-center justify-between'>
                                            <p className='text-muted-foreground'>Accuracy</p>
                                            <p>{program.project.business_requirement_document.accuracy}</p>
                                        </div>
                                        <div className='w-1/2 flex items-center justify-between'>
                                            <p className='text-muted-foreground'>Output Format</p>
                                            <p>{program.project.business_requirement_document.output_format}</p>
                                        </div>
                                    </div>                       
                                </div>
                                <Table className='flex-1'>
                                    <TableHeader className='!border-2 sticky top-0 bg-background z-50'>
                                        <TableRow>                                
                                            <TableHead className='!border !font-light'>
                                                Req ID
                                            </TableHead>
                                            <TableHead className='!border !font-light'>
                                                Req. Description
                                            </TableHead>
                                            <TableHead className='!border !font-light'>
                                                Test Case ID
                                            </TableHead>
                                            <TableHead className='!border !font-light'>
                                                Test Description
                                            </TableHead>
                                            <TableHead className='!border !font-light'>
                                                Test Remarks
                                            </TableHead>
                                            <TableHead className='!border !font-light'>
                                                Test Status
                                            </TableHead>
                                            <TableHead className='!border !font-light'>
                                                Actions
                                            </TableHead>
                                        </TableRow>
                                        
                                    </TableHeader>
                                    <TableBody>
                                        {
                                            (program?.techinical_requirement_document_item||[]).map((item)=><TRQItem key={item.id} item={item} restriction={usePcRestriction} user={auth.user} /> )
                                        }
                               

                                      {/* {JSON.stringify(program.business_requirement_document.items )}      
                                             {
                                              
                                                (trd_items||[])
                                               .filter(ti => program.techinical_requirement_document.items.map(tdi => tdi.id).includes(ti.id))
                                               .map((item)=> item.is_active === 0 ? <TRQItem key={item.id} item={item} /> : "")
                                              
                                             } */}
                                    </TableBody>
                                </Table>
                                
                            </div>
                        </>
                    )
                }
            </div>
            {/* <TeqReqModal program={program} isOpen={showNewTechnicalRequirementsDocument} onClose={()=>setShowNewTechnicalRequirementsDocument(false)} /> */}
            {!!program.techinical_requirement_document && <TeqReqItemModal teq_req_id={program.techinical_requirement_document.id} isOpen={showNewTechnicalRequirementsItem} onClose={()=>setShowNewTechnicalRequirementsItem(false)} />}
            {!!program.techinical_requirement_document && <NotifySetUpCommiteeModal program={program} isOpen={showNotifySetUpCommitee} onClose={()=>setShowNotifySetUpCommitee(false)} />}
        </>
    );
};

export default TechnicalRequirementsDocument;

interface TRQItemProps{
    item: TechnicalRequirementsDocumentItem;
    restriction:any;
    user: User
}

const TRQItem:FC<TRQItemProps> = ({item,restriction,user}) =>{
    const [showModal,setShowModal] = useState(false);
    const [deleting,setDeleting] = useState(false);
    const [descriptions, setDescriptions] = useState<String[]>(["1","2","3"])
    const onDelete=()=>{
        Inertia.post(route('tech_requirement.item.destroy',{id:item.id}),{},{
            onStart:()=>setDeleting(true),
            onSuccess:()=>setDeleting(false),
            onError:()=>toast.error('Failed to delete Technical Requirements Document Item. Try again')
        })
    }
    
    useEffect(()=>{

        if(!item.req_description) return;
        setDescriptions(JSON.parse(item.test_case_description))
       
    },[item])


    return (
        <>
            <TableRow className={cn(deleting&&'!animate-pulse')}>
                <TableCell className='!border'>{item.id}</TableCell>
                <TableCell className='!border '>{item.req_description}</TableCell>
                <TableCell className='!border'>{item.test_case_id}</TableCell>
                <TableCell className='!border w-1/3'>
                    
                    <div className='flex flex-col '>
                    <ScrollArea className='h-10'>
                    {
                     descriptions?.map((ts,index) =>
                     
                               <p className='mr-5 ' key={index}> <span key={index} className='mr-2'>{index + 1}.</span>{ts}</p> 
                      
                          )
                    }
                    </ScrollArea>
                    </div>
                    
                </TableCell>
                <TableCell className='!border'>{item.test_case_remarks}</TableCell> 
                <TableCell className='!border'>
                    {item.test_case_status==='failed' && <Badge variant='destructive'>Failed</Badge>}
                    {item.test_case_status==='ongoing' && <Badge variant='outline'>On-Going</Badge>}
                    {item.test_case_status==='success' && <Badge variant='default'>Success</Badge>}
                </TableCell>
                <TableCell className='!border flex items-center '>
                    <DropdownMenu>
                        <DropdownMenuTrigger asChild>                        
                            <Button disabled={deleting ||!restriction(user.department) } variant='ghost'>
                                <MoreHorizontal />
                            </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent>
                            <DropdownMenuLabel>Options</DropdownMenuLabel>
                            <DropdownMenuSeparator />
                      
                            <DropdownMenuItem onClick={()=>setShowModal(true)}>                           
                                <PencilLine className='h-4 w-4 mr-2' />
                                Update
                            </DropdownMenuItem>
                            <DropdownMenuItem onClick={()=>toast.info('Please go to Business Requirement Documents, then delete it from there')}>
                                <Trash2Icon className='h-4 w-4 mr-2' />
                                Delete
                            </DropdownMenuItem>
                          
                        </DropdownMenuContent>
                    </DropdownMenu>
                    <TegReqItemPreviousVersion item={item} id={item.id} />
                </TableCell>
            </TableRow>
      
            <TeqReqItemModal teq_req_id={item.teq_req_doc_id} teqReqItem={item} isOpen={showModal} onClose={()=>setShowModal(false)} />
        </>
    );
}
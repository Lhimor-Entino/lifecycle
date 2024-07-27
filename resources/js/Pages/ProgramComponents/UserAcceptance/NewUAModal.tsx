import { Button } from '@/Components/ui/button';
import { Checkbox } from '@/Components/ui/checkbox';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '@/Components/ui/dialog';
import { Input } from '@/Components/ui/input';
import { Label } from '@/Components/ui/label';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/Components/ui/table';
import { Textarea } from '@/Components/ui/textarea';
import { PageProps, Program, UAResponsible } from '@/types';
import { Inertia, Page } from '@inertiajs/inertia';
import { usePage } from '@inertiajs/inertia-react';
import { Loader2, XIcon } from 'lucide-react';
import {FC, useState} from 'react';
import { toast } from 'sonner';

interface Props {
    program:Program;
    open:boolean;
    onClose:()=>void;
}

export type Requirements = {description:string;status:1|0|2,is_additional:number};

const NewUAModal:FC<Props> = ({program,open,onClose}) => {
    const [loading,setLoading] = useState(false);
    const {user} = usePage<Page<PageProps>>().props.auth;
    const fullName = `${user.first_name} ${user.last_name}`;
    const [responsible,setResponsible] = useState<UAResponsible|undefined>();
    const [remarks,setRemarks] = useState('');
    const [requirements,setRequirements] = useState<Requirements[]>([
        {description:'Were the business requirements met? (please refer to Business Requirement Document)',status:0,is_additional:0},
        {description:'Project Documentation done?',status:0,is_additional:0},
        {description:'Agreed set of security controls in place?',status:0,is_additional:0},
        {description:'Installation of software approved?',status:0,is_additional:0},
        {description:'No virus detected?',status:0,is_additional:0},
        {description:'Deletion of old version done?',status:0,is_additional:0},
    ]);
    const [additionalTests,setAdditionalTests] = useState<Requirements[]>([]);
    const addAditionalTest = ()=> setAdditionalTests(val=>[...val,{description:`Additional Test ${(val.length+1).toString()}`,status:0,is_additional:1}]);
    const updateAdditionalTestDescription = (index:number,value:string)=> setAdditionalTests(val=>val.map((test,i)=>i===index?{description:value,status:test.status,is_additional:1}:test));
    const updateAdditionalTestStatus = (index:number,value:1|0|2)=> setAdditionalTests(val=>val.map((test,i)=>i===index?{description:test.description,status:value,is_additional:1}:test));
    const updateRequirementStatus = (index:number,value:1|0|2)=> setRequirements(val=>val.map((requirement,i)=>i===index?{description:requirement.description,status:value,is_additional:0}:requirement));
    const removeAdditionalTest = (desc:string)=> setAdditionalTests(val=>val.filter(test=>test.description!==desc));
    const onSubmit = () =>{
        if(!responsible) return toast.info('Please select person responsible.')
        Inertia.post(route('user_acceptance.store'),{
            program_id:program.id,
            responsible,
            remarks,
            //@ts-ignore
            items:[...requirements,...additionalTests].map(requirement=>({description:requirement.description,status:requirement.status,is_additional:requirement.is_additional}))
        },{
            onStart:()=>setLoading(true),
            onFinish:()=>setLoading(false),
            onError:()=>toast.error('An error occured, please try again.'),
            onSuccess:()=>{
                toast.success('User Acceptance created successfully');
                onClose();
            }
        })
    }

    return (
        <Dialog open={open} onOpenChange={onClose}>
            <DialogContent className='max-w-[90vw] max-h-[95vh] h-full flex flex-col space-x-1.5'>
                <DialogHeader className='h-auto'>
                    <DialogTitle>New User Acceptance</DialogTitle>
                    <DialogDescription>
                        Create New User Acceptance
                    </DialogDescription>
                </DialogHeader>
                <div className='flex flex-col gap-y-2.5 flex-1 overflow-y-auto relative'>
                    <div className='space-y-1 h-auto'>                        
                        <Label>Prepared By:</Label>
                        <Input value={fullName} disabled />
                    </div>
                    <div className='space-y-1  h-auto'>
                        <Label>Person Responsible</Label>
                        <div className='flex flex-row items-center justify-between'>
                            <div className="flex items-center space-x-2">
                                <Checkbox onCheckedChange={()=>setResponsible('it')} checked={responsible==='it'} disabled={loading}  id="it" />
                                <label
                                    htmlFor="it"
                                    className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                                >
                                    IT Staff
                                </label>
                            </div>
                            <div className="flex items-center space-x-2">
                                <Checkbox onCheckedChange={()=>setResponsible('prod')} checked={responsible==='prod'} disabled={loading}  id="prod" />
                                <label
                                    htmlFor="prod"
                                    className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                                >
                                    Production
                                </label>
                            </div>
                            <div className="flex items-center space-x-2">
                                <Checkbox onCheckedChange={()=>setResponsible('pc')}  checked={responsible==='pc'} disabled={loading}  id="pc" />
                                <label
                                    htmlFor="pc"
                                    className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                                >
                                    Project Coordinator
                                </label>
                            </div>
                        </div>                        
                    </div>
                    <Table className='flex-1'>
                        <TableHeader className="z-50 sticky top-0 bg-secondary ">
                            <TableRow>
                                <TableHead>Requirements</TableHead>
                                <TableHead className='text-start'>Yes</TableHead>
                                <TableHead className='text-start'>No</TableHead>
                                <TableHead className='text-start'>NA</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {requirements.map((requirement,index)=>(
                                <TableRow key={requirement.description}>
                                    <TableCell>{requirement.description}</TableCell>
                                    <TableCell>
                                        <div className='flex items-center justify-start'>
                                            <Checkbox disabled={loading}  onCheckedChange={()=>updateRequirementStatus(index,1)} checked={requirement.status===1} />                                            
                                        </div>                                            
                                    </TableCell>
                                    <TableCell>
                                        <div className='flex items-center justify-start'>
                                            <Checkbox disabled={loading}  onCheckedChange={()=>updateRequirementStatus(index,0)} checked={requirement.status===0}/>                                            
                                        </div>                                            
                                    </TableCell>
                                    <TableCell>
                                        <div className='flex items-center justify-start'>
                                            <Checkbox disabled={loading}  onCheckedChange={()=>updateRequirementStatus(index,2)} checked={requirement.status===2}/>                                            
                                        </div>                                            
                                    </TableCell>
                                </TableRow>
                            ))}
                            <TableRow>
                                <TableCell>Additional tests done if applicable:</TableCell>
                                <TableCell colSpan={2}>
                                    <Button size='sm' className='ml-auto' onClick={addAditionalTest} disabled={loading}>Add</Button>
                                </TableCell>
                            </TableRow>
                            {additionalTests.map((requirement,index)=>(
                                <TableRow key={index}>
                                    <TableCell>
                                        <div className='flex items-center gap-x-2'>
                                            <Button onClick={()=>removeAdditionalTest(requirement.description)} size='icon' variant='destructive'>
                                                <XIcon className='w-4 h-4'  />
                                            </Button>
                                            <Input value={requirement.description} onChange={e=>updateAdditionalTestDescription(index,e.target.value)} />
                                        </div>
                                    </TableCell>
                                    <TableCell>
                                        <div className='flex items-center justify-start'>
                                            <Checkbox disabled={loading}  onCheckedChange={()=>updateAdditionalTestStatus(index,1)} checked={requirement.status===1} />                                            
                                        </div>                                            
                                    </TableCell>
                                    <TableCell>
                                        <div className='flex items-center justify-start'>
                                            <Checkbox disabled={loading}  onCheckedChange={()=>updateAdditionalTestStatus(index,0)} checked={requirement.status===0}/>                                            
                                        </div>                                            
                                    </TableCell>
                                    <TableCell>
                                        <div className='flex items-center justify-start'>
                                            <Checkbox disabled={loading}  onCheckedChange={()=>updateAdditionalTestStatus(index,2)} checked={requirement.status===2}/>                                            
                                        </div>                                            
                                    </TableCell>
                                </TableRow>
                            
                            ))}
                        </TableBody>
                    </Table>
                    <div className='space-y-1'>
                        <Label>Remarks:</Label>
                        <Textarea rows={2} value={remarks} onChange={({target})=>setRemarks(target.value)} placeholder='Remarks...' disabled={loading} />
                    </div>
                </div>
                <DialogFooter className='h-auto'>
                    <Button disabled={loading} onClick={onSubmit} type="submit">
                        {loading && <Loader2 className='h-4 w-4 mr-2 animate-spin' />}
                        Save changes
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
};

export default NewUAModal;
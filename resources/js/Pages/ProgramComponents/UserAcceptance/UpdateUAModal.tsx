import { Button } from '@/Components/ui/button';
import { Checkbox } from '@/Components/ui/checkbox';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '@/Components/ui/dialog';
import { Input } from '@/Components/ui/input';
import { Label } from '@/Components/ui/label';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/Components/ui/table';
import { Textarea } from '@/Components/ui/textarea';
import { Program, UAResponsible, UserAcceptance } from '@/types';
import { usePage } from '@inertiajs/inertia-react';
import { Loader2, XIcon } from 'lucide-react';
import {FC, useEffect, useState} from 'react';
import { Requirements } from './NewUAModal';
import { toast } from 'sonner';
import { Inertia } from '@inertiajs/inertia';

interface Props {
    program:Program;
    user_acceptance:UserAcceptance;
    open:boolean;
    onClose:()=>void;
}

const UpdateUAModal:FC<Props> = ({program,user_acceptance,open,onClose}) => {
    const [loading,setLoading] = useState(false);
    const {user} = user_acceptance;
    const fullName = `${user.first_name} ${user.last_name}`;
    const [responsible,setResponsible] = useState<UAResponsible|undefined>();
    const [remarks,setRemarks] = useState('');
    const [requirements,setRequirements] = useState<Requirements[]>([]);
    const [additionalTests,setAdditionalTests] = useState<Requirements[]>([]);

    const addAditionalTest = ()=> setAdditionalTests(val=>[...val,{description:`Additional Test ${(val.length+1).toString()}`,status:0,is_additional:1}]);
    const updateAdditionalTestDescription = (index:number,value:string)=> setAdditionalTests(val=>val.map((test,i)=>i===index?{description:value,status:test.status,is_additional:1}:test));
    const updateAdditionalTestStatus = (index:number,value:1|0|2)=> setAdditionalTests(val=>val.map((test,i)=>i===index?{description:test.description,status:value,is_additional:1}:test));
    const updateRequirementStatus = (index:number,value:1|0|2)=> setRequirements(val=>val.map((requirement,i)=>i===index?{description:requirement.description,status:value,is_additional:0}:requirement));
    const removeAdditionalTest = (desc:string)=> setAdditionalTests(val=>val.filter(test=>test.description!==desc));
    const onSubmit = () =>{
        if(!responsible) return toast.info('Please select person responsible.')
        Inertia.post(route('user_acceptance.update',{id:user_acceptance.id}),{
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
                toast.success('User Acceptance updated successfully');
                onClose();
            }
        })
    }

    useEffect(()=>{
        setResponsible(user_acceptance.responsible);
        setRemarks(user_acceptance.remarks||"");
        setRequirements(user_acceptance.items.filter(item=>item.is_additional!==1).map(item=>({description:item.description,status:item.status,is_additional:item.is_additional})));
        setAdditionalTests(user_acceptance.items.filter(item=>item.is_additional===1).map(item=>({description:item.description,status:item.status,is_additional:item.is_additional})));
    },[user_acceptance]);

    return (
        <Dialog open={open} onOpenChange={onClose}>
            <DialogContent className='max-w-[90vw] max-h-[95vh] h-full flex flex-col space-x-1.5'>
                <DialogHeader className='h-auto'>
                    <DialogTitle>Edit User Acceptance</DialogTitle>
                    <DialogDescription>
                        Make Changes to this User Acceptance
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

export default UpdateUAModal;
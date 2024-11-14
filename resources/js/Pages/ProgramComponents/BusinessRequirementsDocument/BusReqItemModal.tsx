import { Button } from '@/Components/ui/button';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@/Components/ui/dialog';
import { Input } from '@/Components/ui/input';
import { Label } from '@/Components/ui/label';
import { Textarea } from '@/Components/ui/textarea';
import { useForm } from '@inertiajs/inertia-react';
import { Loader2 } from 'lucide-react';
import {FC, FormEventHandler, useEffect, useState} from 'react';
import { toast } from 'sonner';
import { Inertia } from '@inertiajs/inertia';
import {
    Sheet,
    SheetContent,
    SheetDescription,
    SheetHeader,
    SheetTitle,
    SheetTrigger,
  } from "@/Components/ui/sheet"

import {
    Table,
    TableBody,
    TableCaption,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
  } from "@/Components/ui/table"
interface Props {
    isOpen?:boolean;
    onClose:()=>void;
    bus_req_id:number;
    program_id:number;
    project_id:number;
    openTRDNotificationModal: () => void;
}

interface Items{
    module:string,
    applicable_roles:string,
    description:string,
    bus_req_doc_id: number
}

interface Item {
    module: string;
    applicable_roles: string;
    description: string;
    bus_req_doc_id: number;
  }
const BusReqItemModal:FC<Props> = ({isOpen,onClose,bus_req_id,openTRDNotificationModal,program_id,project_id}) => {

    const [items,setItems] = useState<Items[]>([]);
    const [loading,setLoading] = useState(false);
    const [module,setModule] = useState("")
    const [applicable_roles,setSelected_roles] = useState("")
    const [description,setDescription] = useState("")

    const {data,setData,processing,reset,post} = useForm({
        project_id:project_id,
        program_id : program_id,
        module:'',
        applicable_roles:'',
        description:'',
        bus_req_doc_id:bus_req_id,
        items: []
    });


    const onSubmit:FormEventHandler<HTMLFormElement> = e =>{
        e.preventDefault();
      
               // Serialize tags array to JSON string
               const serializedData = {
                ...data,
                items: JSON.stringify(items),
            };

            console.log(serializedData)
        // Send fo 
        Inertia.post(
            route('business_requirement.item.store', serializedData), // Adjust based on your route parameter
            {}, // You can pass additional data here if needed
            {
                onSuccess: () => {onClose(); reset(); openTRDNotificationModal(); setItems([])},
                onStart: () => setLoading(true),
                onFinish: () => setLoading(false),
                onError: () => toast.error('Failed to delete Business Requirements Item. Try again')
            }
        );


    }

    const handleAddItem = () => {
        const additionalData: Items = {
            module:module,
            applicable_roles:applicable_roles,
            description:description,
            bus_req_doc_id:bus_req_id
      
          };
          setModule("")
          setSelected_roles("")
          setDescription("")

          setItems([...items,additionalData])
      
    }

    useEffect(()=>{
        if(!isOpen) reset();
    },[isOpen]);

    return (
        <Sheet open={isOpen} onOpenChange={onClose} >
        <SheetTrigger>Open</SheetTrigger>
        <SheetContent style={{zIndex: 100}}  side={"bottom"}>
            <SheetHeader>
            <SheetTitle className='pb-10'>New Business Requirements Document Item</SheetTitle>
            </SheetHeader>

             
                    <div className='flex w-full justify-between   '>
                        <div className='w-1/4 '>
                            <div className='flex flex-col gap-y-2 w-full' >
                                <div className='space-y-1'>
                                    <Label>Module/Field</Label>
                                    <Input  disabled={processing} required autoFocus type='text' value={module} onChange={e=>setModule(e.target.value)} />
                                </div>
                                <div className='space-y-1'>
                                    <Label>Applicable Roles</Label>
                                    <Textarea rows={2} disabled={processing} required  value={applicable_roles} onChange={e=>setSelected_roles(e.target.value)} />
                                </div>
                                <div className='space-y-1'>
                                        <Label>Description</Label>
                                        <Textarea rows={2} disabled={processing} required  value={description} onChange={e=>setDescription(e.target.value)} />
                                </div>
                                <Button disabled={loading} className='ml-auto' size='sm'  type='button' onClick={()=>handleAddItem()}>
                                        {loading && <Loader2 className='animate-spin mr-2 h-5 w-5' /> }
                                        Add
                                </Button>
                                {/* <Button disabled={processing} className='ml-auto' size='sm' type='submit'>
                                        {processing && <Loader2 className='animate-spin mr-2 h-5 w-5' /> }
                                        Save
                                </Button> */}
                            </div>
                        </div>
                
                        <div className='w-3/4 pl-4' >
                           <form onSubmit={onSubmit}>
                           <div className='flex flex-col gap-y-2 w-full' >
                            <Table >
                                {items.length === 0 ?  <TableCaption>List of your Required Document Item.</TableCaption> : "" }
                           
                                <TableHeader>
                                    <TableRow>
                                    <TableHead className="w-[400px]">Module/Field</TableHead>
                                    <TableHead>Applicable Roles</TableHead>
                                    <TableHead>Description</TableHead>
                                
                                    </TableRow>
                                </TableHeader>
                                <TableBody>
                                
                                    {
                                        items.map((item,index) => (
                                            <TableRow key={index}>
                                            <TableCell className="font-medium">{item.module}</TableCell>
                                            <TableCell>{item.applicable_roles}</TableCell>
                                            <TableCell>{item.description}</TableCell>
                                            </TableRow>
                                        ))
                                    }
                            
                                </TableBody>
                            </Table>

                            <Button disabled={loading || items.length === 0} className='ml-auto' size='sm' type='submit'>
                                        {loading && <Loader2 className='animate-spin mr-2 h-5 w-5' /> }
                                        Save
                            </Button>
                            </div>
                            </form>
                        </div>
                    </div>

              
            
            </SheetContent>
        </Sheet>
        // <Dialog open={isOpen} onOpenChange={onClose}>
              
        //     <DialogContent>
        //         <DialogHeader>
        //             <DialogTitle>New Business Requirements Document Item</DialogTitle>
        //         </DialogHeader>
        //         <form onSubmit={onSubmit} className='flex flex-col gap-y-2' >
        //             <div className='space-y-1'>
        //                 <Label>Module/Field</Label>
        //                 <Input disabled={processing} required autoFocus type='text' value={data.module} onChange={e=>setData('module',e.target.value)} />
        //             </div>
        //             <div className='space-y-1'>
        //                 <Label>Applicable Roles</Label>
        //                 <Textarea rows={2} disabled={processing} required  value={data.applicable_roles} onChange={e=>setData('applicable_roles',e.target.value)} />
        //             </div>
        //             <div className='space-y-1'>
        //                 <Label>Description</Label>
        //                 <Textarea rows={2} disabled={processing} required  value={data.description} onChange={e=>setData('description',e.target.value)} />
        //             </div>
        //             <Button disabled={processing} className='ml-auto' size='sm' type='submit'>
        //                 {processing && <Loader2 className='animate-spin mr-2 h-5 w-5' /> }
        //                 Save
        //             </Button>
        //         </form>
        //     </DialogContent>
        // </Dialog>
    );
};

export default BusReqItemModal;
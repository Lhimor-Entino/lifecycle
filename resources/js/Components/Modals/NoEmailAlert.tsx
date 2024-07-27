import { PageProps, User } from "@/types";
import { Page } from "@inertiajs/inertia";
import { useForm, usePage } from "@inertiajs/inertia-react";
import { FC,  useState } from "react";
import { AlertDialog, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from "../ui/alert-dialog";
import { AlertTriangle, Check, Loader2,  } from "lucide-react";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "../ui/table";
import { Input } from "../ui/input";
import { Button } from "../ui/button";
import { cn } from "@/lib/utils";
import { toast } from "sonner";
import { Dialog, DialogClose, DialogContent, DialogDescription, DialogFooter, DialogHeader,DialogTitle } from "../ui/dialog";


const NoEmailAlert:FC = () =>{
    const {users_with_no_email} = usePage<Page<PageProps>>().props;
    const showAlert = users_with_no_email.length > 0
    const [open,setOpen] = useState(showAlert);
    return (
        <Dialog open={open} onOpenChange={()=>setOpen(false)}>
            <DialogContent className='md:min-w-[40rem] max-h-full flex flex-col gap-y-1'>
                <DialogHeader className='h-auto'>
                    <DialogTitle asChild>
                        <div className='flex items-center gap-x-2'>
                                <AlertTriangle className='w-7 h-7 text-destructive' />
                                <p>Alert!</p>
                            </div>
                    </DialogTitle>
                    <DialogDescription>
                    There are users with no email address. Please update their email address below.
                    </DialogDescription>

                    <div className="flex-1 overflow-y-auto flex">
                    <Table>
                        <TableHeader className="sticky top-0 bg-background z-50">
                            <TableRow>
                                <TableHead className="w-40">
                                    User
                                </TableHead>
                                <TableHead>
                                    Email
                                </TableHead>
                                <TableHead>
                                    Save
                                </TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {users_with_no_email.map(user=><Item key={user.id} user={user} />)}
                        </TableBody>
                    </Table>
                </div>
                <DialogFooter  className='h-auto'>
                        <DialogClose>
                        Dismiss
                        </DialogClose>
                </DialogFooter>
                </DialogHeader>
            {/* <AlertDialog open={open} onOpenChange={()=>setOpen(false)}>
            <AlertDialogContent className='md:min-w-[40rem] max-h-full flex flex-col gap-y-1'>
                <AlertDialogHeader className='h-auto'>
                    <AlertDialogTitle asChild>
                        <div className='flex items-center gap-x-2'>
                            <AlertTriangle className='w-7 h-7 text-destructive' />
                            <p>Alert!</p>
                        </div>
                    </AlertDialogTitle>
                    <AlertDialogDescription>
                        There are users with no email address. Please update their email address below.
                    </AlertDialogDescription>
                </AlertDialogHeader>
                <div className="flex-1 overflow-y-auto flex">
                    <Table>
                        <TableHeader className="sticky top-0 bg-background z-50">
                            <TableRow>
                                <TableHead className="w-40">
                                    User
                                </TableHead>
                                <TableHead>
                                    Email
                                </TableHead>
                                <TableHead>
                                    Save
                                </TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {users_with_no_email.map(user=><Item key={user.id} user={user} />)}
                        </TableBody>
                    </Table>
                </div>
                <AlertDialogFooter className='h-auto'>
                    <AlertDialogCancel>Dismiss</AlertDialogCancel>
                </AlertDialogFooter>
            </AlertDialogContent>
        </AlertDialog> */}
            </DialogContent>
        </Dialog>
   
      
    );
}

export default NoEmailAlert;

interface ItemProps{
    user:User;
}

const Item:FC<ItemProps> = ({user}) =>{
    const {data,setData,processing,post,errors} = useForm({
        email:'',
        user_id:user.id
    });
    
    const Icon = !processing? Check : Loader2;
    
    const onUpdate = () =>{
        if(!data.email || data.email.length <5 || !isValidEmail(data.email) ) return toast.error('Invalid email address');
        post(route('hrms.email'),{
            onError:()=>toast.error('Failed to update email address. Try again')
        });
        
    }

    return (
        <TableRow>
            <TableCell className="text-xs">
                {`${user.first_name} ${user.last_name}, ${user.company_id}`}
            </TableCell>
            <TableCell>
                <div>
                    <Input className="text-xs" placeholder={`${user.first_name}.${user.last_name}@datacapture2.com.ph`} disabled={processing} required type='email' value={data.email} onChange={e=>setData('email',e.target.value)} />
                    {errors.email && <p className="text-xs text-destructive">{errors.email}</p>}
                </div>
            </TableCell>
            <TableCell>
                <Button onClick={onUpdate} disabled={processing} size='sm' variant='ghost' className="rounded-full">
                    <Icon className={cn('w-5 h-5',processing&&'animate-spin')} />
                </Button>
            </TableCell>
        </TableRow>
    );
}

const isValidEmail = (email:string) =>{
    const regex = /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,6}$/;
    return regex.test(email);
}
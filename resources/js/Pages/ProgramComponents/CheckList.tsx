import { Button } from '@/Components/ui/button';
import { Dialog, DialogClose, DialogContent, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from '@/Components/ui/dialog';
import { Table, TableBody, TableCell, TableRow } from '@/Components/ui/table';
import { cn } from '@/lib/utils';
import { PageProps, Program, Step } from '@/types';
import { Page } from '@inertiajs/inertia';
import { usePage } from '@inertiajs/inertia-react';
import { CheckCircle, CircleIcon, ListTodo } from 'lucide-react';
import {FC, ReactNode} from 'react';

interface Props {
    program:Program;
}

const CheckList:FC<Props> = ({program}) => {
    
    const {steps} = usePage<Page<PageProps>>().props;
    return (
        <Dialog>
            <DialogTrigger asChild>
                <Button size='sm' variant='secondary' className=' w-full md:w-auto' >
                    <ListTodo className='w-5 h-5 mr-2'/>
                    Check List
                </Button>
            </DialogTrigger>
            <DialogContent className='max-h-full flex flex-col '>
                <DialogHeader className='h-auto'>
                    <DialogTitle>Program CheckList</DialogTitle>
                </DialogHeader>
                <Table className='flex-1 overflow-y-auto'>
                    <TableBody>
                        {steps.map(step=><CheckListItem key={step.id} program={program} step={step} />)}
                    </TableBody>
                </Table>
                {/* <DialogFooter className='h-auto'>
                    <DialogClose>Close</DialogClose>
                </DialogFooter> */}
            </DialogContent>
        </Dialog>
        
    );
};

export default CheckList;

interface CheckListItemProps {
    program:Program;
    step:Step;
}

const CheckListItem:FC<CheckListItemProps> = ({program,step}) =>{
    const Icon = program.step.step>step.step?CheckCircle:CircleIcon;
    return (
        <TableRow>
            <TableCell className='!max-w-[2.5rem]'>
                <Icon className={cn('w-5 h-5',program.step.step>step.step&&'text-green-500')} />
            </TableCell>
            <TableCell className={cn(program.step.step>step.step&&'text-green-500')} >
                {`${step.step}. ${step.name}`}
            </TableCell>
        </TableRow>
    );
}
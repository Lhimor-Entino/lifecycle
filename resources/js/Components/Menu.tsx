import { Inertia } from '@inertiajs/inertia';
import {FC, MouseEventHandler} from 'react';
import { toast } from 'sonner';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuSeparator, DropdownMenuTrigger } from './ui/dropdown-menu';
import { MoreHorizontal, PencilIcon, Trash2 } from 'lucide-react';
import { Button } from './ui/button';
import { format } from 'date-fns';
import { useArchiveProject } from '@/Hooks/useArchiveProject';
import { useProjectModal } from '@/Hooks/useProjectModal';
import { Project } from '@/types';

interface Props {
    project:Project
    updateDate:Date;
}

const Menu:FC<Props> = ({project,updateDate}) => {
    const {id,user} = project;
    const {onOpen} = useArchiveProject();
    const {onOpen:onEdit} = useProjectModal();

    const handleEdit = () => {
        onEdit(project);
    }
    return (
        <DropdownMenu>
            <DropdownMenuTrigger asChild>
                <Button size='sm' variant='ghost'><MoreHorizontal className='h-4 w-4' /></Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent className='w-60 z-50' align='end' alignOffset={8} forceMount>
                <DropdownMenuItem onClick={handleEdit}>
                    <PencilIcon className='h-5 w-5 mr-2' />
                    <span>Edit</span>
                </DropdownMenuItem>
                <DropdownMenuItem onClick={()=>onOpen(id)}>
                    <Trash2 className='h-4 w-4 mr-2' />
                    <span>Archive</span>
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <div className='text-xs text-muted-foreground p-2'>
                    <p>Created By: {`${user.first_name} ${user.last_name}`}</p>
                    <p>Last Edited: {format(updateDate,'PPpp')}</p>
                </div>
            </DropdownMenuContent>
        </DropdownMenu>
    );
};

export default Menu;
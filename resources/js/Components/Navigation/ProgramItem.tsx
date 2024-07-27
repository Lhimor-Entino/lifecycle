import { PageProps, Program } from '@/types';
import { CodeIcon,  ExternalLink,  FileCode2,  FileIcon,  Pencil, Trash2 } from 'lucide-react';
import {EventHandler, FC, MouseEventHandler} from 'react';
import Hint from '../Hint';
import { useProgramModal } from '@/Hooks/useProgramModal';
import { useDeleteProgram } from '@/Hooks/useDeleteProgram';
import { Inertia, Page } from '@inertiajs/inertia';
import { usePage } from '@inertiajs/inertia-react';
import { cn } from '@/lib/utils';

interface Props {
    program:Program;
}

const ProgramItem:FC<Props> = ({program}) => {
    
    const {onOpen} = useProgramModal();
    const {onOpen:onDelete} = useDeleteProgram();
    
    const {selected_program} = usePage<Page<PageProps>>().props;
    const handleEdit:MouseEventHandler<HTMLButtonElement> = e =>{
        e.stopPropagation();
        onOpen(program.project_id,program)
    }  

    const handleDelete:MouseEventHandler<HTMLButtonElement> = e =>{
        e.stopPropagation();
        onDelete(program.id)
    }

    const navigate = () => Inertia.get(route('programs.show',{id:program.id}));

    const active = selected_program?.id===program.id;

    return (
        <div className={cn('flex items-center gap-x-1 w-full group rounded-lg p-1.5 ')}>
            <FileCode2 strokeWidth={active?2:1.5} className='h-5 w-5 text-primary'/>
            <div role='button' onClick={navigate}  className=' w-full flex items-center flex-1 gap-x-2'>
                <p className='capitalize truncate flex items-center'>
                    <span className={cn(active?'font-medium':'font-light')}>{program.name}</span>
                </p>
                <div className='flex items-center gap-x-1.5 px-3'>
                    {/* <button onClick={handleEdit} className='z-50 rounded-full opacity-0 group-hover:opacity-100 transition h-full ml-auto  hover:bg-secondary'>
                        <Hint label='Edit This Program'>
                            <Pencil className='h-4 w-4 '/>
                        </Hint>
                    </button> */}
                    <button onClick={handleDelete} className='z-50 rounded-full opacity-0 group-hover:opacity-100 transition h-full ml-auto  hover:bg-secondary'>
                        <Hint label='Delete This Program'>
                            <Trash2 className='h-4 w-4 '/>
                        </Hint>
                    </button>
                </div>
            </div>
        </div>
    );
};

export default ProgramItem;
import { PageProps, Project } from '@/types';
import { Inertia, Page } from '@inertiajs/inertia';
import { usePage } from '@inertiajs/inertia-react';
import { Search, Trash, Undo } from 'lucide-react';
import {FC, MouseEvent, useMemo, useState} from 'react';
import { Input } from './ui/input';
import Hint from './Hint';
import { toast } from 'sonner';

interface Props {
    selected_project?:Project;
}

const Trashbox:FC<Props> = ({selected_project}) => {
    const {id} = selected_project||{};
    const {archives} = usePage<Page<PageProps>>().props;
    
    const [filter,setFilter] = useState("");
    const filteredProjects = useMemo(()=>archives.filter(({name})=>name.toLocaleLowerCase().includes(filter.toLocaleLowerCase())),[filter,archives]);
    const onClick = (id:number) => Inertia.get(route('projects.show',{id}));
    const onRestore = (e:MouseEvent<HTMLDivElement, globalThis.MouseEvent>,id:number) => {
        e.stopPropagation();   
        Inertia.post(route('projects.restore',{id}),{},{
            onSuccess:()=>toast.success('Project Restored'),
            onError:()=>toast.error('Something Went Wrong. Please try again...')
        });     
    };

    const onPermaDelete = () => {
        if (!id) return;
        Inertia.post(route('projects.destroy',{id}),{},{
            onSuccess:()=>toast.success('Project Permeneantly Deleted'),
            onError:()=>toast.error('Something Went Wrong. Please try again...')
        });
    };

    return (
        <div className='text-sm'>
            <div className='flex items-center gap-x-1 p-1.5'>
                <Search className='h-4 w-4' />
                <Input value={filter} onChange={({target})=>setFilter(target.value)} className='h-7 px-1.5 bg-secondary' placeholder='Filter by Project Name...' />
            </div>
            <div className='mt-2 px-1 pb-1'>
                <p className='hidden last:block text-xs text-center pb-2 text-muted-foreground'>No Documents Found...</p>
                {
                    filteredProjects.map(({id,...project})=>(
                        <div key={id} role='button' onClick={()=>onClick(id)} className='text-sm rounded-sm w-full hover:bg-primary/5 flex items-center text-primary justify-between'>
                            <span className='truncate pl-2'>{project.name}</span>
                            <div className='flex items-center'>
                                <Hint label='Restore'>
                                    <div className='rounded-full p-2 hover:bg-primary/20' role='button' onClick={e=>onRestore(e,id)}>
                                        <Undo className='h-4 w-4 text-muted-foreground' />
                                    </div>
                                </Hint>
                                <Hint label='Delete Permanently'>
                                    <div onClick={onPermaDelete} role='button' className='rounded-full p-2 hover:bg-primary/20'>
                                        <Trash className='h-4 w-4 text-muted-foreground' />
                                    </div>
                                </Hint>
                            </div>
                            
                        </div>
                    ))
                }
            </div>
        </div>
    );
};

export default Trashbox;
import { Inertia } from '@inertiajs/inertia';
import {FC} from 'react';
import { toast } from 'sonner';
import { Button } from './ui/button';

interface Props {
    id:number;
}

const Banner:FC<Props> = ({id}) => {
    const onRestore = () => {
        Inertia.post(route('projects.restore',{id}),{},{
            onSuccess:()=>toast.success('Project Restored'),
            onError:()=>toast.error('Something Went Wrong. Please try again...')
        });
        
    };

    const onPermaDelete = () => {
        Inertia.post(route('projects.destroy',{id}),{},{
            onSuccess:()=>toast.success('Project Permeneantly Deleted'),
            onError:()=>toast.error('Something Went Wrong. Please try again...')
        });
    };
    return (
        <div className='w-full bg-secondary text-center text-sm p-2 text-primary flex items-center gap-x-2 justify-center'>
            <p>This Project has been Archived</p>
            <Button size='sm' onClick={onRestore} variant='outline' className='border-white bg-transparent hover:bg-primary/5 text-primary hover:text-primary py-1 px-2 h-auto font-normal' >Restore Document</Button>
            
            <Button onClick={onPermaDelete} size='sm' variant='outline' className='border-white bg-transparent hover:bg-primary/5 text-primary hover:text-primary py-1 px-2 h-auto font-normal' >Delete Permanently</Button>
            
        </div>
    );
};

export default Banner;
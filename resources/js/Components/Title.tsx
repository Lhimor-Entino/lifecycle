import { Project } from '@/types';
import { Inertia } from '@inertiajs/inertia';
import {ChangeEventHandler, FC, FormEventHandler, KeyboardEventHandler, useRef, useState} from 'react';
import { Input } from './ui/input';
import { Button } from './ui/button';
import { useForm } from '@inertiajs/inertia-react';
import { toast } from 'sonner';

interface Props {
    project:Project;
}

const Title:FC<Props> = ({project}) => {
    const {id} = project;
    const [isEditing,setIsEditing] = useState(false);
    const {data,setData,processing,post} = useForm({name:project.name});
    const inputRef = useRef<HTMLInputElement>(null);

    
    const onChange:ChangeEventHandler<HTMLInputElement> = e => setData('name',e.target.value);

    const onSubmit:FormEventHandler<HTMLFormElement> = e => {
        e.preventDefault();
        post(route('projects.rename',{id}),{
            onSuccess:()=>{
                setIsEditing(false);
                toast.success('Project Name Updated');
            },
            onError:()=>toast.error('Something Went Wrong. Please try again...')
        })
    }
    
    const onBlur = () =>{
        setData('name',project.name);
        setIsEditing(false);
    }

    const enableInput = () =>{
        setData('name',project.name);
        setIsEditing(true);
        setTimeout(()=>{
            inputRef.current?.focus();
            inputRef.current?.setSelectionRange(0,inputRef.current.value.length);
        },0);
    }
    return (
        <form onSubmit={onSubmit} className='flex items-center gap-x-1'>         
            {isEditing?<Input disabled={processing} onClick={enableInput} onBlur={onBlur}  onChange={onChange} ref={inputRef} value={data.name} className='h-7 px-2 ' />: <Button onClick={enableInput} variant='ghost' size='sm' className='font-normal h-auto p-1'><span className='truncate'>{project.name}</span></Button>}            
        </form>
    );
};

export default Title;
import { useProjectModal } from "@/Hooks/useProjectModal"
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "../ui/dialog";
import { Button } from "../ui/button";
import { useQuery } from "@tanstack/react-query";
import axios from "axios";
import { ChangeEventHandler, FC, FormEventHandler, useEffect, useState } from "react";
import { Label } from "../ui/label";
import { useForm, usePage } from "@inertiajs/inertia-react";
import { Input } from "../ui/input";
import { Popover, PopoverContent, PopoverTrigger } from "../ui/popover";
import { cn } from "@/lib/utils";
import { CalendarIcon, Check, CheckIcon, ChevronsUpDown, Loader2, Search, XIcon } from 'lucide-react';
import { format } from "date-fns";
import { Calendar } from "../ui/calendar";
import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem, CommandList } from "../ui/command";
import { Textarea } from "../ui/textarea";
import { HrmsInfo, PageProps } from "@/types";
import { useDebounceValue } from "usehooks-ts";
import { toast } from "sonner";
import { Page } from "@inertiajs/inertia";
const ProjectModal:FC = () => {
    const [search,setSearch] = useState('');
    const [searchValue,setSearchValue] = useDebounceValue("", 500);
    const { isOpen, onClose,project } = useProjectModal();
    const {user} = usePage<Page<PageProps>>().props.auth
    const {data,setData,processing,post}  = useForm({
        name:'',
        client_name:'',
        coordinators: [] as HrmsInfo[]
    });
    const [open, setOpen] = useState(false);
    
    const {isError,isLoading,data:users,refetch,isFetched} = useQuery({
        queryKey:['search',searchValue],  
        queryFn: (search) => axios.get(route('hrms.search',{search:search.queryKey[1]})).then((res):HrmsInfo[]=>res.data),
        enabled:false
    });

    const onSearch:ChangeEventHandler<HTMLInputElement> = ({target}) =>{
        const {value} = target
        setSearch(value);
        setSearchValue(value);
    }
    
    useEffect(()=>{
        if(searchValue.length<3) return;
        refetch();
    },[searchValue]);

    useEffect(()=>{
        if(!isOpen ) return;
        const formattedUsers:HrmsInfo[]|[] = (project?.project_coordinators||[]).map(({company_id,first_name,last_name,department,position,email})=>({idno:company_id,first_name,last_name,department,job_job_title:position,work_email:email||""}));
        setData(val=>({...val,coordinators:formattedUsers,name:project?.name||'',client_name:project?.client_name||''}));
    },[isOpen]);



    const addCoordinator = (user:HrmsInfo) => {
       // if(data.coordinators.findIndex(({idno})=>idno===user.idno)>-1) return;
       console.log(user)
        setData(val=>({...val,coordinators:[...val.coordinators,user]}));
      
    }


    const onSubmit:FormEventHandler<HTMLFormElement> = e => {
        e.preventDefault();

        if(!data.name) return toast.error('Project name is required.');
        if(data.coordinators.length<1) return toast.error('At least one project coordinator is required.');
        
        const href = !!project?route('projects.update',{id:project.id}):route('projects.store');

        post(href,{
            onSuccess:()=>{
                onClose();
                toast.success(!!project?'Project Updated':'Project Created  Successfully');
            },
            onError:e=>{
                console.error(e);
                toast.error('Something went wrong. Please try again');
            }
        });
    }


    useEffect(() => {

            const d:HrmsInfo[] = [{
                job_job_title : user.position,
                idno : user.company_id,
                last_name : user.last_name,
                first_name : user.first_name,
                picture_location : user.photo,
                department : user.department,
                work_email : user.email || ""
            }]

            setData("coordinators", d);
    },[data.name])

    if(!isOpen) return null;

    return (
        <Dialog open={isOpen} onOpenChange={onClose} modal>
            <DialogContent className="h-auto flex flex-col">
                <DialogHeader className="h-auto">
                    <DialogTitle>{!project?'Create New Project':'Edit Project'}</DialogTitle>
                    <DialogDescription>
                        {!project?'Fill in the form below to create a new project.':'Edit the form below to update the project.'}
                    </DialogDescription>
                </DialogHeader>
                <form id="project" onSubmit={onSubmit} className="flex flex-col gap-y-2.5 flex-1 overflow-y-auto px-3.5">
                    <div className="space-y-1.5">
                        <Label >Project Name</Label>
                        <Input required value={data.name} onChange={({target})=>setData('name',target.value)} autoFocus  disabled={processing} />
                    </div>
                    <div className="space-y-1.5">
                        <Label >Client Name</Label>
                        <Input value={data.client_name} onChange={({target})=>setData('client_name',target.value)}   disabled={processing} />
                    </div>
                    {/* <div className="space-y-1.5">
                        <Label >Project Coordinators</Label>
                        <Popover open={open} onOpenChange={setOpen}>
                            <PopoverTrigger asChild>
                                <Button disabled={processing} variant="outline" role="combobox" aria-expanded={open} className="w-full justify-between" >
                                    Search Users...
                                    <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                                </Button>
                            </PopoverTrigger>
                            <PopoverContent className="w-full p-3.5">
                                <Command className="w-full">
                                    <Input placeholder="Search users..." className="w-full" onChange={onSearch} value={search} />
                                    <CommandGroup className="w-full max-h-48 overflow-y-auto">
                                        {(users||[]).map((user) => (
                                            <CommandItem className="w-full"
                                                key={user.idno}
                                                onSelect={() => {
                                                    addCoordinator(user);
                                                    setOpen(false);
                                                }}>
                                                <span className="capitalize">{`${user.first_name} ${user.last_name}`}</span>
                                                <CheckIcon className={cn( "ml-auto h-4 w-4", data.coordinators.findIndex(({idno})=>idno===user.idno)>-1 ? "opacity-100" : "opacity-0")}/>
                                            </CommandItem>
                                        ))}
                                        {isLoading&&searchValue.length>2&&<div className="w-full flex items-center gap-x-2"><Loader2 className="h-5 w-5 animate-spin" /><span>Loading Users...</span></div>}
                                    </CommandGroup>
                                </Command>
                            </PopoverContent>
                        </Popover>
                        <div className="flex flex-col gap-y-1 w-full">
                         
                            {
                                data.coordinators.map((user) => (
                                    <div key={user.idno} className="flex items-center justify-between">
                                        <span className="capitalize text-sm">{`${user.first_name} ${user.last_name}`}</span>
                                        <Button disabled={processing} type="button" variant='destructive' size='sm'     onClick={()=>setData(val=>({...val,coordinators:val.coordinators.filter(({idno})=>idno!==user.idno)} ) )}> Remove </Button>
                                    </div>
                                ))
                            }
                        </div>
                    </div>      
                    */}
                    <div className="flex flex-col gap-y-1 w-full">
                        <Label >Project Coordinators</Label>
                     
                        <p className=" font-semibold text-xs mt-2 bg-slate-100 rounded-sm p-3 shadow-sm-">{`${user.first_name} ${user.last_name}`}</p>
                     </div>
                </form>
                <DialogFooter className="h-auto px-3.5">
                    <Button type="submit" form="project" disabled={processing}>
                        {processing&&<Loader2 className="h-5 w-5 mr-2 animate-spin" />}
                        Save changes
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    )
}
export default ProjectModal;


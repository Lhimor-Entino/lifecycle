
import { HrmsInfo, PageProps, Project } from "@/types";
import { Inertia, Page } from "@inertiajs/inertia";
import { useForm, usePage } from "@inertiajs/inertia-react";
import { ChangeEventHandler, FC, FormEventHandler, useEffect, useState, useRef } from "react"
import Item from "./Navigation/Item";
import { CheckIcon, ChevronsUpDown, ChevronsUpDownIcon, FileIcon, FolderIcon, FolderOpenIcon, Loader2 } from "lucide-react";
import { Separator } from "./ui/separator";
import { useProjectModal } from "@/Hooks/useProjectModal";
import { useDebounceValue, useLocalStorage } from "usehooks-ts";

import { Popover, PopoverContent, PopoverTrigger } from './ui/popover';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "./ui/dialog";
import { Label } from './ui/label';
import { Input } from './ui/input';
import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem } from './ui/command';
import { cn } from "@/lib/utils";
import { Button } from "./ui/button";
import { toast } from "sonner";
import { useQuery } from "@tanstack/react-query";
import axios from "axios";

interface Props{
    selected_project?:Project;
}

const ProjectList:FC<Props> = ({selected_project}) => {
    const {projects,acknowledge_programs} = usePage<Page<PageProps>>().props;
    const [expanded,setExpanded] = useLocalStorage<Record<number,boolean>>('expanded',{});  


    const onExpand = (id:number) => setExpanded(val=>({...val,[id]:!val[id]}));

    const navigate = (id:number) => {
        Inertia.get(route('projects.show',{id}),{},{
            onFinish:()=>setExpanded(val=>({...val,[id]:true}))
        })
    };
    
    const {onOpen} = useProjectModal();

    const handleEdit = (id:number) =>  onOpen(projects.find(p=>p.id===id));
    const [showNewProgramModal,setShowNewProgramModal] = useState(false);
    const [activeId,setActiveId] = useState(0);
    const openNewProgramModal = (id:number) =>{
        setActiveId(id);
        setShowNewProgramModal(true);
    }
    return (
        <>
            <div className="flex flex-col gap-y-1.5 pb-3.5 w-full">
                {
                    projects.map(({id,...document})=>(
                        <div key={id}>
                            <Item
                                onEdit={handleEdit}
                                id={id} 
                                onClick={()=>navigate(id)}
                                label={document.name}
                                Icon={expanded[id]?FolderOpenIcon:FolderIcon}
                                active={selected_project?.id===id}
                                onExpand={()=>onExpand(id)}
                                expanded={expanded[id]}
                                updateDate={new Date(document.updated_at)}
                                onNewProgram={openNewProgramModal}
                                isForAcknowledge={false}
                                />
                        </div>
                    ))
                }
                <Separator />
                {
                    acknowledge_programs.map(({id,...document})=> (
                        <div key={id}>
                            <Item
                                onEdit={handleEdit}
                                id={id} 
                                onClick={()=>navigate(id)}
                                label={document.name}
                                Icon={expanded[id]?FolderOpenIcon:FolderIcon}
                                active={selected_project?.id===id}
                                onExpand={()=>onExpand(id)}
                                expanded={expanded[id]}
                                updateDate={new Date(document.updated_at)}
                                onNewProgram={openNewProgramModal}
                                isForAcknowledge={true}
                                />
                        </div>
                    ))
                }
            </div>
            
            <NewProgramModal project_id={activeId} isOpen={showNewProgramModal} onClose={()=>setShowNewProgramModal(false)} />
        </>
    )
}
export default ProjectList;


interface NewProgramModalProps{
    isOpen?:boolean;
    onClose:()=>void;
    project_id:number;
}

const NewProgramModal:FC<NewProgramModalProps>= ({project_id,isOpen,onClose}) =>{
    const [searchValue,setSearchValue] = useDebounceValue("", 500);
    const [search,setSearch] = useState('');
    const [openProgrammers, setOpenProgrammers] = useState(false);
    const [openTesters, setOpenTesters] = useState(false);
    const {user} = usePage<Page<PageProps>>().props.auth
    const buttonRef = useRef<HTMLButtonElement>(null); // Ref to store the button element
    const onSearch:ChangeEventHandler<HTMLInputElement> = ({target}) =>{
        const {value} = target
        setSearch(value);
        setSearchValue(value);
    }
    const {isError,isLoading,data:employees,refetch,isFetched} = useQuery({
        queryKey:['search',searchValue],  
        queryFn: (search) => axios.get(route('hrms.search',{search:search.queryKey[1]})).then((res):HrmsInfo[]=>res.data),
        enabled:false
    });

    const [openDepartments,setOpenDepartments] = useState(false);
    
    const {departments} = usePage<Page<PageProps>>().props;

    const {data,setData,processing,post}  = useForm({
        project_id,
        name:'',
        department:"",
        
        programmers:[] as HrmsInfo[],
        testers:[] as HrmsInfo[],
    });


    const onSubmit:FormEventHandler<HTMLFormElement> = e =>{
        e.preventDefault()
 
            if(!data.department) return toast.error('Please select a department.');
            if(data.project_id===0) return toast.error('Sysmtem error, please refresh the page and try again.');
            // if(data.programmers.length===0) return toast.error('Please add at least one programmer.');
           // if(data.testers.length===0) return toast.error('Please add at least one tester.');
            post(route('programs.new'),{
                onError:e=>{
                    console.error(e);
                    toast.error('An error occured while creating the program. Please try again.');
                },
                onSuccess:()=>{
                    toast.success('Program created successfully.');
                    onClose();
                },
                preserveState:false
            });    
    }

    const addProgrammer = (user:HrmsInfo) => {
        if(data.programmers.findIndex(({idno})=>idno===user.idno)>-1) return;
        setData(val=>({...val,programmers:[...val.programmers,user]}));
    }

    const addTester = (user:HrmsInfo) => {
        if(data.testers.findIndex(({idno})=>idno===user.idno)>-1) return;
        setData(val=>({...val,testers:[...val.testers,user]}));
    }

    useEffect(()=>{
        if(searchValue.length<3) return;
        refetch();
    },[searchValue]);


    useEffect(()=>{
        if(!isOpen) return;
        setData(val=>({...val,project_id,name:'',department:''}));
    },[project_id,isOpen]);


    useEffect(()=>{
        setData("department",user.department)
    },[data.name])

    return (
        <Dialog open={isOpen} onOpenChange={onClose} modal>
            <DialogContent className="md:min-w-[30rem] w-full">
                <DialogHeader>
                    <DialogTitle>New Program</DialogTitle>
                    <DialogDescription>
                        Enter Program Details
                    </DialogDescription>
         
                </DialogHeader>
                <form onSubmit={onSubmit} id='new_program' className="flex flex-col gap-y-2.5">
                    <div className="flex flex-col gap-y-1.5">
                        <Label htmlFor="name" >
                            Name
                        </Label>
                        <Input required value={data.name} onChange={({target})=>{setData('name',target.value);}} autoComplete='off' autoFocus disabled={processing} id="name"  />
                    </div>
                    <div className="flex flex-col gap-y-1.5">
                        <Label htmlFor="username" >
                            Department
                        </Label>
                        <p className=" font-semibold text-xs mt-2 bg-slate-100 rounded-sm p-3 shadow-sm-">{user.department}</p>
                
                    </div>
                    {/* <div className="space-y-1.5">
                        <Label >Programmers</Label>
                        <Popover open={openProgrammers} onOpenChange={setOpenProgrammers}>
                            <PopoverTrigger asChild>
                                <Button disabled={processing} variant="outline" role="combobox" aria-expanded={openProgrammers} className="w-full justify-between" >
                                    Search Users...
                                    <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                                </Button>
                            </PopoverTrigger>
                            <PopoverContent className="w-full p-0 z-[500]">
                                <Command className="w-full">
                                    <Input placeholder="Search users..." className="w-full" onChange={onSearch} value={search} />
                                    <CommandGroup className="w-full max-h-48 overflow-y-auto">
                                        {(employees||[]).map((user) => (
                                            <CommandItem className="w-full"
                                                key={user.idno}
                                                onSelect={() => {
                                                    addProgrammer(user);
                                                    setOpenProgrammers(false);
                                                }}>
                                                <span className="capitalize">{`${user.first_name} ${user.last_name}`}</span>
                                                <CheckIcon className={cn( "ml-auto h-4 w-4", data.programmers.findIndex(({idno})=>idno===user.idno)>-1 ? "opacity-100" : "opacity-0")}/>
                                            </CommandItem>
                                        ))}
                                        {isLoading&&searchValue.length>2&&<div className="w-full flex items-center gap-x-2"><Loader2 className="h-5 w-5 animate-spin" /><span>Loading Users...</span></div>}
                                    </CommandGroup>
                                </Command>
                            </PopoverContent>
                        </Popover>
                        <div className="flex flex-col gap-y-1 w-full">
                            {
                                data.programmers.map((user) => (
                                    <div key={user.idno} className="flex items-center justify-between ">
                                        <span className="capitalize text-sm">{`${user.first_name} ${user.last_name}`}</span>
                                        <Button disabled={processing} type="button" variant='destructive' size='sm'     onClick={()=>setData(val=>({...val,programmers:val.programmers.filter(({idno})=>idno!==user.idno)} ) )}> Remove </Button>
                                    </div>
                                ))
                            }
                        </div>
                    </div>  */}
                    {/* <div className="space-y-1.5">
                        <Label >Testers</Label>
                        <Popover open={openTesters} onOpenChange={setOpenTesters}>
                            <PopoverTrigger asChild>
                                <Button disabled={processing} variant="outline" role="combobox" aria-expanded={openTesters} className="w-full justify-between" >
                                    Search Users...
                                    <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                                </Button>
                            </PopoverTrigger>
                            <PopoverContent className="w-full p-0 z-[500]">
                                <Command className="w-full">
                                    <Input placeholder="Search users..." className="w-full" onChange={onSearch} value={search} />
                                    <CommandGroup className="w-full max-h-48 overflow-y-auto">
                                        {(employees||[]).map((user) => (
                                            <CommandItem className="w-full"
                                                key={user.idno}
                                                onSelect={() => {
                                                    addTester(user);
                                                    setOpenTesters(false);
                                                }}>
                                                <span className="capitalize">{`${user.first_name} ${user.last_name}`}</span>
                                                <CheckIcon className={cn( "ml-auto h-4 w-4", data.testers.findIndex(({idno})=>idno===user.idno)>-1 ? "opacity-100" : "opacity-0")}/>
                                            </CommandItem>
                                        ))}
                                        {isLoading&&searchValue.length>2&&<div className="w-full flex items-center gap-x-2"><Loader2 className="h-5 w-5 animate-spin" /><span>Loading Users...</span></div>}
                                    </CommandGroup>
                                </Command>
                            </PopoverContent>
                        </Popover>
                        <div className="flex flex-col gap-y-1 w-full">
                            {
                                data.testers.map((user) => (
                                    <div key={user.idno} className="flex items-center justify-between">
                                        <span className="capitalize text-sm">{`${user.first_name} ${user.last_name}`}</span>
                                        <Button disabled={processing} type="button" variant='destructive' size='sm'     onClick={()=>setData(val=>({...val,testers:val.testers.filter(({idno})=>idno!==user.idno)} ) )}> Remove </Button>
                                    </div>
                                ))
                            }
                        </div>
                    </div>    */}
                </form>
                <DialogFooter>
                    <Button form='new_program' type="submit" disabled={processing}>
                        {processing && <Loader2 className="h-5 w-5 mr-2 animate-spin" />}
                        Save changes                    
                         </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
}
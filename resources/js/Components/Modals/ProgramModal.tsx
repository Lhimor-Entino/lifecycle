import { useProgramModal } from "@/Hooks/useProgramModal";
import { Button } from "../ui/button";
import { Sheet, SheetClose, SheetContent, SheetDescription, SheetFooter, SheetHeader, SheetTitle } from "../ui/sheet";
import { Label } from "../ui/label";
import { Input } from "../ui/input";
import { useForm, usePage } from "@inertiajs/inertia-react";
import { HrmsInfo, PageProps } from "@/types";
import { ChangeEventHandler, FormEventHandler, useEffect, useState } from "react";
import { CalendarIcon, CheckIcon, ChevronsUpDown, ChevronsUpDownIcon, Loader2 } from "lucide-react";
import { Page } from "@inertiajs/inertia";
import { Popover, PopoverContent, PopoverTrigger } from "../ui/popover";
import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem } from "../ui/command";
import { cn } from "@/lib/utils";
import { format } from "date-fns";
import { Calendar } from "../ui/calendar";
import { Textarea } from "../ui/textarea";
import { useQuery } from "@tanstack/react-query";
import { useDebounceValue } from "usehooks-ts";
import axios from "axios";
import { toast } from "sonner";
import TestPlanEmail from "@/Pages/ProgramComponents/TestPlanEmail";
import NoEmailAlert from "./NoEmailAlert";

const ProgramModal = () => {
    const {isOpen,onClose,program,project_id} = useProgramModal();
    const {programs} = usePage<Page<PageProps>>().props
    const [openProgrammers, setOpenProgrammers] = useState(false);
    const [openTesters, setOpenTesters] = useState(false);
    const [openDepartments,setOpenDepartments] = useState(false);
    const {departments,software_testers} = usePage<Page<PageProps>>().props;
    const [openNoEmailAlert,setOpenNoEmailAlert] = useState(false)
    const {users_with_no_email} = usePage<Page<PageProps>>().props
    const [showTestPlanEmail,setShowTestPlanEmail] = useState(false)
    const [submitted,setSubmitted] = useState(false)
    const {data,setData,processing,post}  = useForm({
        project_id:0,
        name:'',
        department:'',
        date_prepared: '',
        scope_of_testing:'',
        test_strategy:'',
        testing_schedule:'',
        resources_needed:'',
        system_deadline:'',

        programmers:[] as HrmsInfo[],
        testers:[] as HrmsInfo[],
    });

    
    const [searchValue,setSearchValue] = useDebounceValue("", 500);
    const [search,setSearch] = useState('');

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

    const addProgrammer = (user:HrmsInfo) => {

        // console.log(user);

        // if(user.work_email.length < 1) {
        //     setOpenNoEmailAlert(true)
        // }
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
        if(!isOpen ) return;        
        if(!project_id) return;

        const formattedProgrammers:HrmsInfo[] = (program?.program_programmers||[]).map(({company_id,first_name,last_name,department,position,email})=>({idno:company_id,first_name,last_name,department,job_job_title:position,work_email:email||""}));;
        const formattedTesters:HrmsInfo[] = (program?.program_testers||[]).map(({company_id,first_name,last_name,department,position,email})=>({idno:company_id,first_name,last_name,department,job_job_title:position,work_email:email||""}));;
        setData(val=>({...val,project_id,programmers:formattedProgrammers,testers:formattedTesters,date_prepared:program?.date_prepared||format(new Date,'yyyy-MM-dd'),...program}));
        
    },[isOpen,project_id,program]);


    const onSubmit:FormEventHandler<HTMLFormElement> = e =>{
        e.preventDefault();
    
        if(data.project_id===0) return toast.error('Sysmtem error, please refresh the page and try again.');
        if(data.programmers.length===0) return toast.error('Please add at least one programmer.');
        // if(data.testers.length===0) return toast.error('Please add at least one tester.');
        if(!data.name) return toast.error('Please enter the program name.');
        if(!data.department) return toast.error('Please select the department.');
        if(!data.date_prepared) return toast.error('Please select the date prepared.');
        

        const href = !!program?route('programs.update',{id:program.id}):route('programs.store');

        post(href,{
            onSuccess:()=>{
                onClose();
                toast.success('Test Plan Set!');
                setOpenNoEmailAlert(true)
                setSubmitted(true)
                // Example sequential calls
  
            },
            onError:()=>toast.error('An error occured, please try again later.')
        });
    }


    useEffect(() => {

        const testers_:HrmsInfo[] = software_testers.map((st) => (
            {
                job_job_title : st.position,
                idno : st.company_id,
                last_name : st.last_name,
                first_name : st.first_name,
                picture_location : st.photo,
                department : st.department,
                work_email : st.email || ""
            }
        ))
                setData("testers", testers_);
    },[data.name])


    useEffect(() => {
            if (users_with_no_email.length === 0 ){
                setShowTestPlanEmail(true)
            }
    },[users_with_no_email])
    return (
        <>
        <Sheet open={isOpen}  modal >
            <SheetContent className="h-full flex flex-col bg-background z-[200] min-w-[100vw] md:min-w-[50vw] " side='left'>
                <SheetHeader className="h-auto px-3.5">
                    <SheetTitle> TEST PLAN </SheetTitle>
                    <SheetDescription>
                        {!program?'Fill in the form below to add a new program.':'Edit the form below to update the program details.'}
                    </SheetDescription>
                </SheetHeader>
                <form onSubmit={onSubmit} id='program' className="flex flex-col gap-y-2.5 flex-1 overflow-y-auto px-3.5">
                    <div className="space-y-1.5">
                        <Label>Program Name</Label>
                        <Input autoFocus required  autoComplete="off" disabled={processing} value={data.name} onChange={({target})=>setData('name',target.value)} />
                    </div>
                    <div className="space-y-1.5">
                        <Label>Department</Label>
                        <Popover open={openDepartments} onOpenChange={setOpenDepartments}>
                            <PopoverTrigger asChild>
                                <Button variant="outline" disabled={processing} role="combobox" aria-expanded={openDepartments} className="w-full justify-between">
                                {data.department || "Select department..."}
                                <ChevronsUpDownIcon className="ml-2 h-5 w-5 shrink-0 opacity-50" />
                                </Button>
                            </PopoverTrigger>
                            <PopoverContent className="w-full p-0 z-[500]">
                                <Command>
                                    <CommandInput placeholder="Search department..." className="h-9" />
                                    <CommandEmpty>No department found.</CommandEmpty>
                                    <CommandGroup className="max-h-52 overflow-y-auto">
                                        {departments.map(({id,name}) => (
                                            <CommandItem
                                                key={id}
                                                onSelect={() => {
                                                    setData('department',name);
                                                    setOpenDepartments(false);
                                                }}>
                                                {name}
                                                <CheckIcon
                                                className={cn(
                                                    "ml-auto h-5 w-5",
                                                    data.department === name ? "opacity-100" : "opacity-0"
                                                )}
                                                />
                                            </CommandItem>
                                        ))}
                                    </CommandGroup>
                                </Command>
                            </PopoverContent>
                        </Popover>
                    </div>
                    <div className="space-y-1.5">
                        <Label>Date Prepared</Label>
                        <Popover>
                            <PopoverTrigger asChild>
                                <Button variant={"outline"} className={cn("w-full justify-start text-left font-normal",!data.date_prepared && "text-muted-foreground")}>
                                <CalendarIcon className="mr-2 h-4 w-4" />
                                {data.date_prepared ? format(data.date_prepared, "PPP") : <span>Pick a date</span>}
                                </Button>
                            </PopoverTrigger>
                            <PopoverContent className="w-auto p-0 z-[500]" align="start">
                                <Calendar mode="single" selected={new Date(data.date_prepared)} onSelect={e=>e&&setData('date_prepared',format(e,'yyyy-MM-dd'))} initialFocus/>
                            </PopoverContent>
                        </Popover>
                    </div>
                    <div className="space-y-1.5">
                        <Label>Scope of Testing</Label>
                        <Textarea rows={2}  autoComplete="off" disabled={processing} value={data.scope_of_testing||""} onChange={({target})=>setData('scope_of_testing',target.value)} />
                    </div>
                    <div className="space-y-1.5">
                        <Label>Test Strategy</Label>
                        <Textarea rows={2}  autoComplete="off" disabled={processing} value={data.test_strategy||""} onChange={({target})=>setData('test_strategy',target.value)} />
                    </div>
                    <div className="space-y-1.5">
                        <Label>Testing Schedule</Label>
                        <Popover>
                            <PopoverTrigger asChild>
                                <Button variant={"outline"} className={cn("w-full justify-start text-left font-normal",!data.testing_schedule && "text-muted-foreground")}>
                                <CalendarIcon className="mr-2 h-4 w-4" />
                                {data.testing_schedule ? format(data.testing_schedule, "PPP") : <span>Pick a date</span>}
                                </Button>
                            </PopoverTrigger>
                            <PopoverContent className="w-auto p-0 z-[500]" align="start">
                                <Calendar mode="single" selected={new Date(data.testing_schedule)} onSelect={e=>e&&setData('testing_schedule',format(e,'yyyy-MM-dd'))} initialFocus/>
                            </PopoverContent>
                        </Popover>
                    </div>                    
                    <div className="space-y-1.5">
                        <Label>Resources Needed</Label>
                        <Textarea rows={2}  autoComplete="off" disabled={processing} value={data.resources_needed||""} onChange={({target})=>setData('resources_needed',target.value)} />
                    </div>
                    <div className="space-y-1.5">
                        <Label>System Deadline</Label>
                        <Popover>
                            <PopoverTrigger asChild>
                                <Button variant={"outline"} className={cn("w-full justify-start text-left font-normal",!data.system_deadline && "text-muted-foreground")}>
                                <CalendarIcon className="mr-2 h-4 w-4" />
                                {data.system_deadline ? format(data.system_deadline, "PPP") : <span>Pick a date</span>}
                                </Button>
                            </PopoverTrigger>
                            <PopoverContent className="w-auto p-0 z-[500]" align="start">
                                <Calendar mode="single" selected={new Date(data.system_deadline)} onSelect={e=>e&&setData('system_deadline',format(e,'yyyy-MM-dd'))} initialFocus/>
                            </PopoverContent>
                        </Popover>
                    </div>
                    <div className="space-y-1.5">
                        <Label >Programmers</Label>
                        <Popover open={openProgrammers} onOpenChange={setOpenProgrammers}>
                            <PopoverTrigger asChild>
                                <Button disabled={processing} variant="outline" role="combobox" aria-expanded={openProgrammers} className="w-full justify-between" >
                                    Search Users...
                                    <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                                </Button>
                            </PopoverTrigger>
                            <PopoverContent className="w-full p-3.5 z-[200]">
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
                                    <div key={user.idno} className="flex items-center justify-between">
                                        <span className="capitalize text-sm">{`${user.first_name} ${user.last_name}`}</span>
                                        <Button disabled={processing} type="button" variant='destructive' size='sm'     onClick={()=>setData(val=>({...val,programmers:val.programmers.filter(({idno})=>idno!==user.idno)} ) )}> Remove </Button>
                                    </div>
                                ))
                            }
                        </div>
                    </div> 
                    <div className="space-y-1.5">
                        <Label >Testers</Label>
                        { software_testers.map((st,index) => (
                             <p key={index} className=" font-semibold text-xs mt-2 bg-slate-100 rounded-sm p-3 shadow-sm-">{`${st.first_name} ${st.last_name}`}</p>
                        ))}
                        {/* <Popover open={openTesters} onOpenChange={setOpenTesters}>
                            <PopoverTrigger asChild>
                                <Button disabled={processing} variant="outline" role="combobox" aria-expanded={openTesters} className="w-full justify-between" >
                                    Search Users...
                                    <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                                </Button>
                            </PopoverTrigger>
                            <PopoverContent className="w-full p-3.5 z-[200]">
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
                        </div> */}
                    </div>      
                </form>
                <SheetFooter className="h-auto px-3.5">
                    <Button variant='outline' disabled={processing} onClick={onClose}>
                        Cancel
                    </Button>   
                    <Button form="program" disabled={processing} type="submit">
                        {processing? <Loader2 className="animate-spin h-5 w-5" />:'Save Test Plan'}
                    </Button>                    
                </SheetFooter>
            </SheetContent>
        </Sheet>
        


        {
         showTestPlanEmail && submitted && <TestPlanEmail program={programs} isOpen={showTestPlanEmail} onClose={()=>setShowTestPlanEmail(false)} setSubmitted={setSubmitted} /> 
        }
        {
         openNoEmailAlert && <NoEmailAlert />
        }
        


        
      
    </>
    )
}
export default ProgramModal
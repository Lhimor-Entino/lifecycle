import { Button } from '@/Components/ui/button';
import { Calendar } from '@/Components/ui/calendar';
import { Checkbox } from '@/Components/ui/checkbox';
import { Command, CommandGroup, CommandItem } from '@/Components/ui/command';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@/Components/ui/dialog';
import { Input } from '@/Components/ui/input';
import { Label } from '@/Components/ui/label';
import { Popover, PopoverContent, PopoverTrigger } from '@/Components/ui/popover';
import { Textarea } from '@/Components/ui/textarea';
import { cn } from '@/lib/utils';
import { HrmsInfo, PageProps, Program, User } from '@/types';
import { Page } from '@inertiajs/inertia';
import { useForm, usePage } from '@inertiajs/inertia-react';
import { useQuery } from '@tanstack/react-query';
import axios from 'axios';
import { parse,format, formatDate } from 'date-fns';
// import { format } from 'date-fns';
import { CalendarIcon, CheckIcon, ChevronsUpDown, Loader2 } from 'lucide-react';
import {ChangeEventHandler, FC, FormEventHandler, useEffect, useState} from 'react';
import { toast } from 'sonner';
import { useDebounceValue } from 'usehooks-ts';

interface Props {
    program:Program;
    open:boolean;
    onClose:()=>void;
}

const NewCrModal:FC<Props> = ({program,open,onClose}) => {
    
    const [openUsers, setOpenUsers] = useState(false);
    const [openCompletedBy, setOpenCompletedBy] = useState(false);
    const [openNotedBy, setOpenNotedBy] = useState(false);
    const [searchValue,setSearchValue] = useDebounceValue("", 500);
    const [search,setSearch] = useState('');

    const {pc_head,software_manager, auth} = usePage<Page<PageProps>>().props
    const onSearch:ChangeEventHandler<HTMLInputElement> = ({target}) =>{
        const {value} = target
        setSearch(value);
        setSearchValue(value);
    }
    const {isError,isLoading,data:employees,refetch,isFetched} = useQuery({
        queryKey:['search_head',searchValue],  
        queryFn: (search) => axios.get(route('hrms.search',{search:search.queryKey[1]})).then((res):HrmsInfo[]=>res.data),
        enabled:false
    });
    const {data,setData,processing,reset,post} = useForm({
        title:'',
        description:'',
        client_request:0,
        incident_or_problem_resolution:0,
        enhancement:0,
        business_requirement:0,
        procedural:0,
        others:0,
        others_description:'',
        schedule:'',
        hardware:'',
        software:'',
        manpower:'',
        location:'',
        office_equipment:'',
        other:'',
        risk_impact_analysis_people:'',
        risk_impact_analysis_affected_system:'',
        risk_impact_analysis_schedule:'',
        risk_impact_analysis_equipment:'',
        risk_impact_analysis_overall_impact:'' as 'low'|'medium'|'high'|'',
        rollback_plan:'',
        review_result:0 as 1|2|3|0,
        reason:'',
        head: pc_head,
        review_date:'',
        completion_details:'',
        actual_start:'',
        actual_end:'',
        total_actual_duration:'',
        remarks:'',
        completed_by:software_manager,
        completed_by_date:'',
        noted_by: auth.user,
        noted_by_date:'',
    });
    

    const setClientRequest = () =>{
        //set client_request to 1 and incident_or_problem_resolution,enhancement,business_requirement,procedural,others to 0
        setData(val=>({...val,client_request:1,incident_or_problem_resolution:0,enhancement:0,business_requirement:0,procedural:0,others:0}));
    }
    const setIncidentOrProblemResolution = () =>{
        //set incident_or_problem_resolution to 1 and client_request,enhancement,business_requirement,procedural,others to 0
        setData(val=>({...val,client_request:0,incident_or_problem_resolution:1,enhancement:0,business_requirement:0,procedural:0,others:0}));
    }
    const setEnhancement = () =>{
        //set enhancement to 1 and client_request,incident_or_problem_resolution,business_requirement,procedural,others to 0
        setData(val=>({...val,client_request:0,incident_or_problem_resolution:0,enhancement:1,business_requirement:0,procedural:0,others:0}));
    }
    const setBusinessRequirement = () =>{
        //set business_requirement to 1 and client_request,incident_or_problem_resolution,enhancement,procedural,others to 0
        setData(val=>({...val,client_request:0,incident_or_problem_resolution:0,enhancement:0,business_requirement:1,procedural:0,others:0}));
    }
    const setProcedural = () =>{
        //set procedural to 1 and client_request,incident_or_problem_resolution,enhancement,business_requirement,others to 0
        setData(val=>({...val,client_request:0,incident_or_problem_resolution:0,enhancement:0,business_requirement:0,procedural:1,others:0}));
    }
    const setOthers = () =>{
        //set others to 1 and client_request,incident_or_problem_resolution,enhancement,business_requirement,procedural to 0
        setData(val=>({...val,client_request:0,incident_or_problem_resolution:0,enhancement:0,business_requirement:0,procedural:0,others:1}));
    }

    const setResourceDescription = (val:string) => setData('others_description',val);

    useEffect(()=>{
        if(searchValue.length<3) return;
        refetch();
    },[searchValue]);


    const onSubmit:FormEventHandler<HTMLFormElement> = e =>{
        e.preventDefault()
        // console.log(data)
        
       // return;

        const href = route('changeMngt.store',{program_id:program.id,bus_req_doc_id:program.project.business_requirement_document})

        post(href,{
            onSuccess:()=>{
                onClose(); 
                toast.success('Change request added.');
            },
            onError: () => toast.error("An error occured, please try again later.")
        } )
    }

    const formatDate_ = (date: Date) => {
        const parsedDate = parse(date.toString(), 'EEE MMM dd yyyy HH:mm:ss \'GMT\'XXX (zzzz)', new Date());
            return format(parsedDate,"yyyy-MM-dd")
    }
    return (
        <Dialog modal open={open} onOpenChange={onClose}>
            <DialogContent className='max-w-[90vw] max-h-[95vh] h-full flex flex-col space-x-1.5'>
                <DialogHeader className='h-auto'>
                    <DialogTitle>Change Management Request Form</DialogTitle>
                    <DialogDescription>
                        New Change Management Request 
                    </DialogDescription>
                </DialogHeader>
                <form onSubmit={onSubmit} className='flex flex-col gap-y-3.5 flex-1 overflow-y-auto relative pr-6 pb-6'>
                    <div className='space-y-1'>
                        <Label>Change Proposal Title</Label>
                        <Input required disabled={processing} autoFocus value={data.title} onChange={(e)=>setData('title',e.target.value)} />
                    </div>
                    <div className='space-y-1'>
                        <Label>Change Description</Label>
                        <Textarea rows={2} required disabled={processing} value={data.description} onChange={(e)=>setData('description',e.target.value)}  />
                    </div>
                    <div className='flex flex-col gap-y-2'>
                        <Label>Source of Change Request</Label>
                        
                            <div className='flex items-center'>
                                <div className='flex flex-col gap-y-2.5 w-1/2'>
                                    <div className="flex items-center space-x-2">
                                        <Checkbox onCheckedChange={setClientRequest} checked={data.client_request===1} disabled={processing}  id="client_request" />
                                        <label
                                            htmlFor="client_request"
                                            className="text-sm font-light leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                                        >
                                            Client Request
                                        </label>
                                    </div>
                                    <div className="flex items-center space-x-2">
                                        <Checkbox onCheckedChange={setIncidentOrProblemResolution} checked={data.incident_or_problem_resolution===1} disabled={processing}  id="incident" />
                                        <label
                                            htmlFor="incident"
                                            className="text-sm font-light leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                                        >
                                            Incident or Problem Resolution
                                        </label>
                                    </div>
                                    <div className="flex items-center space-x-2">
                                        <Checkbox onCheckedChange={setEnhancement} checked={data.enhancement===1} disabled={processing}  id="enhancement" />
                                        <label
                                            htmlFor="enhancement"
                                            className="text-sm font-light leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                                        >
                                            Enhancement
                                        </label>
                                    </div>
                                </div>
                                <div className='flex flex-col gap-y-2.5 flex-1'>
                                    <div className="flex items-center space-x-2">
                                        <Checkbox onCheckedChange={setBusinessRequirement} checked={data.business_requirement===1} disabled={processing}  id="business_requirement" />
                                        <label
                                            htmlFor="business_requirement"
                                            className="text-sm font-light leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                                        >
                                            Business Requirement
                                        </label>
                                    </div>
                                    <div className="flex items-center space-x-2">
                                        <Checkbox onCheckedChange={setProcedural} checked={data.procedural===1} disabled={processing}  id="procedural" />
                                        <label
                                            htmlFor="procedural"
                                            className="text-sm font-light leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                                        >
                                            Procedural
                                        </label>
                                    </div>
                                    <div className="flex items-center space-x-2">
                                        <Checkbox onCheckedChange={setOthers} checked={data.others===1} disabled={processing}  id="others" />
                                        <label
                                            htmlFor="others"
                                            className="text-sm font-light leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                                        >
                                            Others
                                        </label>
                                        <Input className='!h-9' disabled={processing||data.others!==1} value={data.others_description} onChange={(e)=>setResourceDescription(e.target.value)} />
                                    </div>
                                </div>
                                
                            </div>
                        
                    </div>
                    <div className='flex flex-col gap-y-1'>
                        <Label>Schedule</Label>
                        <Popover>
                            <PopoverTrigger asChild>
                                <Button
                                variant={"outline"}
                                className={cn(
                                    "w-full justify-start text-left font-normal",
                                    !data.schedule && "text-muted-foreground"
                                )}
                                >
                                <CalendarIcon className="mr-2 h-4 w-4" />
                                {data.schedule ? format(new Date(data.schedule), "PPP") : <span>Pick a date</span>}
                              
                                </Button>
                            </PopoverTrigger>
                            <PopoverContent className="w-auto p-0">
                                <Calendar
                                mode="single"
                                 selected={new Date(data.schedule)}
                                 onSelect={e => e && setData('schedule',format(e,"yyyy-MM-dd"))}
                                initialFocus
                                />
                            </PopoverContent>
                        </Popover>
                    </div>
                    <div className='flex flex-col gap-y-2'>
                        <Label>Resource Requirements</Label>
                        <div className='flex items-center gap-x-2.5'>
                            <div className='w-1/2 flex flex-col gap-y-2.5'>
                                <div className='space-y-1'>
                                    <Label>Hardware</Label>
                                    <Input disabled={processing} value={data.hardware} onChange={(e)=>setData('hardware',e.target.value)} />
                                </div>
                                <div className='space-y-1'>
                                    <Label>Manpower</Label>
                                    <Input disabled={processing} value={data.manpower} onChange={(e)=>setData('manpower',e.target.value)} />
                                </div>
                                <div className='space-y-1'>
                                    <Label>Office Equipment</Label>
                                    <Input disabled={processing} value={data.office_equipment} onChange={(e)=>setData('office_equipment',e.target.value)} />
                                </div>

                            </div>
                            <div className='flex-1 flex flex-col gap-y-2.5'>
                                <div className='space-y-1'>
                                    <Label>Software</Label>
                                    <Input disabled={processing} value={data.software} onChange={(e)=>setData('software',e.target.value)} />
                                </div>
                                <div className='space-y-1'>
                                    <Label>Location</Label>
                                    <Input disabled={processing} value={data.location} onChange={(e)=>setData('location',e.target.value)} />
                                </div>
                                <div className='space-y-1'>
                                    <Label>Other</Label>
                                    <Input disabled={processing} value={data.other} onChange={(e)=>setData('other',e.target.value)} />
                                </div>
                            </div>
                        </div>
                    </div>
                    <div className='flex flex-col gap-y-2.5'>
                        <Label>Risk Impact Analysis</Label>
                        <div className='space-y-1'>
                            <Label>People (Assess the manpower allocation- availability and skills requirements)</Label>
                            <Input disabled={processing} value={data.risk_impact_analysis_people} onChange={(e)=>setData('risk_impact_analysis_people',e.target.value)} />
                        </div>
                        <div className='space-y-1'>
                            <Label>Affected System (Impact to other systems i.e applications, servers, etc.)</Label>
                            <Input disabled={processing} value={data.risk_impact_analysis_affected_system} onChange={(e)=>setData('risk_impact_analysis_affected_system',e.target.value)} />
                        </div>
                        <div className='space-y-1'>
                            <Label>Schedule (feasibility of the schedule)</Label>
                            <Input disabled={processing} value={data.risk_impact_analysis_schedule} onChange={(e)=>setData('risk_impact_analysis_schedule',e.target.value)} />
                        </div>
                        <div className='space-y-1'>
                            <Label>Equipment (availability):</Label>
                            <Input disabled={processing} value={data.risk_impact_analysis_equipment} onChange={(e)=>setData('risk_impact_analysis_equipment',e.target.value)} />
                        </div>
                        <div className='flex items-center justify-evenly'>
                            <div className="flex items-center space-x-2">
                                <Checkbox onCheckedChange={()=>setData('risk_impact_analysis_overall_impact','low')} checked={data.risk_impact_analysis_overall_impact==='low'} disabled={processing}  id="low" />
                                <label
                                    htmlFor="low"
                                    className="text-sm font-light leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                                >
                                    Low
                                </label>
                            </div>
                            <div className="flex items-center space-x-2">
                                <Checkbox onCheckedChange={()=>setData('risk_impact_analysis_overall_impact','medium')} checked={data.risk_impact_analysis_overall_impact==='medium'} disabled={processing}  id="medium" />
                                <label
                                    htmlFor="medium"
                                    className="text-sm font-light leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                                >
                                    Medium
                                </label>
                            </div>
                            <div className="flex items-center space-x-2">
                                <Checkbox onCheckedChange={()=>setData('risk_impact_analysis_overall_impact','high')} checked={data.risk_impact_analysis_overall_impact==='high'} disabled={processing}  id="high" />
                                <label
                                    htmlFor="high"
                                    className="text-sm font-light leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                                >
                                    High
                                </label>
                            </div>
                        </div>
                    </div>
                    <div className='space-y-1'>
                        <Label>Rollback Plan</Label>
                        <Textarea rows={2} disabled={processing} value={data.rollback_plan} onChange={(e)=>setData('rollback_plan',e.target.value)} />
                    </div>
                    <div className='flex flex-col gap-y-2.5'>
                        <Label>Review Result</Label>
                        <div className='flex items-center justify-evenly'>
                            <div className="flex items-center space-x-2">
                                <Checkbox onCheckedChange={()=>setData('review_result',1)} checked={data.review_result===1} disabled={processing}  id="approve" />
                                <label
                                    htmlFor="approve"
                                    className="text-sm font-light leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                                >
                                    Approve
                                </label>
                            </div>
                            <div className="flex items-center space-x-2">
                                <Checkbox onCheckedChange={()=>setData('review_result',2)} checked={data.review_result===2} disabled={processing}  id="reject" />
                                <label
                                    htmlFor="rejected"
                                    className="text-sm font-light leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                                >
                                    Reject
                                </label>
                            </div>
                            <div className="flex items-center space-x-2">
                                <Checkbox onCheckedChange={()=>setData('review_result',3)} checked={data.review_result===3} disabled={processing}  id="defer" />
                                <label
                                    htmlFor="defer"
                                    className="text-sm font-light leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                                >
                                    Defer Until
                                </label>
                            </div>
                        </div>
                        <div className='space-y-1'>
                            <Label>Reason/s:</Label>
                            <Textarea rows={2} disabled={processing} value={data.reason} onChange={(e)=>setData('reason',e.target.value)} />
                        </div>
                        <div className='space-y-1'>
                            <Label>Head/Supervisor</Label>
                            <p className=' bg-slate-300 w-full p-2 rounded-sm '>{`${data.head[0].first_name} ${data.head[0].last_name}`}</p>
                            {/* <Popover open={openUsers} onOpenChange={setOpenUsers}>
                                <PopoverTrigger asChild>
                                    <Button disabled={processing} variant="outline" role="combobox" aria-expanded={openUsers} className="w-full justify-between" >
                                        {!data.head?'Search User...' : `${data.head.first_name} ${data.head.last_name}`}
                                        <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />

                                    </Button>
                                </PopoverTrigger>
                                <PopoverContent className="w-full p-3.5 !z-[700]">
                                    <Command className="w-full">
                                        <Input placeholder="Search users..." className="w-full" onChange={onSearch} value={search} />
                                        <CommandGroup className="w-full max-h-48 overflow-y-auto">
                                            {(employees||[]).map((user) => (
                                                <CommandItem className="w-full"
                                                    key={user.idno}
                                                    onSelect={() => {
                                                        setData('head',user);
                                                        setOpenUsers(false);
                                                    }}>
                                                    <span className="capitalize">{`${user.first_name} ${user.last_name}`}</span>
                                                    <CheckIcon className={cn( "ml-auto h-4 w-4", data.head?.idno===user.idno ? "opacity-100" : "opacity-0")}/>
                                                </CommandItem>
                                            ))}
                                            {isLoading&&searchValue.length>2&&<div className="w-full flex items-center gap-x-2"><Loader2 className="h-5 w-5 animate-spin" /><span>Loading Users...</span></div>}
                                        </CommandGroup>
                                    </Command>
                                </PopoverContent>
                            </Popover> */}
                        </div>
                        <div className='space-y-1'>
                            <Label>Review Date</Label>
                            <Popover>
                                <PopoverTrigger asChild>
                                    <Button
                                    variant={"outline"}
                                    className={cn(
                                        "w-full justify-start text-left font-normal",
                                        !data.review_date && "text-muted-foreground"
                                    )}
                                    >
                                    <CalendarIcon className="mr-2 h-4 w-4" />
                                    {data.review_date ? format(new Date(data.review_date), "PPP") : <span>Pick a date</span>}
                                    </Button>
                                </PopoverTrigger>
                                <PopoverContent className="w-auto p-0">
                                    <Calendar
                                    mode="single"
                                    selected={new Date(data.review_date)}
                                    onSelect={e=>e&&setData('review_date',format(e,'yyyy-MM-dd'))}
                                    initialFocus
                                    />
                                </PopoverContent>
                            </Popover>
                        </div>
                    </div>

                    <div className='flex flex-col gap-y-2.5'>
                        <Label>Implementation Report</Label>
                        <div className='space-y-1'>
                            <Label>Completion Details</Label>
                            <Textarea rows={2} disabled={processing} value={data.completion_details} onChange={(e)=>setData('completion_details',e.target.value)} />
                        </div>
                        <div className='space-y-1'>
                            <Label>Actual Start Date/Time</Label>
                            <Popover>
                                <PopoverTrigger asChild>
                                    <Button
                                    variant={"outline"}
                                    className={cn(
                                        "w-full justify-start text-left font-normal",
                                        !data.actual_start && "text-muted-foreground"
                                    )}
                                    >
                                    <CalendarIcon className="mr-2 h-4 w-4" />
                                    {data.actual_start ? format(new Date(data.actual_start), "PPP") : <span>Pick a date</span>}
                                    </Button>
                                </PopoverTrigger>
                                <PopoverContent className="w-auto p-0">
                                    <Calendar
                                    mode="single"
                                    selected={new Date(data.actual_start)}
                                    onSelect={e=>e&&setData('actual_start',format(e,'yyyy-MM-dd'))}
                                    initialFocus
                                    />
                                </PopoverContent>
                            </Popover>
                        </div>
                        <div className='space-y-1'>
                            <Label>Actual End Date/Time</Label>
                            <Popover>
                                <PopoverTrigger asChild>
                                    <Button
                                    variant={"outline"}
                                    className={cn(
                                        "w-full justify-start text-left font-normal",
                                        !data.actual_end && "text-muted-foreground"
                                    )}
                                    >
                                    <CalendarIcon className="mr-2 h-4 w-4" />
                                    {data.actual_end ? format(new Date(data.actual_end), "PPP") : <span>Pick a date</span>}
                                    </Button>
                                </PopoverTrigger>
                                <PopoverContent className="w-auto p-0">
                                    <Calendar
                                    mode="single"
                                    selected={new Date(data.actual_end)}
                                    onSelect={e=>e&&setData('actual_end',format(e,'yyyy-MM-dd'))}
                                    initialFocus
                                    />
                                </PopoverContent>
                            </Popover>
                        </div>
                    </div>
                    <div className='space-y-1'>
                        <Label>Remarks</Label>
                        <Textarea rows={2} disabled={processing} value={data.remarks} onChange={(e)=>setData('remarks',e.target.value)} />
                    </div>
                    <div className='flex items-center gap-x-2 '>
                        <div className='space-y-1 w-1/2'>
                            <Label>Completed By</Label>
                            <p className=' bg-slate-300 w-full p-2 rounded-sm '>{`${data.completed_by.first_name} ${data.completed_by.last_name}`}</p>
                            {/* <Popover open={openCompletedBy} onOpenChange={setOpenCompletedBy}>
                                <PopoverTrigger asChild>
                                    <Button disabled={processing} variant="outline" role="combobox" aria-expanded={openCompletedBy} className="w-full justify-between" >
                                        {!data.completed_by?'Search User...' : `${data.completed_by.first_name} ${data.completed_by.last_name}`}
                                        <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                                    </Button>
                                </PopoverTrigger>
                                <PopoverContent className="w-full p-3.5 !z-[700]">
                                    <Command className="w-full">
                                        <Input placeholder="Search users..." className="w-full" onChange={onSearch} value={search} />
                                        <CommandGroup className="w-full max-h-48 overflow-y-auto">
                                            {(employees||[]).map((user) => (
                                                <CommandItem className="w-full"
                                                    key={user.idno}
                                                    onSelect={() => {
                                                        setData('completed_by',user);
                                                        setOpenCompletedBy(false);
                                                    }}>
                                                    <span className="capitalize">{`${user.first_name} ${user.last_name}`}</span>
                                                    <CheckIcon className={cn( "ml-auto h-4 w-4", data.completed_by?.idno===user.idno ? "opacity-100" : "opacity-0")}/>
                                                </CommandItem>
                                            ))}
                                            {isLoading&&searchValue.length>2&&<div className="w-full flex items-center gap-x-2"><Loader2 className="h-5 w-5 animate-spin" /><span>Loading Users...</span></div>}
                                        </CommandGroup>
                                    </Command>
                                </PopoverContent>
                            </Popover> */}
                        </div>
                        <div className='flex-1 space-y-1'>
                            <Label>Completed By Date</Label>
                            <Popover>
                                <PopoverTrigger asChild>
                                    <Button
                                    variant={"outline"}
                                    className={cn(
                                        "w-full justify-start text-left font-normal",
                                        !data.completed_by_date && "text-muted-foreground"
                                    )}
                                    >
                                    <CalendarIcon className="mr-2 h-4 w-4" />
                                    {data.completed_by_date ? format(new Date(data.completed_by_date), "PPP") : <span>Pick a date</span>}
                                    </Button>
                                </PopoverTrigger>
                                <PopoverContent className="w-auto p-0">
                                    <Calendar
                                    mode="single"
                                    selected={new Date(data.completed_by_date)}
                                    onSelect={e=>e&&setData('completed_by_date',format(e,'yyyy-MM-dd'))}
                                    initialFocus
                                    />
                                </PopoverContent>
                            </Popover>
                        </div>

                    </div>
                    <div className='flex items-center gap-x-2 '>
                        <div className='space-y-1 w-1/2'>
                            <Label>Noted By</Label>
                            <p className=' bg-slate-300 w-full p-2 rounded-sm '>{`${data.noted_by.first_name} ${data.noted_by.last_name}`}</p>
                            {/* <Popover open={openNotedBy} onOpenChange={setOpenNotedBy}>
                                <PopoverTrigger asChild>
                                    <Button disabled={processing} variant="outline" role="combobox" aria-expanded={openNotedBy} className="w-full justify-between" >
                                        {!data.noted_by?'Search User...' : `${data.noted_by.first_name} ${data.noted_by.last_name}`}
                                        <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                                    </Button>
                                </PopoverTrigger>
                                <PopoverContent className="w-full p-3.5 !z-[700]">
                                    <Command className="w-full">
                                        <Input placeholder="Search users..." className="w-full" onChange={onSearch} value={search} />
                                        <CommandGroup className="w-full max-h-48 overflow-y-auto">
                                            {(employees||[]).map((user) => (
                                                <CommandItem className="w-full"
                                                    key={user.idno}
                                                    onSelect={() => {
                                                        setData('noted_by',user);
                                                        setOpenNotedBy(false);
                                                    }}>
                                                    <span className="capitalize">{`${user.first_name} ${user.last_name}`}</span>
                                                    <CheckIcon className={cn( "ml-auto h-4 w-4", data.noted_by?.idno===user.idno ? "opacity-100" : "opacity-0")}/>
                                                </CommandItem>
                                            ))}
                                            {isLoading&&searchValue.length>2&&<div className="w-full flex items-center gap-x-2"><Loader2 className="h-5 w-5 animate-spin" /><span>Loading Users...</span></div>}
                                        </CommandGroup>
                                    </Command>
                                </PopoverContent>
                            </Popover> */}
                        </div>
                        <div className='flex-1 space-y-1'>
                            <Label>Noted By Date</Label>
                            <Popover>
                                <PopoverTrigger asChild>
                                    <Button
                                    variant={"outline"}
                                    className={cn(
                                        "w-full justify-start text-left font-normal",
                                        !data.noted_by_date && "text-muted-foreground"
                                    )}
                                    >
                                    <CalendarIcon className="mr-2 h-4 w-4" />
                                    {data.noted_by_date ? format(new Date(data.noted_by_date), "PPP") : <span>Pick a date</span>}
                                    </Button>
                                </PopoverTrigger>
                                <PopoverContent className="w-auto p-0">
                                    <Calendar
                                    mode="single"
                                    selected={new Date(data.noted_by_date)}
                                    onSelect={e=>e&&setData('noted_by_date',format(e,'yyyy-MM-dd'))}
                                    initialFocus
                                    />
                                </PopoverContent>
                            </Popover>
                        </div>
                    </div>
                    <Button disabled={processing} size='sm' className='mt-[3.5rem] p-2 font-boldbg-slate-300text-slate-950hover:bg-slate-700 text-slate-100 bg-slate-700 dark:bg-slate-100
                    dark:hover:bg-slate-700 dark:text-slate-700 dark:hover:text-slate-100
                    hover:bg-slate-400 transition duration-300'  variant='outline'>
                            {processing && <Loader2 className='w-5 h-5 animate-spin' />}
                            {/* {program.techinical_requirement_document?'Update':'Create'} */}
                            Create
                        </Button>
                </form>
            </DialogContent>
        </Dialog>
    );
};

export default NewCrModal;
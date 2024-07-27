import { Button } from '@/Components/ui/button';
import { Calendar } from '@/Components/ui/calendar';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '@/Components/ui/dialog';
import { Label } from '@/Components/ui/label';
import { Popover, PopoverContent, PopoverTrigger } from '@/Components/ui/popover';
import { cn } from '@/lib/utils';
import { Program } from '@/types';
import { Inertia } from '@inertiajs/inertia';
import { format } from 'date-fns';
import { Calculator, CalendarIcon, CheckIcon, ChevronsUpDown, CreditCard, InfoIcon, Loader2, MailCheckIcon, MailXIcon, Settings, Smile, Trash2, User } from 'lucide-react';
import {FC, useEffect, useState, ChangeEventHandler, FormEventHandler} from 'react';
import { toast } from 'sonner';

import { Input } from "@/Components/ui/input";
import { useForm, usePage } from "@inertiajs/inertia-react";
import { HrmsInfo, PageProps } from "@/types";
import { Page } from "@inertiajs/inertia";

import { useQuery } from "@tanstack/react-query";
import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem, CommandList, CommandSeparator, CommandShortcut } from "@/Components/ui/command";
import axios from "axios";
import { useDebounceValue } from "usehooks-ts";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/Components/ui/tooltip';
import { Separator } from '@/Components/ui/separator';


interface Props {
    program:Program;
    isOpen:boolean;
    onClose:()=>void;
    hanleOpenSetupScheduleEmail:() => void;

}

const SetupSchedule:FC<Props> = ({program,isOpen,onClose,hanleOpenSetupScheduleEmail}) => {
    const [date, setDate] = useState<Date|undefined>(undefined);
    const [loading, setLoading] = useState(false);
    
    const [openProgrammers, setOpenProgrammers] = useState(false);
    const [openTesters, setOpenTesters] = useState(false);
    const [openDepartments,setOpenDepartments] = useState(false);
    const [searchValue,setSearchValue] = useDebounceValue("", 500);
    const [search,setSearch] = useState('');
    const {software_testers,software_manager,pc_head,setup_committee} = usePage<Page<PageProps>>().props
    const [adEmail,setAdEmail] = useState("")
    const {data,setData,processing,post}  = useForm({
        programmers:[] as HrmsInfo[],
        testers:[] as HrmsInfo[],
        additionalAttendees:[] as HrmsInfo[],
        pg : [],
        ts: [],
    });
    const { props } = usePage();
    const { additional_attendees_emails } = props;

    useEffect(()=>{
        if(!isOpen) return;
        const sched = program.program_setup_schedule?new Date(program.program_setup_schedule.date):undefined;
        setDate(sched);
    },[program,isOpen]);

    const onSubmit = () =>{
        
        if (!date) {
            toast.info("Set up date required");
            return;
        } 
        Inertia.post(route('programs.setup_sched'),{
            date,
            program_id:program.id,
            additional_attendees: JSON.stringify(data.additionalAttendees)
        },{
            onStart:()=>setLoading(true),
            onFinish:()=>{
                
                setLoading(false);
                hanleOpenSetupScheduleEmail();
                setData("additionalAttendees",[])
            },
            onSuccess:()=>{
                onClose();
                toast.success('Setup Schedule Updated Successfully');
            },
            onError:()=>toast.error('An error occurred. Please try again later.')
        });
        
    }

    
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
    const addAdditionalAttendees = (user:HrmsInfo) => {

        const attendee_exist = program.additional_attendees.filter(at => at.company_id===user.idno);

        console.log(attendee_exist);
        console.log(program.additional_attendees);
        if(data.additionalAttendees.findIndex(({idno})=>idno===user.idno)>-1) return;
        setData(val=>({...val,additionalAttendees:[...val.additionalAttendees,user]}));
    }
    useEffect(()=>{
        if(searchValue.length<3) return;
        refetch();
    },[searchValue]);

    const hasAdditionalAttendeeWithoutEmail = () => {
        if (data.additionalAttendees.length === 0 ) return false;
        const res = data.additionalAttendees.filter(at => at.work_email !== "");
        return res.length < 1 ? true : false
    }
    const onHandleAddEmail = (index_ : number)=> {

        const updated_additional_attendees : HrmsInfo[] = data.additionalAttendees.map((ad,index) => {
            if (index === index_) {
                return { ...ad, work_email: adEmail }; // Replace newName with the new value you want to set
            }
            return ad; // Return the original object for other indexes
        })

        setAdEmail("")
        
       
        setData("additionalAttendees",updated_additional_attendees)
    }



    return (
        <>
        <Dialog open={isOpen} onOpenChange={onClose} >
            <DialogContent style={{zIndex: 100}}  onInteractOutside={(e) => {
                          e.preventDefault();
                          }}>
                <DialogHeader>
                    <DialogTitle>{program.name}</DialogTitle>
                    <DialogDescription>
                        Input Setup Schedule 
                    </DialogDescription>
                </DialogHeader>
                <Popover>
                    <PopoverTrigger asChild>
                        <Button disabled={loading}
                        variant={"outline"}
                        className={cn(
                            "w-full justify-start text-left font-normal",
                            !date && "text-muted-foreground"
                        )}
                        >
                        <CalendarIcon className="mr-2 h-4 w-4" />
                        {date ? format(date, "PPP") : <span>Pick a Set Up date</span>}
                        </Button>
                    </PopoverTrigger>
                    <PopoverContent className="w-auto p-0">
                   
                        <Calendar
                        mode="single"
                        selected={date}
                        onSelect={setDate}
                        initialFocus
                        />       
                    </PopoverContent>
                </Popover>

                <div className="space-y-1.5">
                        <Label>Add Attendees</Label>
                        <Popover open={openProgrammers} onOpenChange={setOpenProgrammers}>
                            <PopoverTrigger asChild>
                                <Button disabled={processing} variant="outline" role="combobox" aria-expanded={openProgrammers} className="w-full justify-between" >
                                    Search Users...
                                    <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                                </Button>
                            </PopoverTrigger>
                            <PopoverContent className="w-full p-3.5">
                                <Command className="w-full">
                                    <Input placeholder="Search users..." className="w-full" onChange={onSearch} value={search} />
                                    <CommandGroup className="w-full max-h-48 overflow-y-auto">
                                        {(employees||[]).map((user) => (
                                            <CommandItem className="w-full"
                                                key={user.idno}
                                                onSelect={() => {
                                                    addAdditionalAttendees(user);
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
                    <Command className="rounded-lg border shadow-md"> 
                        <CommandList>
                            <CommandGroup heading="Setup Committee">
                                <CommandItem className='flex justify-between'>
                                    <div className='flex'>
                                        <User className="mr-2 h-4 w-4" />
                                        <span className=' uppercase'>{`${software_manager.first_name} ${software_manager.last_name}`}</span>
                                    </div>           
                                    <span className=' uppercase  text-gray-400 font-mono text-xs '>{`${software_manager.position}`}</span>
                                </CommandItem>
                                {([...software_testers,...pc_head,...setup_committee]).map((st,index) => (                                         
                                    <CommandItem key={index} className='flex justify-between'>
                                       <div className='flex'>
                                            <User className="mr-2 h-4 w-4" />
                                            <span className=' uppercase'>{`${st.first_name} ${st.last_name}`}</span>
                                        </div>
                                        <span className=' uppercase text-gray-400 font-mono text-xs'>{`${st.position}`}</span>                  
                                    </CommandItem>                             
                                ))}
                             
                            
                            </CommandGroup>
                            <CommandSeparator />
                            <CommandGroup heading="Additional Attendees">
                                {([...data.additionalAttendees]).map((st,index) => (
                                    <CommandItem key={index}>
                                        <User className="mr-2 h-4 w-4" />
                                        <span className=' uppercase'>{`${st.first_name} ${st.last_name}`}</span>
                                        <CommandShortcut className='hover:cursor-pointer flex gap-3'>
                                            <TooltipProvider>
                                                <Tooltip>
                                                    <TooltipTrigger> <Trash2 onClick={()=>setData(val=>({...val,additionalAttendees:val.additionalAttendees.filter(({idno})=>idno!==st.idno)} ) )} /></TooltipTrigger>
                                                    <TooltipContent>
                                                        Remove attendee
                                                    </TooltipContent>
                                                </Tooltip>
                                            </TooltipProvider>
                                        
                                            {!st.work_email &&
                                                <Popover>
                                                    <PopoverTrigger asChild>
                                                        <Button disabled={loading}
                                                            variant={"ghost"}
                                                            className={'w-full justify-start text-left font-normal'}
                                                        >
                                                            <TooltipProvider>
                                                                <Tooltip>
                                                                    <TooltipTrigger> <MailXIcon className=' text-red-500' /></TooltipTrigger>
                                                                    <TooltipContent>
                                                                        Enter Email
                                                                    </TooltipContent>
                                                                </Tooltip>
                                                            </TooltipProvider>
                                                        </Button>
                                                    </PopoverTrigger>
                                                        <PopoverContent className="w-auto p-5 flex flex-col justify-end">    
                                                                <p className=' text-xs mb-2 text-slate-800'>{st.first_name} {st.last_name}</p>
                                                                <Separator />                                                        
                                                                 <Input  type='email' placeholder='Please enter email...' onChange={(e) => setAdEmail(e.target.value)} />
                                                                 {
                                                                 !adEmail.includes("@") &&
                                                                 <div className='flex items-center mt-2 mb-2'>
                                                                          <InfoIcon className=' mr-2 w-4 h-4 text-orange-300' />
                                                                          <p className='text-xs text-orange-300'>Enter a proper email</p>
                                                                 </div>
                                                                
                                                                  }  
                                                                 <Button type='button' disabled={!adEmail.includes("@") ? true :false} size={"sm"} className='mt-2' onClick={() =>onHandleAddEmail(index) }>Sumbit</Button>                                                                                                                                                                                                                                                                     
                                                        </PopoverContent>
                                               </Popover>

                                            }
                                        
                                        </CommandShortcut>
                                    </CommandItem>         
                                ))}
                                    {([...program.additional_attendees] || []).map((st,index) => (
                                    <CommandItem key={index}>
                                        <User className="mr-2 h-4 w-4" />
                                        <span className=' uppercase'>{`${st.first_name} ${st.last_name}`}</span>
                                        <CommandShortcut className='hover:cursor-pointer flex gap-3'>
                                     
                                        
                                            {!st.email &&
                                                <Popover>
                                                    <PopoverTrigger asChild>
                                                        <Button disabled={loading}
                                                            variant={"ghost"}
                                                            className={'w-full justify-start text-left font-normal'}
                                                        >
                                                            <TooltipProvider>
                                                                <Tooltip>
                                                                    <TooltipTrigger> <MailXIcon className=' text-red-500' /></TooltipTrigger>
                                                                    <TooltipContent>
                                                                        Enter Email
                                                                    </TooltipContent>
                                                                </Tooltip>
                                                            </TooltipProvider>
                                                        </Button>
                                                    </PopoverTrigger>
                                                        <PopoverContent className="w-auto p-5">
                                                        
                                                                    <Input  type='email' placeholder='Please enter email...' onChange={(e) => setAdEmail(e.target.value)} />     
                                                                    <Button type='button' onClick={() =>onHandleAddEmail(index) }>Sumbit</Button>
                                                                                                                                                                                                                                                                                                                                                                     
                                                       </PopoverContent>
                                               </Popover>

                                            }
                                        
                                        </CommandShortcut>
                                    </CommandItem>         
                                ))}
                            </CommandGroup>
                        </CommandList>
                    </Command> 
                </div>  
                <DialogFooter>
                    <Button size='sm' onClick={onSubmit} disabled={loading || hasAdditionalAttendeeWithoutEmail()} >
                        {loading && <Loader2 className='h-5 w-5 animate-spin mr-2' />}
                        Set Setup Schedule
                    </Button>
                </DialogFooter>
             
               
            </DialogContent>
        </Dialog>


                       
   
        </>
        


    );
};

export default SetupSchedule;
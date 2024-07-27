import { Program } from "@/types";
import { ColumnDef } from "@tanstack/react-table";
import { Button } from "../ui/button";
import {  ChevronsLeftRight, ExternalLinkIcon, ListOrdered, MoreHorizontal, Pencil, Trash2 } from "lucide-react";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "../ui/dropdown-menu";
import { useProgramModal } from "@/Hooks/useProgramModal";
import { useDeleteProgram } from "@/Hooks/useDeleteProgram";
import { Link } from "@inertiajs/inertia-react";
import { useChangeStepModal } from "@/Hooks/useChangeStepModal";

export const Columns: ColumnDef<Program>[] = [
    {
        accessorKey: "name",
        header: ({column})=><Button  className='text-primary px-0 w-full'  variant="ghost" onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}>Name<ChevronsLeftRight className="ml-2 h-4 w-4 rotate-90" /></Button>,
        cell:({row})=> {
            const {name,id} = row.original;
            return(
                <Link href={route('programs.show',{id})}>
                    <Button variant='link' size='sm'>
                        <span className="capitalize whitespace-nowrap inline-flex items-center gap-x-1.5">
                            <span className="font-semibold tracking-tighter">{name}</span>
                            <ExternalLinkIcon className="h-4 w-4" />
                        </span>
                    </Button>
                </Link>
            );
        }
    },
    {
        accessorKey: "department",
        header: ({column})=><Button  className='text-primary px-0 w-full'  variant="ghost" onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}>Department<ChevronsLeftRight className="ml-2 h-4 w-4 rotate-90" /></Button>,
    },
    {
        accessorKey: "date_prepared",
        header: ({column})=><Button  className='text-primary px-0 w-full'  variant="ghost" onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}>Date Prepared<ChevronsLeftRight className="ml-2 h-4 w-4 rotate-90" /></Button>,
    },
    {
        accessorKey: "scope_of_testing",
        header: ({column})=><Button  className='text-primary px-0 w-full'  variant="ghost" onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}>Scope of Testing<ChevronsLeftRight className="ml-2 h-4 w-4 rotate-90" /></Button>,
    },
    {
        accessorKey: "test_strategy",
        header: ({column})=><Button  className='text-primary px-0 w-full'  variant="ghost" onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}>Test Strategy<ChevronsLeftRight className="ml-2 h-4 w-4 rotate-90" /></Button>,
    },
    {
        accessorKey: "testing_schedule",
        header: ({column})=><Button  className='text-primary px-0 w-full'  variant="ghost" onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}>Testing Schedule<ChevronsLeftRight className="ml-2 h-4 w-4 rotate-90" /></Button>,
    },
    {
        accessorKey: "resources_needed",
        header: ({column})=><Button  className='text-primary px-0 w-full'  variant="ghost" onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}>Resources Needed<ChevronsLeftRight className="ml-2 h-4 w-4 rotate-90" /></Button>,
    },
    {
        accessorKey: "system_deadline",
        header: ({column})=><Button  className='text-primary px-0 w-full'  variant="ghost" onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}>System Deadline<ChevronsLeftRight className="ml-2 h-4 w-4 rotate-90" /></Button>,
    },
    {
        accessorFn: ({step})=>step.step,
        id:'Next Step',
        header: ({column})=><Button  className='text-primary px-0 w-full'  variant="ghost" onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}>Next Step<ChevronsLeftRight className="ml-2 h-4 w-4 rotate-90" /></Button>,
        cell:({row})=> {
            const {step} = row.original;
            return(
                <span className="capitalize">{step.name}</span>
            );
        }
    },
    {
        header:({column})=><span className="text-primary">Actions</span>,
        id:'Actions',
        cell:({row})=> {
            const {id} = row.original;
            const {onOpen} = useProgramModal();
            const {onOpen:onDelete} = useDeleteProgram();
            
            const {onOpen:openChangeStep} = useChangeStepModal();
            return(
                <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                        <Button variant='ghost' className="h-8 w-8 p-0">
                            <span className="sr-only">Open Menu</span>
                            <MoreHorizontal />
                        </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                        
                        <DropdownMenuItem onClick={()=>onOpen(row.original.project_id,row.original)}>
                            <Pencil className="h-4 w-4 mr-2" />Edit
                        </DropdownMenuItem>
                        <DropdownMenuItem onClick={()=>onDelete(id)}>
                            <Trash2 className="h-4 w-4 mr-2" />Delete
                        </DropdownMenuItem>
                        <DropdownMenuItem onClick={()=>openChangeStep(row.original)}>
                            <ListOrdered className="h-4 w-4 mr-2" />Change Next Step
                        </DropdownMenuItem>
                        
                    </DropdownMenuContent>
                </DropdownMenu>
            );
        }
    }
];
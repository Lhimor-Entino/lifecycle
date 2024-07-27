import { useSearch } from "@/Hooks/useSearch";
import { CommandDialog, CommandEmpty, CommandGroup, CommandInput, CommandItem, CommandList } from "./ui/command";
import { useEffect } from "react";
import { usePage } from "@inertiajs/inertia-react";
import { Inertia, Page } from "@inertiajs/inertia";
import { PageProps } from "@/types";
import { AppWindow, Code2Icon, CornerDownRightIcon, FileIcon } from "lucide-react";
import { Label } from "./ui/label";

const SearchCommand = () => {
    const {toggle,isOpen,onClose} = useSearch();
    
    const {projects} = usePage<Page<PageProps>>().props;
    useEffect(() => {
        const down = (e: KeyboardEvent) => {
        if (e.key === "k" && (e.metaKey || e.ctrlKey)) {
            e.preventDefault()
            toggle();
        }
        }
    
        document.addEventListener("keydown", down)
        return () => document.removeEventListener("keydown", down)
    }, []);

    const onSelect = (id:number) =>{
        Inertia.get(route('projects.show',{id}));
        onClose();
    }
    const onProgramSelect = (id:number) =>{
        Inertia.get(route('programs.show',{id}));
        onClose();
    }
    return (
        <CommandDialog open={isOpen} onOpenChange={onClose}>
            <CommandInput placeholder='Search a Project...'  />
            <CommandList>
                <CommandEmpty>No Projects Found...</CommandEmpty>
                <CommandGroup heading='Projects'>
                    {
                        projects.map(({id,...proj})=> (
                            <>
                           
                            <CommandItem key={id} value={`${id.toString()}-${proj.name}`}>
                               <div className="flex flex-col w-full">
                                    <div className="flex hover:cursor-pointer w-full" onClick={() =>onSelect(id)}>
                                        <FileIcon className='mr-2 h-4 w-4' />
                                        <span>{proj.name}</span>
                                    </div>
                           
                                    <div className="ml-5 mt-3">
                                    <Label className=" text-xs  text-gray-500">Programs</Label>
                                 
                                     {proj.programs.map(pp => (
                                        <div className="flex items-center mt-2 hover:cursor-pointer" onClick={()=>onProgramSelect(pp.id)}>
                                            <CornerDownRightIcon className='mr-2 h-1 w-1 text-gray-400' />
                                            <p className="text-sm">{pp.name}</p>
                                        </div>
                                        ))
                                    }

                                    </div>
                               </div>
                               
                                
                            </CommandItem>
                  
                           
                            </>
                        )
                    )}
                </CommandGroup>
               
            </CommandList>
        </CommandDialog>
    )
}
export default SearchCommand
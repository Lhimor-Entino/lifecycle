import { cn } from '@/lib/utils';
import { CheckIcon, ChevronLeftIcon, ChevronsUpDownIcon, Command, DownloadCloud, Lightbulb, LightbulbOff, MenuIcon, PlusCircle, RecycleIcon, Search } from 'lucide-react';
import {ElementRef, FC, MouseEventHandler, useEffect, useRef, useState} from 'react';
import { useMediaQuery } from 'usehooks-ts';
import { Popover, PopoverContent, PopoverTrigger } from '../ui/popover';
import UserItem from './UserItem';
import Item from './Item';
import { useSearch } from '@/Hooks/useSearch';
import { ModeToggle } from '../ModeToggle';
import { useTheme } from '@/Providers/ThemeProvider';
import { useProjectModal } from '@/Hooks/useProjectModal';
import { PageProps, Project } from '@/types';
import NavBar from '../NavBar';
import ProjectList from '../ProjectList';
import Trashbox from '../Trashbox';
import { ScrollArea } from '../ui/scroll-area';
import { Inertia } from '@inertiajs/inertia';
import { toast } from 'sonner';

interface Props {
    selected_project?:Project;
}

const Navigation:FC<Props> = ({selected_project}) => {
    const {onOpen:OpenProjectModal} = useProjectModal();
    const isMobile = useMediaQuery("(max-width: 768px)");
    const isResizingRef = useRef(false);
    const sidebarRef = useRef<ElementRef<'aside'>>(null);
    const navBarRef = useRef<ElementRef<'div'>>(null);
    const [isResetting,setIsResetting] = useState(false);
    const [isCollapsed,setIsCollapsed] = useState(isMobile);
    
    

    const { setTheme,theme } = useTheme()
    
    const {onOpen} = useSearch();
    const handleMouseDown:MouseEventHandler<HTMLDivElement> = e =>{
        e.preventDefault();
        e.stopPropagation();

        

        isResizingRef.current=true;
        document.addEventListener('mousemove',handleMouseMove);
        document.addEventListener('mouseup',handleMouseUp);
        
    }

    const handleMouseMove = (e:MouseEvent) =>{
        if(!isResizingRef.current) return;
        let newWidth = e.clientX;
        if(newWidth < 240) newWidth = 240;
        if(newWidth > 480) newWidth = 480;

        if(sidebarRef.current && navBarRef.current){
            sidebarRef.current.style.width = `${newWidth}px`;
            navBarRef.current.style.setProperty('left', `${newWidth}px`);
            navBarRef.current.style.setProperty('width', `calc(100% - ${newWidth})px`)
        }

    }

    const handleMouseUp = () =>{
        isResizingRef.current=false;
        document.removeEventListener('mousemove',handleMouseMove);
        document.removeEventListener('mouseup',handleMouseUp);
    }

    const resetWidth = () =>{
        if(sidebarRef.current && navBarRef.current){
            setIsResetting(true);
            setIsCollapsed(false);
            sidebarRef.current.style.width = isMobile? '100%' : '15rem';
            navBarRef.current.style.setProperty('width',isMobile? '0' : 'calc(100% - 15rem)');
            navBarRef.current.style.setProperty('left',isMobile? '100%':'15rem');

            setTimeout(()=>setIsResetting(false),300);
        }
    }

    const collapse = () =>{
        if(sidebarRef.current && navBarRef.current){
            setIsCollapsed(true);
            setIsResetting(true);
            sidebarRef.current.style.width='0px';
            navBarRef.current.style.setProperty('width','100%');
            navBarRef.current.style.setProperty('left','0');
            setTimeout(()=>setIsResetting(false),300);
        }
    }

    useEffect(()=>{
        if (isMobile) collapse();
        else resetWidth();
    },[isMobile]);

    const sync = () => {
        const notif = toast.loading("Syncing departments from HRMS... Do not close this page.");
        Inertia.get(route('hrms.sync_departments'),{},{
            onSuccess:()=>toast.success('Departments synced successfully',{id:notif}),
            onError:()=>toast.error('Failed to sync departments. Try again',{id:notif}),
            preserveState:false               
        })
};

    return (
        <>
            <aside ref={sidebarRef} className={cn('group/sidebar h-full overflow-y-auto bg-background relative flex flex-col w-60 z-10 border-r border-r-primary',
                    isResetting && 'transition-all ease-in-out duration-300',
                    isMobile && 'w-0'
                )}>
                <div onClick={collapse} role='button' className={cn('h-6 w-6 text-muted-foreground rounded-sm hover:text-primary absolute top-3 right-2 opacity-0 group-hover/sidebar:opacity-100 transition ',
                        isMobile && 'opacity-100'
                    )}>
                    <ChevronLeftIcon className='h-7 w-7' />
                </div>
                <div className='w-full h-auto'>
                    <UserItem />
                    <Item onClick={onOpen} label='Search' Icon={Search} isSearch />
                    {/* <Item onClick={()=>setTheme(theme==='dark'?'light':'dark')} label='Toggle Dark Mode' Icon={theme==='dark'?Lightbulb:LightbulbOff}  /> */}
                    <Item onClick={()=>OpenProjectModal()} label='New Project' Icon={PlusCircle} />
                    <Item onClick={sync} label='Sync Departments From HRMS' Icon={DownloadCloud} />
                </div>
                
                <p className="text-center text-xl font-bold tracking-tight border-b border-b-muted-foreground/30 mt-3.5">Project List</p>
                <ScrollArea  className='flex-1  mt-3.5 w-full'>
                    <ProjectList selected_project={selected_project} />   
                </ScrollArea >
                <div className=' h-auto pb-3.5'>
                    <Popover>
                        <PopoverTrigger className='w-full mt-3.5'>
                            <Item label='Archives' Icon={RecycleIcon} />
                        </PopoverTrigger>
                        <PopoverContent className='p-0 w-72' side={isMobile?'bottom':'right'}>
                            <Trashbox selected_project={selected_project} />
                        </PopoverContent>
                    </Popover>
                </div>
                <div onMouseDown={handleMouseDown} onClick={resetWidth} className='opacity-0 hover:opacity-100 transition cursor-ew-resize absolute h-full w-1 bg-primary right-0 top-0' />
            </aside>
            <div ref={navBarRef} className={cn('absolute top-0 z-[100] left-60 w-[calc(100%-15rem)]',
                isResetting && 'transition-all ease-in-out duration-300',
                isMobile && 'left-0 w-full'
            )}>
                {!!selected_project?.id?<NavBar isCollapsed={isCollapsed} onResetWidth={resetWidth} selected_project={selected_project} />:(
                    <nav className=' px-3 py-2 w-full '>
                        {isCollapsed&& <MenuIcon onClick={resetWidth} className='h-6 w-6 text-muted-foreground' role='button' />}                        
                    </nav>
                )}
                
            </div>
        </>
    );
};

export default Navigation;


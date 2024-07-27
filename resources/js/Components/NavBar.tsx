import { Project } from '@/types';
import { MenuIcon } from 'lucide-react';
import {FC} from 'react';
import Title from './Title';
import Menu from './Menu';
import Banner from './Banner';
import { cn } from '@/lib/utils';

interface Props {
    isCollapsed:boolean;
    onResetWidth:()=>void;
    selected_project?:Project;
}

const NavBar:FC<Props> = ({isCollapsed,onResetWidth,selected_project}) => {
    if (!selected_project) return null;
    return (
        <>
            
            <nav className={cn('px-2.5 py-1.5 w-full flex items-center gap-x-3.5 border-b z-50')}> 
                <div className='flex flex-col w-full'>
                    <div className='flex flex-row  py-1 items-center -mx-2.5 border-b' >
                        {isCollapsed&&<MenuIcon role='button' onClick={onResetWidth} className='w-6 h-6 text-muted-foreground ml-2.5' />}
                        <img alt='DDC'   className='aspect-video h-[55px] ' src={`${route('public_route')}/images/idci_logo_red.png`} />
                        <div className='flex flex-col'>
                            <p className='text-xs font-light tracking-wide'>Information Security Management System</p>
                            <p className='text-sm font-semibold tracking-tight'>SOFTWARE DEVELOPMENT LIFECYCLE</p>
                        </div>
                    </div>
                    <div className='flex items-center justify-between w-full' >
                        <Title project={selected_project} />
                        {selected_project.is_archived!==1&&(
                            <div className='flex items-center gap-x-2 '>
                                <Menu updateDate={new Date(selected_project.updated_at)} project={selected_project} />
                            </div>
                        )}
                        
                    </div>
                </div>
            </nav>
            
            {selected_project.is_archived===1 && <Banner id={selected_project.id} />}
        </>
    )
};

export default NavBar;
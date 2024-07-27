import { PageProps } from '@/types';
import { Inertia, Page } from '@inertiajs/inertia';
import { usePage } from '@inertiajs/inertia-react';
import {FC} from 'react';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuTrigger } from '../ui/dropdown-menu';
import { Avatar, AvatarFallback, AvatarImage } from '../ui/avatar';
import { ChevronsLeftRight } from 'lucide-react';
import { Switch } from '../ui/switch';
import { Label } from '../ui/label';
import { useTheme } from '@/Providers/ThemeProvider';



const UserItem:FC = () => {
    
    const {user} = usePage<Page<PageProps>>().props.auth;  
    const { setTheme,theme } = useTheme();
    return (
        <DropdownMenu>
            <DropdownMenuTrigger asChild>
                <div role='button' className='flex items-center text-sm p-2.5 w-full hover:bg-primary/5'>
                    <div className=' gap-x-1.5 flex items-center max-w-[9.375rem]'>
                        <Avatar className='h-5 w-5'>
                            <AvatarImage src={user.photo} alt="@shadcn" />
                            <AvatarFallback className='bg-background'>{user.first_name.charAt(0)}</AvatarFallback>
                        </Avatar>
                        <span className=' text-start font-medium line-clamp-1'>
                            {`${user.first_name} ${user.last_name}`}
                        </span>
                    </div>
                    <ChevronsLeftRight className='rotate-90 ml-2 text-muted-foreground h-4 w-4' />
                </div>
            </DropdownMenuTrigger>
            <DropdownMenuContent className="w-80 z-[500]" align="start" alignOffset={11} forceMount>
                <DropdownMenuLabel className="font-normal">
                    <div className="flex flex-col space-y-1">
                        <p className="text-sm font-medium leading-none">{user.first_name}</p>
                        <p className="text-xs leading-none text-primary">
                            {user.company_id}
                        </p>
                    </div>
                </DropdownMenuLabel>
                <DropdownMenuSeparator />
                    <DropdownMenuItem className='flex items-center space-x-2'>
                        <Switch id="dark-mode" checked={theme==='dark'} onCheckedChange={()=>setTheme(theme==='dark'?'light':'dark')} />
                        <Label htmlFor="dark-mode">Toggle Dark Mode</Label>
                    </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem onClick={()=>Inertia.post(route('logout'))}>
                    Log out
                </DropdownMenuItem>
            </DropdownMenuContent>
        </DropdownMenu>
    );
};

export default UserItem;
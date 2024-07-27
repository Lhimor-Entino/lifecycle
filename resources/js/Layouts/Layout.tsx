import NoEmailAlert from '@/Components/Modals/NoEmailAlert';
import Navigation from '@/Components/Navigation/Navigation';
import SearchCommand from '@/Components/SearchCommand';
import { AlertDialog, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from '@/Components/ui/alert-dialog';
import { Button } from '@/Components/ui/button';
import { ModalProvider } from '@/Providers/ModalProvider';
import { cn } from '@/lib/utils';
import { PageProps, Project } from '@/types';
import { FC, ReactNode,  useState } from 'react';

interface Props {
    children: ReactNode;
    selected_project?:Project;
}

const Layout:FC<Props> = ({children,selected_project}) => {
    
    
    return (
        <>
            <SearchCommand />
            <div className='h-full flex '>
                <Navigation selected_project={selected_project} />
                <main className={cn('flex-1 h-full overflow-y-auto ',!!selected_project&&'pt-[7.5rem]')}>
                    {children}
                </main>
            </div>
            <ModalProvider />
            <NoEmailAlert />
        </>
    );
};

export default Layout;

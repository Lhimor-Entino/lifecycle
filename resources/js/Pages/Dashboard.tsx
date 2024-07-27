import { Button } from '@/Components/ui/button';
import { useProjectModal } from '@/Hooks/useProjectModal';
import { useSearch } from '@/Hooks/useSearch';
import Layout from '@/Layouts/Layout';
import { PageProps } from '@/types';
import { Page } from '@inertiajs/inertia';
import { Head, usePage } from '@inertiajs/inertia-react';
import { PlusCircle, Search } from 'lucide-react';
import {FC} from 'react';

interface Props {
    
}

const Dashboard:FC<Props> = () => {
    
    const {onOpen} = useProjectModal();
    const {onOpen:onSearch} = useSearch();

    return (
        <>
            <Head title='Software Lifecycle' />
            <Layout  >
                <div className='h-full flex flex-col items-center justify-center space-y-3.5 pt-32'>
                    <img alt='Empty' height={300} width={300} className='dark:invert' src={`${route('public_route')}/images/empty.png`} />
                    <h2 className='text-lg font-medium'>Welcome to Software Lifecycle</h2>
               
                    <Button onClick={()=>onOpen()}>
                        <PlusCircle className='h-4 w-4 mr-2' />
                        <span>
                            Create a Project
                        </span>
                    </Button>
                    
                    <p>OR</p>
                    <Button variant='outline' onClick={()=>onSearch()}>
                        <Search className='h-4 w-4 mr-2' />
                        <span>                            
                            <p>Search A Project</p>
                        </span>
                    </Button>
                </div>
            </Layout>
        </>
    );
};

export default Dashboard;
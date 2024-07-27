import { Columns } from '@/Components/ProgramTableComponents/Columns';
import DataTable from '@/Components/ProgramTableComponents/DataTable';
import { Breadcrumb, BreadcrumbItem, BreadcrumbLink, BreadcrumbList, BreadcrumbSeparator } from '@/Components/ui/breadcrumb';
import Layout from '@/Layouts/Layout';
import { Project } from '@/types';
import { Head, Link } from '@inertiajs/inertia-react';
import {FC} from 'react';

interface Props {
    selected_project:Project;
}

const Project:FC<Props> = ({selected_project}) => {
    return (
        <>
            <Head title={selected_project.name} />
            <Layout selected_project={selected_project} >
                <div className='px-3.5 pb-1.5 w-full  h-full flex flex-col '>
                    <Breadcrumb className='h-auto'>
                        <BreadcrumbList>
                            <BreadcrumbItem>
                                <BreadcrumbLink asChild>
                                    <Link href={route('dashboard')}>
                                        Home
                                    </Link>
                                </BreadcrumbLink>
                            </BreadcrumbItem>
                            <BreadcrumbSeparator />
                            <BreadcrumbItem>
                                <BreadcrumbLink asChild>
                                    <Link href={route('projects.show',{id:selected_project.id})}>
                                        {selected_project.name}
                                    </Link>
                                </BreadcrumbLink>
                            </BreadcrumbItem>
                        </BreadcrumbList>
                    </Breadcrumb>
                    <DataTable columns={Columns} data={selected_project.programs} />
                </div>
            </Layout>
        </>
    );
};

export default Project;
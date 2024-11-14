import { Badge } from '@/Components/ui/badge';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/Components/ui/table';
import { PageProps, Program, TechnicalRequirementsDocumentItem } from '@/types';
import { Page } from '@inertiajs/inertia';
import { usePage } from '@inertiajs/inertia-react';
import { FC } from 'react';

interface Props {
    program: Program;
}

const RequirementTraceabilityMatrix: FC<Props> = ({ program }) => {
    const { techinical_requirement_document } = program;
    const { trd_items } = usePage<Page<PageProps>>().props

    return (
        <div className='w-full h-full border rounded-lg flex items-center justify-center'>
            <div className='h-full max-w-[40rem] flex flex-col gap-y-0.5'>
                <p className='font-bold text-lg h-auto w-full text-center'>
                    REQUIREMENT TRACEABILITY MATRIX
                </p>
                <Table className='flex-1'>
                    <TableHeader className='!border-2 sticky top-0 bg-background z-50'>
                        <TableRow>
                            <TableHead className='!border !font-light'>
                                Req ID
                            </TableHead>
                            <TableHead className='!border !font-light'>
                                Req. Description
                            </TableHead>
                            <TableHead className='!border !font-light'>
                                Test Case ID
                            </TableHead>
                            <TableHead className='!border !font-light'>
                                Test Status
                            </TableHead>
                        </TableRow>

                    </TableHeader>
                    <TableBody>

                        {
                            program.techinical_requirement_document_item ?
                                program.project.business_requirement_document &&
                                program.techinical_requirement_document_item.filter(trd => trd.is_active === 0).map((item) => (
                                    <MatrixItem key={item.id} item={item} />
                                ))
                                : ""
                        }
                    </TableBody>
                </Table>
            </div>
        </div>
    );
};

export default RequirementTraceabilityMatrix;

const MatrixItem: FC<{ item: TechnicalRequirementsDocumentItem }> = ({ item }) => {
    return (
        <TableRow>
            <TableCell className='!border'>{item.id}</TableCell>
            <TableCell className='!border'>{item.req_description}</TableCell>
            <TableCell className='!border'>{item.test_case_id}</TableCell>
            <TableCell className='!border'>
                {item.test_case_status === 'failed' && <Badge variant='destructive'>Failed</Badge>}
                {item.test_case_status === 'ongoing' && <Badge variant='outline'>On-Going</Badge>}
                {item.test_case_status === 'success' && <Badge variant='default'>Success</Badge>}
            </TableCell>
        </TableRow>
    );
}
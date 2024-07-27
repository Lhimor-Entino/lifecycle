import { Button } from '@/Components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/Components/ui/dialog';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/Components/ui/table';
import { PageProps, Program } from '@/types';
import { HistoryIcon } from 'lucide-react';
import {FC, useEffect, useState, } from 'react';
import { format } from 'date-fns';
import { Badge } from '@/Components/ui/badge';
import { usePage } from '@inertiajs/inertia-react';
import { Page } from '@inertiajs/inertia';

interface Props {
    program:Program;
}

const TestingHistory:FC<Props> = ({program}) => {
    const techinical_requirement_document = program.techinical_requirement_document||undefined;


    const getDesc = (arr : any) => {

        if(!arr) return;
        const formatted = JSON.parse(arr)
        const res = formatted.map((ts :any,index:number) => <p key={index}><span>{index + 1}.</span> {ts}</p>)

        return res;
    }
    return (
        <Dialog>
            <DialogTrigger asChild>
                <Button size='sm' variant='outline'>
                    <HistoryIcon className='w-5 h-5 mr-2' />
                    Testing History
                </Button> 
            </DialogTrigger>
            <DialogContent className='max-h-full flex flex-col md:min-w-[90vw] w-full '>
                <DialogHeader className='h-auto'>
                    <DialogTitle>Testing History</DialogTitle>
                </DialogHeader>
                <Table className='flex-1 overflow-y-auto'>
                    <TableHeader>
                        <TableRow>
                            <TableHead>Test History ID</TableHead>
                            <TableHead>Test Case ID</TableHead>
                            <TableHead>Test Test Description</TableHead>
                            <TableHead className='text-center'>Status</TableHead>
                            <TableHead>User</TableHead>
                            <TableHead>Date</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {!!techinical_requirement_document&&techinical_requirement_document.histories.length>0&&techinical_requirement_document.histories.map(item=>(
                            <TableRow key={item.id}>                                
                                <TableCell className='whitespace-nowrap'>{item.id}</TableCell>
                                <TableCell className='whitespace-nowrap'>{item.teq_req_doc_item?.test_case_id||""}</TableCell>
                                <TableCell >
                                    {/* {getDesc(item.teq_req_doc_item?.test_case_description)} */}
                                    </TableCell>
                                <TableCell className='whitespace-nowrap'>
                                    <div className='items-center justify-center flex'>
                                        {item.test_case_status==='failed' && <Badge variant='destructive'>Failed</Badge>}
                                        {item.test_case_status==='ongoing' && <Badge variant='outline'>On-Going</Badge>}
                                        {item.test_case_status==='success' && <Badge variant='default'>Success</Badge>}                                    
                                        {(item.test_case_status!=='success'&&item.test_case_status!=='failed'&&item.test_case_status!=='ongoing') && <p className='text-xs'>{item.test_case_status}</p>}
                                    </div>
                                </TableCell>
                                <TableCell className='whitespace-nowrap'>{`${item.user.first_name} ${item.user.last_name}`}</TableCell>
                                <TableCell className='whitespace-nowrap'>{format(new Date(item.created_at),'PPp')}</TableCell>
                            </TableRow>                        
                        ))}
                        
                    </TableBody>
                </Table>
            </DialogContent>
        </Dialog>
    );
};

export default TestingHistory;
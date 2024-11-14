import Layout from '@/Layouts/Layout';
import { LifeCycle, PageProps, Program, UserAcceptance } from '@/types';
import { Head, Link, usePage } from '@inertiajs/inertia-react';
import { FC, useState } from 'react';
import { Select, SelectContent, SelectGroup, SelectItem, SelectLabel, SelectTrigger, SelectValue } from '@/Components/ui/select';
import ProgramContent from './ProgramComponents/ProgramContent';
import { Breadcrumb, BreadcrumbItem, BreadcrumbLink, BreadcrumbList, BreadcrumbSeparator } from '@/Components/ui/breadcrumb';
import Hint from '@/Components/Hint';
import { Button } from '@/Components/ui/button';
import { HistoryIcon, ListTodo } from 'lucide-react';
import CheckList from './ProgramComponents/CheckList';
import TRDNotificationModal from './ProgramComponents/TechnicalRequirementsDocument/TRDNotificationModal';
import { useLocalStorage } from 'usehooks-ts';
import SetupSchedule from './ProgramComponents/SetupSchedule';
import SetupScheduleEmail from './ProgramComponents/SetupScheduleEmail';
import { useProgramModal } from '@/Hooks/useProgramModal';
import TestPlanEmail from './ProgramComponents/TestPlanEmail';
import FailedTestEmail from './ProgramComponents/FailedTestEmail';
import CompletedTestEmail from './ProgramComponents/CompletedTestEmail';
import TestCasesPassedEmail from './ProgramComponents/TestCasesPassedEmail';
import TestingHistory from './ProgramComponents/TestingHistory';
import ChangerequestEmailNotification from './ProgramComponents/ChangeRequestEmailNotification';
import { toast } from 'sonner';
import BusReqHistory from './ProgramComponents/BusinessRequirementsDocument/BusReqHistory';
import useRestriction from '@/Hooks/useRestriction';
import { Page } from '@inertiajs/inertia';

const Cycles: LifeCycle[] = [
    'Business Requirements Document',
    'Technical Requirements Document',
    'Setup Schedule',
    // 'Send an email of the schedule',
    'Test Plan',
    // 'Send an email of the Test Plan',
    'Send an email to inform of failed test',
    'Send an email to inform of completed test',
    'Requirement Traceability Matrix',
    'Send an email to Software manager informing all test cases are passed',
    'User Acceptance Testing',
    'Change Management Request'
];

interface Props {
    program: Program;
}


const Program: FC<Props> = ({ program }) => {
    const { project } = program;
    const { auth } = usePage<Page<PageProps>>().props
    const { usePcRestriction, useTesterRestriction } = useRestriction()


    const [currentLifeCycle, setCurrentLifeCycle] = useLocalStorage<LifeCycle>("0", Cycles[0]);
    const [showSetupSchedule, setShowSetupSchedule] = useState(false);
    const [showSetupScheduleEmail, setShowSetupScheduleEmail] = useState(false);
    const [showTestPlanEmail, setShowTestPlanEmail] = useState(false);
    const [showFailedTestEmail, setShowFailedTestEmail] = useState(false);
    const [showCompletedTestEmail, setShowCompletedTestEmail] = useState(false);

    const [showSoftwareManagerEmail, setShowSoftwareManagerEmail] = useState(false);

    const hanleOpenSetupScheduleEmail = () => {
        setShowSetupScheduleEmail(true)
    }
    const hanleOpenTestPlanEmail = () => {
        setShowTestPlanEmail(true)
    }
    const { onOpen } = useProgramModal();
    const handleSelect = (e: LifeCycle) => {

        switch (e) {
            case 'Business Requirements Document':
            case 'Technical Requirements Document':
            case 'Requirement Traceability Matrix':
                setCurrentLifeCycle(e);
                break;
            case 'Setup Schedule':
                if (!program.project.business_requirement_document) {
                    toast.info("Currently, no Business Requirements Document.")
                    return; // If any status is not "success", return false    
                }
                setShowSetupSchedule(true);
                break;
            case 'Send an email of the schedule':
                setShowSetupScheduleEmail(true);
                break;
            case 'Test Plan':

                if (!program.project.business_requirement_document) {
                    toast.info("Currently, no Business Requirements Document.")
                    return; // If any status is not "success", return false    
                }
                onOpen(program.project_id, program);
                break;
            case 'Send an email of the Test Plan':
                setShowTestPlanEmail(true);
                break;
            case 'Send an email to inform of failed test':
                if (!usePcRestriction(auth.user.department)) {
                    return
                }
                if (!program.project.business_requirement_document) {
                    toast.info("Currently, no Business Requirements Document.")
                    return; // If any status is not "success", return false    
                }
                let has_failed_test_to_emal: boolean = false;
                if (!program.techinical_requirement_document_item) {
                    console.log("NO TRD")
                    return;
                }
                for (let item of program.techinical_requirement_document_item) {
                    if (item.test_case_status === "failed" && item.is_active === 0) {
                        has_failed_test_to_emal = true

                    }
                }
                if (!has_failed_test_to_emal) {
                    toast.info("Currently, there are no failed tests to email.")
                    return; // If any status is not "success", return false
                }
                setShowFailedTestEmail(true);
                break;
            case 'Send an email to inform of completed test':

                if (!usePcRestriction(auth.user.department)) {
                    return
                }
                if (!program.project.business_requirement_document) {
                    toast.info("Currently, no Business Requirements Document.")
                    return; // If any status is not "success", return false    
                }
                if (!program.techinical_requirement_document_item) {
                    console.log("NO TRD")
                    return;
                }
                for (let item of program.techinical_requirement_document_item) {
                    if (item.test_case_status !== "success" && item.is_active === 0) {

                        toast.info("Currently, not all TRD tests have been successfully completed.")
                        return; // If any status is not "success", return false
                    }
                }

                setShowCompletedTestEmail(true);
                break;
            case 'Send an email to Software manager informing all test cases are passed':
                if (!usePcRestriction(auth.user.department)) {
                    return
                }
                if (!program.project.business_requirement_document) {
                    toast.info("Currently, no Business Requirements Document.")
                    return; // If any status is not "success", return false    
                }
                if (!program.techinical_requirement_document_item) {
                    console.log("NO TRD")
                    return;
                }
                for (let item of program.techinical_requirement_document_item) {
                    if (item.test_case_status !== "success" && item.is_active === 0) {

                        toast.info("Currently, not all TRD tests have been successfully completed.")
                        return; // If any status is not "success", return false
                    }
                }

                setShowSoftwareManagerEmail(true);
                break;
            case 'User Acceptance Testing':
                setCurrentLifeCycle(e);
                break;
            case 'Change Management Request':

                setCurrentLifeCycle(e);
                break;
        }

    }

    return (
        <>
            <Head title={program.name} />
            <Layout selected_project={project} >
                <div className='px-3.5 pb-1.5 w-full  h-full flex flex-col gap-y-3.5 '>

                    <div className='flex flex-col md:flex-row items-center md:justify-between h-auto'>
                        <Breadcrumb>
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
                                        <Link href={route('projects.show', { id: program.project_id })}>
                                            {program.project.name}
                                        </Link>
                                    </BreadcrumbLink>
                                </BreadcrumbItem>
                                <BreadcrumbSeparator />
                                <BreadcrumbItem>
                                    <BreadcrumbLink asChild>
                                        <Link href={route('programs.show', { id: program.id })}>
                                            {program.name}
                                        </Link>
                                    </BreadcrumbLink>
                                </BreadcrumbItem>
                                <BreadcrumbSeparator />
                                <Select value={currentLifeCycle} onValueChange={(e: LifeCycle) => handleSelect(e)} >
                                    <SelectTrigger className='h-9 inline-flex w-auto !ring-0 !ring-offset-0 border-0'>
                                        <SelectValue placeholder={currentLifeCycle} />
                                    </SelectTrigger>
                                    <SelectContent  >
                                        {
                                            Cycles.map((cycle) => <SelectItem key={cycle} value={cycle} >{cycle}</SelectItem>)
                                        }
                                    </SelectContent>
                                </Select>
                            </BreadcrumbList>
                        </Breadcrumb>
                        <div className='flex flex-row items-center gap-x-2'>
                            <CheckList program={program} />
                            {/* <TestingHistory program={program} />
                            <BusReqHistory program={program} /> */}
                        </div>
                    </div>
                    <div className='flex-1 overflow-y-hidden'>
                        <ProgramContent program={program} cycle={currentLifeCycle} />
                    </div>
                </div>
            </Layout>
            <SetupSchedule program={program} hanleOpenSetupScheduleEmail={hanleOpenSetupScheduleEmail} isOpen={showSetupSchedule} onClose={() => setShowSetupSchedule(false)} />
            {!!program.program_setup_schedule && <SetupScheduleEmail program={program} isOpen={showSetupScheduleEmail} onClose={() => setShowSetupScheduleEmail(false)} />}
            {/* <TestPlanEmail program={program} isOpen={showTestPlanEmail} onClose={()=>setShowTestPlanEmail(false)} /> */}
            {!!program.project.business_requirement_document && <FailedTestEmail program={program} isOpen={showFailedTestEmail} onClose={() => setShowFailedTestEmail(false)} />}
            <CompletedTestEmail program={program} isOpen={showCompletedTestEmail} onClose={() => setShowCompletedTestEmail(false)} />
            <TestCasesPassedEmail program={program} isOpen={showSoftwareManagerEmail} onClose={() => setShowSoftwareManagerEmail(false)} />

        </>
    );
};

export default Program;

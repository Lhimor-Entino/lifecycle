import { LifeCycle, Program } from "@/types";
import { FC } from "react";
import BusinessRequirementsDocument from "./BusinessRequirementsDocument";
import TechnicalRequirementsDocument from "./TechnicalRequirementsDocument";
import RequirementTraceabilityMatrix from "./RequirementTraceabilityMatrix";
import UserAcceptance from "./UserAcceptance";
import ChangeManagementRequest from "./ChangeManagementRequest";

interface Props{
    cycle:LifeCycle;
    program:Program;
}

const ProgramContent:FC<Props> = ({cycle,program}) =>{
    switch (cycle){
        case 'Business Requirements Document': return <BusinessRequirementsDocument program={program} />
        case 'Technical Requirements Document': return <TechnicalRequirementsDocument program={program} />
        case 'Requirement Traceability Matrix': return <RequirementTraceabilityMatrix program={program} />
        case 'User Acceptance Testing': return <UserAcceptance program={program} />
        case 'Change Management Request': return <ChangeManagementRequest program={program} />
        default: return <div>Internal Error. Please refresh the page</div>
    }
}

export default ProgramContent; 
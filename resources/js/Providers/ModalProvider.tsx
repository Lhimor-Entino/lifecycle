import ArchiveProjectModal from "@/Components/Modals/ArchiveProjectModal"
import ChangeStepModal from "@/Components/Modals/ChangeStepModal"
import DeleteChangeManagementReqModal from "@/Components/Modals/DeleteChangeManagementReqModal"
import DeleteProgramModal from "@/Components/Modals/DeleteProgramModal"
import DeleteProjectModal from "@/Components/Modals/DeleteProjectModal"
import EditChangeManagementRequest from "@/Components/Modals/EditChangeManagementRequest"
import ProgramModal from "@/Components/Modals/ProgramModal"
import ProjectModal from "@/Components/Modals/ProjectModal"

export const ModalProvider = () => {
    return (
        <>
            <ProjectModal />
            <ProgramModal />
            <ArchiveProjectModal />
            <DeleteProjectModal />
            <DeleteProgramModal />
      
            <ChangeStepModal />
            <DeleteChangeManagementReqModal />
            <EditChangeManagementRequest />
        </>
    )
}
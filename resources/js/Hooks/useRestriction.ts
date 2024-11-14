const useRestriction = () => {
    const usePcRestriction = (department:string) => {
         return true
        const allowed_role =  ["MAIN PROJECT COORDINATOR","PC"]
        if( !allowed_role.includes(department.toLocaleUpperCase())){
           
            return false
        }
        return true
    }
    const useSwHeadRestriction = (department: string, position:string) => {
         return true
        const allowed_role =  ["SOFTWARE MANAGER"]
        if(department.toLocaleLowerCase() === "software" && allowed_role.includes(position.toLocaleUpperCase())){
            return true
      
        }
        return false
    }

    const useTesterRestriction = (department: string, position:string) => {
         return true
        const allowed_role =  ["SYSTEM TESTER"]
        if(department.toLocaleLowerCase() === "software" && allowed_role.includes(position.toLocaleUpperCase()) ){
            return true
      
        }
        return false
    }
    return{
        usePcRestriction,
        useSwHeadRestriction,
        useTesterRestriction
    }
}


export default useRestriction
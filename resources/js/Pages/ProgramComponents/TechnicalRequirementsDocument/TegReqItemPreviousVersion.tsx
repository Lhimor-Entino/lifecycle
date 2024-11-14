
import { Button } from "@/Components/ui/button"
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/Components/ui/sheet"
import { PageProps, TechnicalRequirementsDocumentItem } from "@/types"
import { FolderGit2, GitBranchIcon, GitForkIcon } from "lucide-react"

import {
  Command,
  CommandGroup,
  CommandItem,
  CommandList,
} from "@/Components/ui/command"
import { BellRing, Check } from "lucide-react"
 
import { cn } from "@/lib/utils"

import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/Components/ui/card"
import { Switch } from "@/Components/ui/switch"
 
import { usePage } from "@inertiajs/inertia-react"
import { Page } from "@inertiajs/inertia"
import { useEffect, useState } from "react"
interface Props{
  item: TechnicalRequirementsDocumentItem;
  id: number
}

 
type CardProps = React.ComponentProps<typeof Card>
const TegReqItemPreviousVersion = (props:Props) => {
  const {id,item} = props
  const {trd_items} = usePage<Page<PageProps>>().props
  const [trdData,setTrdData] = useState<TechnicalRequirementsDocumentItem>() 

  const getVersion = ()=>{
   

    const res = trd_items.filter(ti => ti.id === id);
    if (!res[0].test_case_id.includes("-")){
     return
 
  }  
    return res[0].test_case_id.split('-')[0]

  }

  
  const handleChangeVersion = (version_data:TechnicalRequirementsDocumentItem) => {

    const ver = version_data.test_case_id
    const res : TechnicalRequirementsDocumentItem[] = trd_items.filter(ti => ti.test_case_id === ver);
    const prev_v = trd_items.filter(ti => ti.test_case_id === res[0].test_case_id)
    setTrdData(prev_v[0])
  }

  useEffect(() => {
    const res = trd_items.filter(ti => ti.id === id);
    if (!res[0].test_case_id?.includes("-")){
      return
  
   }  
    const version = res[0].test_case_id?.split('-')[0]
    const prev_v = trd_items.filter(ti => ti.test_case_id?.split("-")[0] === version)
    setTrdData(prev_v[0])
  },[])

  const parseDescription = (descString: any) => {
    
    // console.log(descString)

    // const desc = JSON.parse(descString) || []

    const res = (descString || []).map((d:string,index: number) => <p><i className="mr-2">{index + 1}. </i>{d}</p> )
    return res
  }

    return (
        <Sheet>
              <SheetTrigger asChild>
                <Button variant={"ghost"}>
                  <FolderGit2 className='h-4 w-4 mr-2' />
                  View version(s)
                </Button>
             </SheetTrigger>
        
          <SheetContent style={{zIndex: 1000}} className=" overflow-auto" >
            <SheetHeader>
              <SheetTitle>List of Versions</SheetTitle>
              <SheetDescription>
                  TRD Testing Versions
              </SheetDescription>
            </SheetHeader>
              <Command className="rounded-lg border shadow-md mt-3 h-80">
                <CommandList>
                  
                  <CommandGroup heading="Previous Versions">
                  
                      {trd_items.map(ti => ti.test_case_id.split('-')[0] === getVersion() && ti.id !== id ?
                       <CommandItem key={ti.test_case_id} className="hover:cursor-pointer" onClickCapture={() => handleChangeVersion(ti)}>
                        
                        <GitForkIcon className="mr-2 h-4 w-4" />
                        <span>{ti.test_case_id}</span>
                       
                       
                      </CommandItem>: "" 
                    )}
                    
                  </CommandGroup>
               
                </CommandList>
            </Command>
            <Card className="mt-3" >
              <CardHeader>
                <CardTitle className=" text-md">Version Data</CardTitle>
                <CardDescription>Inputted data after testing</CardDescription>
              </CardHeader>
              <CardContent className="grid gap-4 border-none">
                  
                    {trdData?.is_active === 1 ?    <div>
                    <div className="mb-4 grid grid-cols-[25px_1fr] items-start pb-4 last:mb-0 last:pb-0">
                    <span className="flex h-2 w-2 translate-y-1 rounded-full bg-sky-500" />
                      <div className="space-y-1">
                        <p className="text-sm font-medium leading-none">
                          {"BRD Req. Description"}
                        
                        </p>
                        <p className="text-sm text-muted-foreground">
                      
                        {trdData?.req_description}
                        </p>
                      </div>
                    </div>

                    <div className="mb-4 grid grid-cols-[25px_1fr] items-start pb-4 last:mb-0 last:pb-0">
                      <span className="flex h-2 w-2 translate-y-1 rounded-full bg-sky-500" />
                      <div className="space-y-1">
                        <p className="text-sm font-medium leading-none">
                          {"Test Description"}
                        </p>
                        <p className="text-sm text-muted-foreground">
                        {/* {trdData?.test_case_description} */}
                                 {parseDescription(JSON.parse(trdData.test_case_description))}
                        </p>
                      </div>
                    </div>
                    <div className="mb-4 grid grid-cols-[25px_1fr] items-start pb-4 last:mb-0 last:pb-0">
                      <span  className={`${cn(trdData?.test_case_status ==="success" ?"bg-sky-500" :" bg-red-500")} flex h-2 w-2 translate-y-1 rounded-full`} />
                      <div className="space-y-1">
                        <p className="text-sm font-medium leading-none">
                          {"Test Status"}
                        </p>
                        <p className="text-sm text-muted-foreground">
                         {trdData?.test_case_status}
                        </p>
                      </div>
                    </div>
                </div>:""}
             
              </CardContent>

            </Card>
            
          </SheetContent>
        </Sheet>
      )
}

export default TegReqItemPreviousVersion
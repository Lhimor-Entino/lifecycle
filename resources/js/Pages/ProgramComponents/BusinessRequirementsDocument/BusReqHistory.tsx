import { BusinessRequirementsDocumentItem, Program } from "@/types"
import { Button } from "@/Components/ui/button"
import { Input } from "@/Components/ui/input"
import { Label } from "@/Components/ui/label"
import {
  Sheet,
  SheetClose,
  SheetContent,
  SheetDescription,
  SheetFooter,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/Components/ui/sheet"
import { ScrollArea } from "@/Components/ui/scroll-area"
import { Separator } from "@/Components/ui/separator"
import {FC, useState } from 'react';
import { CircleSlash2Icon, GitBranchIcon, GitForkIcon, HistoryIcon, Settings } from "lucide-react"
import {
    Command,
    CommandEmpty,
    CommandGroup,
    CommandInput,
    CommandItem,
    CommandList,
    CommandSeparator,
    CommandShortcut,
  } from "@/Components/ui/command"
  import {
    Table,
    TableBody,
    TableCaption,
    TableCell,
    TableFooter,
    TableHead,
    TableHeader,
    TableRow,
  } from "@/Components/ui/table"
interface Props{
    program: Program
}
const invoices = [
    {
      invoice: "INV001",
      paymentStatus: "Paid",
      totalAmount: "$250.00",
      paymentMethod: "Credit Card",
    },
  
  ]
   
const BusReqHistory:FC<Props> = ({program}) => {

    const [items,setItems] = useState<BusinessRequirementsDocumentItem[]>( program.business_requirement_document_history[0]?.items || []);
    const [currentVersion,setCurrentVersion] = useState<String>(`BRD-000${program.business_requirement_document_history[0]?.id}`)
    const handleClickVerion = (id:number) => {

        const filtered_bh = program.business_requirement_document_history.filter(bh => bh.id ===id);
        setCurrentVersion( `BRD-000${filtered_bh[0].id}`)
        setItems(filtered_bh[0].items)
    }

    console.log(program.business_requirement_document_history)

    
    return (
        <Sheet>
          <SheetTrigger asChild>
            <Button size={"sm"} variant="outline">
                <HistoryIcon  className='w-5 h-5 mr-2' />
                 BRD History
                </Button>
          </SheetTrigger>
          <SheetContent side={"bottom"}>
            <SheetHeader>
              <SheetTitle className=" uppercase">{program.name}</SheetTitle>
              <SheetDescription>
                Business Requirements History
              </SheetDescription>
            </SheetHeader>
                <div className="h-full w-full flex justify-center ">

        
                {program.business_requirement_document_history.length > 0 ?
                 <div className="  mt-5 flex justify-between w-full">
                 
                    <div className=" w-1/4">
                    <Command className="rounded-lg  shadow-md ">     
                        <CommandList>
                            <CommandSeparator />
                            <CommandGroup heading="Versions">
                            {(program.business_requirement_document_history ||[]).map((br,index) => (                  
                                <CommandItem key={index} className="hover:cursor-pointer" onClickCapture={() =>handleClickVerion(br.id)}>
                                    <GitForkIcon className="mr-2 h-4 w-4" />
                                    <span> {`BRD-000${br.id}`}</span>
                                   
                                </CommandItem>
                            ))}
                              
                            </CommandGroup>
                        </CommandList>
                    </Command>      
                    </div>

                 
                    <div className=" w-3/4 ml-5">                            
                        <Table className="w-full  h-48" >
                         <ScrollArea className=" h-80 w-full">
                            <TableHeader className=" sticky">
                                <TableRow>
                                <TableHead>Module</TableHead>
                                <TableHead>Applicable Roles</TableHead>
                                <TableHead>Description</TableHead>
                                </TableRow>
                            </TableHeader>
                    
                            <TableBody className="w-full">
                          
                    
          
                                 {items.map((item) => (
                                        <TableRow key={item.id}>
                                            <TableCell className="font-medium">{item.module}</TableCell>
                                            <TableCell>{item.applicable_roles}</TableCell>
                                            <TableCell>{item.description}</TableCell>               
                                        </TableRow>
                                        ))} 
                            

                            
                            
                                    </TableBody>
                          
                            <TableFooter>
                                <TableRow>
                                {/* <TableCell colSpan={6} className=" text-center">A list of your modules in version <span className="text-red-700">{`${currentVersion}`}</span> .</TableCell>
                                */}
                                </TableRow>
                            </TableFooter>
                            </ScrollArea>
                        </Table>
                    </div>
                 
              
                 </div> 
                 : <div className="mt-20 flex pb-10"> <CircleSlash2Icon className='w-5 h-5 mr-2 '  /> <p>There's nothing here.</p></div>
                }

                </div>
        
     
          </SheetContent>
        </Sheet>
      )
}

export default BusReqHistory
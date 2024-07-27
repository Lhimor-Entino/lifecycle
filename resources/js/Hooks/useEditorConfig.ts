import Image from "@tiptap/extension-image";
import Link from "@tiptap/extension-link";
import Table from "@tiptap/extension-table";
import TableCell from "@tiptap/extension-table-cell";
import TableHeader from "@tiptap/extension-table-header";
import TableRow from "@tiptap/extension-table-row";
import { useEditor } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";

const useEditorConfig = () =>{
    
    const editor = useEditor({
        extensions:[
            StarterKit,
            Table.configure({
                resizable: true,
            }),
            TableRow,
            TableHeader,
            TableCell,
            Image.configure({
                allowBase64: true,
                HTMLAttributes: {
                    //class: 'aspect-video h-[55px]',
                    style :"aspect-ratio: 16 / 9;height: 55px; margin-left: auto;"
                },
            }),
            Link
        ]
    });
    return {editor};
}


export default useEditorConfig

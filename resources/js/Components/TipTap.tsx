import { Editor, EditorContent } from '@tiptap/react';
import {FC, useEffect} from 'react';
import MenuBar from './TipTap/MenuBar';


interface Props{
    content:string;
    editor:Editor;
}

const TipTap:FC<Props> = ({content,editor}) => {
    
    useEffect(()=>{
        if(content){
            editor.commands.setContent(content);
        }
    },[content,editor]);
    
    return (
        <div className='flex flex-col space-y-1'>
            <MenuBar editor={editor} />
            <EditorContent editor={editor}   />
        </div>

    );
}

export default TipTap
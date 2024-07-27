import {  Editor, useCurrentEditor } from '@tiptap/react';
import { Bold, Code2, Heading, Heading1, Heading2, Heading3, Heading4, Heading5, Heading6, Italic, List, ListOrdered, Quote, Strikethrough } from 'lucide-react';
import {FC} from 'react';
import { Button } from '../ui/button';

interface Props{
    editor:Editor
}

const MenuBar:FC<Props> = ({editor}) => {
    

    return (
        <div className='w-full flex flex-wrap gap-1.5 z-50 py-2.5'>
            <Button
                onClick={() => editor?.chain().focus().toggleBold().run()}
                disabled={
                !editor?.can()
                    .chain()
                    .focus()
                    .toggleBold()
                    .run()
                }
                className='!p-1 aspect-square'
                variant={editor?.isActive('bold')?'default':'outline'}
            >
                <Bold className='h-4 w-4 ' />
            </Button>
            <Button
                onClick={() => editor?.chain().focus().toggleItalic().run()}
                disabled={
                !editor?.can()
                    .chain()
                    .focus()
                    .toggleItalic()
                    .run()
                }
                className='!p-1 aspect-square'
                variant={editor?.isActive('italic')?'default':'outline'}
            >
                <Italic className='h-4 w-4' />
            </Button>
            <Button
                onClick={() => editor?.chain().focus().toggleStrike().run()}
                disabled={
                !editor?.can()
                    .chain()
                    .focus()
                    .toggleStrike()
                    .run()
                }
                className='!p-1 aspect-square'
                variant={editor?.isActive('strike')?'default':'outline'}
            >
                <Strikethrough className='h-4 w-4' />
            </Button>
            {/* <Button
                onClick={() => editor?.chain().focus().toggleCode().run()}
                disabled={
                !editor?.can()
                    .chain()
                    .focus()
                    .toggleCode()
                    .run()
                }
                className='!p-1 aspect-square'
                variant={editor?.isActive('code')?'default':'outline'}
            >
                <Code2 className='h-4 w-4' />
            </Button> */}
            <Button
                onClick={() => editor?.chain().focus().setParagraph().run()}
                className='!p-1 aspect-square'
                variant={editor?.isActive('paragraph')?'default':'outline'}
            >
                <Heading className='h4 w-4' />
            </Button>
            <Button
                onClick={() => editor?.chain().focus().toggleHeading({ level: 1 }).run()}
                className='!p-1 aspect-square'
                variant={editor?.isActive('heading', { level: 1 })?'default':'outline'}
            >
                <Heading1 className='h-4 w-4' />
            </Button>
            <Button
                onClick={() => editor?.chain().focus().toggleHeading({ level: 2 }).run()}
                className='!p-1 aspect-square'
                variant={editor?.isActive('heading', { level: 2 })?'default':'outline'}
            >
                <Heading2 className='h-4 w-4' />
            </Button>
            <Button
                onClick={() => editor?.chain().focus().toggleHeading({ level: 3 }).run()}
                className='!p-1 aspect-square'
                variant={editor?.isActive('heading', { level: 3 })?'default':'outline'}
            >
                <Heading3 className='h-4 w-4' />
            </Button>
            <Button
                onClick={() => editor?.chain().focus().toggleHeading({ level: 4 }).run()}
                className='!p-1 aspect-square'
                variant={editor?.isActive('heading', { level: 4 })?'default':'outline'}
            >
                <Heading4 className='h-4 w-4' />
            </Button>
            <Button
                onClick={() => editor?.chain().focus().toggleHeading({ level: 5 }).run()}
                className='!p-1 aspect-square'
                variant={editor?.isActive('heading', { level: 5 })?'default':'outline'}
            >
                <Heading5 className='h-4 w-4' />
            </Button>
            <Button
                onClick={() => editor?.chain().focus().toggleHeading({ level: 6 }).run()}
                className='!p-1 aspect-square'
                variant={editor?.isActive('heading', { level: 6 })?'default':'outline'}
            >
                <Heading6 className='h-4 w-4' />
            </Button>
            <Button
                onClick={() => editor?.chain().focus().toggleBulletList().run()}
                className='!p-1 aspect-square'
                variant={editor?.isActive('bulletList')?'default':'outline'}
            >
                <List className='h-4 w-4' />
            </Button>
            <Button
                onClick={() => editor?.chain().focus().toggleOrderedList().run()}                
                className='!p-1 aspect-square'
                variant={editor?.isActive('orderedList')?'default':'outline'}
            >
                <ListOrdered className='h-4 w-4' />
            </Button>
            <Button
                onClick={() => editor?.chain().focus().toggleCodeBlock().run()}             
                className='!p-1 aspect-square'
                variant={editor?.isActive('codeBlock')?'default':'outline'}
            >
                <Code2 className='h-4 w-4'/>
            </Button>
            <Button
                onClick={() => editor?.chain().focus().toggleBlockquote().run()}
                className='!p-1 aspect-square'
                variant={editor?.isActive('blockquote')?'default':'outline'}
            >
                <Quote className='h-4 w-4'/>
            </Button>
            
        </div>
    );
}

export default MenuBar;
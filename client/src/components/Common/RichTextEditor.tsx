import { useEditor, EditorContent } from '@tiptap/react'
import StarterKit from '@tiptap/starter-kit'
import './RichTextEditor.css'
import { 
  FormatBold, 
  FormatItalic, 
  FormatStrikethrough,
  Title,
  FormatListBulleted,
  FormatListNumbered,
  Code
} from '@mui/icons-material'
import { IconButton, Tooltip, Divider } from '@mui/material'
import { useEffect } from 'react'

interface RichTextEditorProps {
  value?: string;
  onChange?: (value: string) => void;
  readOnly?: boolean;
  id?: string;
}

const RichTextEditor = ({ value, onChange, readOnly = false, id }: RichTextEditorProps) => {
  console.log('RichTextEditor rendering with value:', value);
  
  const editor = useEditor({
    extensions: [
      StarterKit,
    ],
    content: value || '',
    editable: !readOnly,
    onUpdate: ({ editor }) => {
      const html = editor.getHTML();
      console.log('Editor content updated:', html);
      onChange?.(html);
    },
    onCreate: ({ editor }) => {
      editor.commands.setContent(value || '');
    }
  });

  // Update editor content when value prop changes
  useEffect(() => {
    console.log('Value prop changed:', value);
    if (editor && value !== editor.getHTML()) {
      console.log('Setting editor content');
      editor.commands.setContent(value || '');
    }
  }, [value, editor]);

  return (
    <div style={{ height: '100%', backgroundColor: 'white', border: '1px solid #ccc' }}>
      {!readOnly && (
        <div className="editor-toolbar">
          <div className="toolbar-group">
            <Tooltip title="Bold">
              <IconButton 
                size="small"
                onClick={() => editor?.chain().focus().toggleBold().run()}
                color={editor?.isActive('bold') ? 'primary' : 'default'}
              >
                <FormatBold />
              </IconButton>
            </Tooltip>
            <Tooltip title="Italic">
              <IconButton 
                size="small"
                onClick={() => editor?.chain().focus().toggleItalic().run()}
                color={editor?.isActive('italic') ? 'primary' : 'default'}
              >
                <FormatItalic />
              </IconButton>
            </Tooltip>
            <Tooltip title="Strikethrough">
              <IconButton 
                size="small"
                onClick={() => editor?.chain().focus().toggleStrike().run()}
                color={editor?.isActive('strike') ? 'primary' : 'default'}
              >
                <FormatStrikethrough />
              </IconButton>
            </Tooltip>
          </div>

          <Divider orientation="vertical" flexItem sx={{ mx: 1 }} />

          <div className="toolbar-group">
            <Tooltip title="Heading 1">
              <IconButton 
                size="small"
                onClick={() => editor?.chain().focus().toggleHeading({ level: 1 }).run()}
                color={editor?.isActive('heading', { level: 1 }) ? 'primary' : 'default'}
              >
                <Title />
              </IconButton>
            </Tooltip>
            <Tooltip title="Heading 2">
              <IconButton 
                size="small"
                onClick={() => editor?.chain().focus().toggleHeading({ level: 2 }).run()}
                color={editor?.isActive('heading', { level: 2 }) ? 'primary' : 'default'}
                sx={{ '& .MuiSvgIcon-root': { fontSize: '1.25rem' } }}
              >
                <Title />
              </IconButton>
            </Tooltip>
          </div>

          <Divider orientation="vertical" flexItem sx={{ mx: 1 }} />

          <div className="toolbar-group">
            <Tooltip title="Bullet List">
              <IconButton 
                size="small"
                onClick={() => editor?.chain().focus().toggleBulletList().run()}
                color={editor?.isActive('bulletList') ? 'primary' : 'default'}
              >
                <FormatListBulleted />
              </IconButton>
            </Tooltip>
            <Tooltip title="Numbered List">
              <IconButton 
                size="small"
                onClick={() => editor?.chain().focus().toggleOrderedList().run()}
                color={editor?.isActive('orderedList') ? 'primary' : 'default'}
              >
                <FormatListNumbered />
              </IconButton>
            </Tooltip>
          </div>

          <Divider orientation="vertical" flexItem sx={{ mx: 1 }} />

          <div className="toolbar-group">
            <Tooltip title="Code Block">
              <IconButton 
                size="small"
                onClick={() => editor?.chain().focus().toggleCodeBlock().run()}
                color={editor?.isActive('codeBlock') ? 'primary' : 'default'}
              >
                <Code />
              </IconButton>
            </Tooltip>
          </div>
        </div>
      )}
      <EditorContent editor={editor} />
    </div>
  );
};

export default RichTextEditor; 
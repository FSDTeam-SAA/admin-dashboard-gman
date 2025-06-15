"use client"

import { useState, useRef, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import {
  Bold,
  Italic,
  Underline,
  AlignLeft,
  AlignCenter,
  AlignRight,
  AlignJustify,
  List,
  ListOrdered,
} from "lucide-react"

interface RichTextEditorProps {
  content: string
  onChange: (content: string) => void
  placeholder?: string
}

export function RichTextEditor({ content, onChange, placeholder = "Start typing..." }: RichTextEditorProps) {
  const editorRef = useRef<HTMLDivElement>(null)
  const [selectedHeading, setSelectedHeading] = useState("Normal")

  useEffect(() => {
    if (editorRef.current && content !== editorRef.current.innerHTML) {
      editorRef.current.innerHTML = content
    }
  }, [content])

  const handleInput = () => {
    if (editorRef.current) {
      onChange(editorRef.current.innerHTML)
    }
  }

  const executeCommand = (command: string, value?: string) => {
    editorRef.current?.focus()
    document.execCommand(command, false, value)
    handleInput()
  }

  const handleHeadingChange = (heading: string) => {
    setSelectedHeading(heading)
    editorRef.current?.focus()

    if (heading === "Normal") {
      document.execCommand("formatBlock", false, "div")
    } else {
      document.execCommand("formatBlock", false, heading.toLowerCase())
    }
    handleInput()
  }

  const insertOrderedList = () => {
    editorRef.current?.focus()
    document.execCommand("insertOrderedList", false)
    handleInput()
  }

  const insertUnorderedList = () => {
    editorRef.current?.focus()
    document.execCommand("insertUnorderedList", false)
    handleInput()
  }

  return (
    <div className="border rounded-lg overflow-hidden">
      {/* Toolbar */}
      <div className="border-b bg-gray-50 p-3 flex items-center gap-4 flex-wrap">
        <div className="flex items-center gap-2">
          <span className="text-sm font-medium">Heading</span>
          <Select value={selectedHeading} onValueChange={handleHeadingChange}>
            <SelectTrigger className="w-32">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="Normal">Normal</SelectItem>
              <SelectItem value="h1">Heading 1</SelectItem>
              <SelectItem value="h2">Heading 2</SelectItem>
              <SelectItem value="h3">Heading 3</SelectItem>
              <SelectItem value="h4">Heading 4</SelectItem>
              <SelectItem value="h5">Heading 5</SelectItem>
              <SelectItem value="h6">Heading 6</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div className="h-6 w-px bg-gray-300" />

        <div className="flex items-center gap-1">
          <Button
            type="button"
            variant="ghost"
            size="sm"
            onClick={() => executeCommand("bold")}
            className="h-8 w-8 p-0"
            title="Bold"
          >
            <Bold className="h-4 w-4" />
          </Button>
          <Button
            type="button"
            variant="ghost"
            size="sm"
            onClick={() => executeCommand("italic")}
            className="h-8 w-8 p-0"
            title="Italic"
          >
            <Italic className="h-4 w-4" />
          </Button>
          <Button
            type="button"
            variant="ghost"
            size="sm"
            onClick={() => executeCommand("underline")}
            className="h-8 w-8 p-0"
            title="Underline"
          >
            <Underline className="h-4 w-4" />
          </Button>
        </div>

        <div className="h-6 w-px bg-gray-300" />

        <div className="flex items-center gap-1">
          <Button
            type="button"
            variant="ghost"
            size="sm"
            onClick={() => executeCommand("justifyLeft")}
            className="h-8 w-8 p-0"
            title="Align Left"
          >
            <AlignLeft className="h-4 w-4" />
          </Button>
          <Button
            type="button"
            variant="ghost"
            size="sm"
            onClick={() => executeCommand("justifyCenter")}
            className="h-8 w-8 p-0"
            title="Align Center"
          >
            <AlignCenter className="h-4 w-4" />
          </Button>
          <Button
            type="button"
            variant="ghost"
            size="sm"
            onClick={() => executeCommand("justifyRight")}
            className="h-8 w-8 p-0"
            title="Align Right"
          >
            <AlignRight className="h-4 w-4" />
          </Button>
          <Button
            type="button"
            variant="ghost"
            size="sm"
            onClick={() => executeCommand("justifyFull")}
            className="h-8 w-8 p-0"
            title="Justify"
          >
            <AlignJustify className="h-4 w-4" />
          </Button>
        </div>

        <div className="h-6 w-px bg-gray-300" />

        <div className="flex items-center gap-1">
          <Button
            type="button"
            variant="ghost"
            size="sm"
            onClick={insertUnorderedList}
            className="h-8 w-8 p-0"
            title="Bullet List"
          >
            <List className="h-4 w-4" />
          </Button>
          <Button
            type="button"
            variant="ghost"
            size="sm"
            onClick={insertOrderedList}
            className="h-8 w-8 p-0"
            title="Numbered List (1, 2, 3...)"
          >
            <ListOrdered className="h-4 w-4" />
          </Button>
        </div>
      </div>

      {/* Editor */}
      <div
        ref={editorRef}
        contentEditable
        onInput={handleInput}
        className="min-h-[300px] p-4 focus:outline-none"
        style={{
          minHeight: "300px",
          lineHeight: "1.6",
        }}
        data-placeholder={placeholder}
        suppressContentEditableWarning={true}
      />

      <style jsx global>{`
        [contenteditable]:empty:before {
          content: attr(data-placeholder);
          color: #9ca3af;
          pointer-events: none;
          font-style: italic;
        }
        
        [contenteditable] h1 {
          font-size: 2rem;
          font-weight: 700;
          line-height: 1.2;
          margin: 1rem 0;
          color: #1f2937;
        }
        
        [contenteditable] h2 {
          font-size: 1.5rem;
          font-weight: 600;
          line-height: 1.3;
          margin: 0.875rem 0;
          color: #1f2937;
        }
        
        [contenteditable] h3 {
          font-size: 1.25rem;
          font-weight: 600;
          line-height: 1.4;
          margin: 0.75rem 0;
          color: #1f2937;
        }
        
        [contenteditable] h4 {
          font-size: 1.125rem;
          font-weight: 600;
          line-height: 1.4;
          margin: 0.625rem 0;
          color: #1f2937;
        }
        
        [contenteditable] h5 {
          font-size: 1rem;
          font-weight: 600;
          line-height: 1.5;
          margin: 0.5rem 0;
          color: #1f2937;
        }
        
        [contenteditable] h6 {
          font-size: 0.875rem;
          font-weight: 600;
          line-height: 1.5;
          margin: 0.5rem 0;
          color: #1f2937;
        }
        
        [contenteditable] ol {
          list-style-type: decimal;
          margin: 1rem 0;
          padding-left: 2rem;
        }
        
        [contenteditable] ul {
          list-style-type: disc;
          margin: 1rem 0;
          padding-left: 2rem;
        }
        
        [contenteditable] li {
          margin: 0.25rem 0;
          line-height: 1.6;
        }
        
        [contenteditable] ol ol {
          list-style-type: lower-alpha;
        }
        
        [contenteditable] ol ol ol {
          list-style-type: lower-roman;
        }
        
        [contenteditable] ul ul {
          list-style-type: circle;
        }
        
        [contenteditable] ul ul ul {
          list-style-type: square;
        }
        
        [contenteditable] p {
          margin: 0.5rem 0;
          line-height: 1.6;
        }
        
        [contenteditable]:focus {
          outline: none;
        }
        
        [contenteditable] strong {
          font-weight: 700;
        }
        
        [contenteditable] em {
          font-style: italic;
        }
        
        [contenteditable] u {
          text-decoration: underline;
        }
      `}</style>
    </div>
  )
}

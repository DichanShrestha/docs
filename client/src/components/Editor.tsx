// components/Editor.tsx
import { FC, useEffect } from "react";
import { useEditor, EditorContent } from "@tiptap/react";
// 1. StarterKit brings in bold, italic, headings, lists, paragraphs…
import StarterKit from "@tiptap/starter-kit";
// 2. Underline and horizontal rule are community extensions
import Underline from "@tiptap/extension-underline";
import HorizontalRule from "@tiptap/extension-horizontal-rule";
// 3. Placeholder just shows “Start typing…” when empty
import Placeholder from "@tiptap/extension-placeholder";
// 4. Our custom Toggle (collapsible) node
import { Toggle } from "@/extensions/Toggle";
import { MenuBar } from "@/extensions/MenuBar";
// 5. The toolbar that ties buttons to editor commands

interface EditorProps {
  content?: string;
}

const Editor: FC<EditorProps> = ({ content = "" }) => {
  // ────────────────────────────────────────────────────────────────
  // Editor instantiation & React integration
  // ────────────────────────────────────────────────────────────────
  const editor = useEditor({
    // a) assemble all the extensions you need
    extensions: [
      StarterKit, // bold, italic, lists, headings…
      Underline, // underline support
      HorizontalRule, // insert <hr>
      Toggle, // our custom collapsible block
      Placeholder.configure({ placeholder: "Start typing…" }),
    ],
    // b) load initial HTML if provided
    content,
    // c) optional: hook into updates (e.g. to save to server)
    onUpdate: ({ editor }) => {
      // console.log('Current HTML:', editor.getHTML())
    },
  });

  // clean up on unmount
  useEffect(() => {
    return () => editor?.destroy();
  }, [editor]);

  return (
    <div style={{ maxWidth: 700, margin: "2rem auto" }}>
      {/* ────────────────────────────────────────────────────────────────
          3. UI ↔ Editor synchronization:
             the MenuBar reads editor.isActive(...) and calls
             editor.chain().focus().toggleX().run()
         ──────────────────────────────────────────────────────────────── */}
      <MenuBar editor={editor} />

      {/* EditorContent is the actual <div contenteditable> */}
      <EditorContent editor={editor} />
    </div>
  );
};

export default Editor;

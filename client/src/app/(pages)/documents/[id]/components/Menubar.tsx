import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Toggle } from "@/components/ui/toggle";
import { Separator } from "@/components/ui/separator";
import { Button } from "@/components/ui/button";
import {
  Bold,
  Italic,
  Strikethrough,
  Code,
  Heading1,
  Heading2,
  Heading3,
  ListOrdered,
  List,
  Quote,
  Redo,
  Undo,
  AlignLeft,
  RemoveFormatting,
  Pilcrow,
  Minus,
  SquareCode,
  PaintBucket,
} from "lucide-react";

export const MenuBar = ({ editor }: { editor: any }) => {
  if (!editor) return null;

  return (
    <div className="bg-white border rounded-t-lg shadow-sm">
      <Tabs defaultValue="format" className="w-full">
        <TabsList className="grid grid-cols-3 mb-2">
          <TabsTrigger value="format">Format</TabsTrigger>
          <TabsTrigger value="paragraph">Paragraph</TabsTrigger>
          <TabsTrigger value="actions">Actions</TabsTrigger>
        </TabsList>
        <TabsContent value="format" className="px-1 py-2">
          <div className="flex flex-wrap gap-1">
            {/* Formatting Buttons */}
            <Toggle
              size="sm"
              pressed={editor.isActive("bold")}
              onPressedChange={() => editor.chain().focus().toggleBold().run()}
            >
              <Bold className="h-4 w-4" />
            </Toggle>
            <Toggle
              size="sm"
              pressed={editor.isActive("italic")}
              onPressedChange={() =>
                editor.chain().focus().toggleItalic().run()
              }
            >
              <Italic className="h-4 w-4" />
            </Toggle>
            <Toggle
              size="sm"
              pressed={editor.isActive("strike")}
              onPressedChange={() =>
                editor.chain().focus().toggleStrike().run()
              }
            >
              <Strikethrough className="h-4 w-4" />
            </Toggle>
            <Toggle
              size="sm"
              pressed={editor.isActive("code")}
              onPressedChange={() => editor.chain().focus().toggleCode().run()}
            >
              <Code className="h-4 w-4" />
            </Toggle>

            <Separator orientation="vertical" className="mx-1 h-8" />

            {/* Headings */}
            <Toggle
              size="sm"
              pressed={editor.isActive("heading", { level: 1 })}
              onPressedChange={() =>
                editor.chain().focus().toggleHeading({ level: 1 }).run()
              }
            >
              <Heading1 className="h-4 w-4" />
            </Toggle>
            <Toggle
              size="sm"
              pressed={editor.isActive("heading", { level: 2 })}
              onPressedChange={() =>
                editor.chain().focus().toggleHeading({ level: 2 }).run()
              }
            >
              <Heading2 className="h-4 w-4" />
            </Toggle>
            <Toggle
              size="sm"
              pressed={editor.isActive("heading", { level: 3 })}
              onPressedChange={() =>
                editor.chain().focus().toggleHeading({ level: 3 }).run()
              }
            >
              <Heading3 className="h-4 w-4" />
            </Toggle>

            <Separator orientation="vertical" className="mx-1 h-8" />

            {/* Lists, quote */}
            <Toggle
              size="sm"
              pressed={editor.isActive("bulletList")}
              onPressedChange={() =>
                editor.chain().focus().toggleBulletList().run()
              }
            >
              <List className="h-4 w-4" />
            </Toggle>
            <Toggle
              size="sm"
              pressed={editor.isActive("orderedList")}
              onPressedChange={() =>
                editor.chain().focus().toggleOrderedList().run()
              }
            >
              <ListOrdered className="h-4 w-4" />
            </Toggle>
            <Toggle
              size="sm"
              pressed={editor.isActive("blockquote")}
              onPressedChange={() =>
                editor.chain().focus().toggleBlockquote().run()
              }
            >
              <Quote className="h-4 w-4" />
            </Toggle>

            <Separator orientation="vertical" className="mx-1 h-8" />

            <Button
              variant="outline"
              size="icon"
              className="h-8 w-8"
              onClick={() => editor.chain().focus().setColor("#958DF1").run()}
            >
              <PaintBucket className="h-4 w-4 text-purple-500" />
            </Button>
          </div>
        </TabsContent>

        <TabsContent value="paragraph" className="px-1 py-2">
          <div className="flex flex-wrap gap-1">
            <Toggle
              size="sm"
              pressed={editor.isActive("paragraph")}
              onPressedChange={() =>
                editor.chain().focus().setParagraph().run()
              }
            >
              <Pilcrow className="h-4 w-4" />
            </Toggle>
            <Toggle
              size="sm"
              pressed={editor.isActive("codeBlock")}
              onPressedChange={() =>
                editor.chain().focus().toggleCodeBlock().run()
              }
            >
              <SquareCode className="h-4 w-4" />
            </Toggle>
            <Button
              variant="outline"
              size="icon"
              className="h-8 w-8"
              onClick={() => editor.chain().focus().setHorizontalRule().run()}
            >
              <Minus className="h-4 w-4" />
            </Button>
            <Button
              variant="outline"
              size="icon"
              className="h-8 w-8"
              onClick={() => editor.chain().focus().setHardBreak().run()}
            >
              <AlignLeft className="h-4 w-4" />
            </Button>
          </div>
        </TabsContent>

        <TabsContent value="actions" className="px-1 py-2">
          <div className="flex flex-wrap gap-1">
            <Button
              variant="outline"
              size="icon"
              className="h-8 w-8"
              onClick={() => editor.chain().focus().undo().run()}
            >
              <Undo className="h-4 w-4" />
            </Button>
            <Button
              variant="outline"
              size="icon"
              className="h-8 w-8"
              onClick={() => editor.chain().focus().redo().run()}
            >
              <Redo className="h-4 w-4" />
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={() => editor.chain().focus().unsetAllMarks().run()}
            >
              <RemoveFormatting className="h-4 w-4 mr-2" />
              Clear marks
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={() => editor.chain().focus().clearNodes().run()}
            >
              <RemoveFormatting className="h-4 w-4 mr-2" />
              Clear nodes
            </Button>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
};

"use client";

import { useCallback, useEffect, useState, useRef } from "react";
import { useRouter } from "next/navigation";
import { useEditor, EditorContent } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import Collaboration from "@tiptap/extension-collaboration";
import CollaborationCursor from "@tiptap/extension-collaboration-cursor";
import Placeholder from "@tiptap/extension-placeholder";
import * as Y from "yjs";
import { WebrtcProvider } from "y-webrtc";
import {
  ArrowLeft,
  Download,
  Save,
  Share,
  Users,
  Check,
  Copy,
  ExternalLink,
} from "lucide-react";

import { Button } from "@/components/ui/button";
import { Toolbar } from "@/components/toolbar";
import { CollaboratorsList } from "@/components/collaborators-list";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

// Simple toast implementation since we removed the dependencies
const useToast = () => {
  const showToast = (
    message: string,
    type: "success" | "error" = "success"
  ) => {
    // Create toast element
    const toast = document.createElement("div");
    toast.className = `fixed bottom-4 right-4 z-50 rounded-md p-4 shadow-md animate-fade-in ${
      type === "success"
        ? "bg-green-100 text-green-800"
        : "bg-red-100 text-red-800"
    }`;
    toast.textContent = message;

    // Add to DOM
    document.body.appendChild(toast);

    // Remove after 3 seconds
    setTimeout(() => {
      toast.classList.replace("animate-fade-in", "animate-fade-out");
      setTimeout(() => {
        document.body.removeChild(toast);
      }, 200);
    }, 3000);
  };

  return {
    toast: ({
      title,
      description,
      variant,
    }: {
      title: string;
      description?: string;
      variant?: "destructive";
    }) => {
      showToast(
        description || title,
        variant === "destructive" ? "error" : "success"
      );
    },
  };
};

// Generate a random user color for collaboration
const userColors = [
  "#f0c3f0", // Light purple
  "#c3e1f0", // Light blue
  "#f0d9c3", // Light orange
  "#c3f0c7", // Light green
  "#e5c3f0", // Light lavender
];

const getRandomColor = () => {
  return userColors[Math.floor(Math.random() * userColors.length)];
};

// Generate a random user name for demo purposes
const demoNames = [
  "Alex Smith",
  "Jamie Doe",
  "Taylor Johnson",
  "Morgan Lee",
  "Casey Brown",
];
const getRandomName = () => {
  return demoNames[Math.floor(Math.random() * demoNames.length)];
};

// Get initials from name
const getInitials = (name: string) => {
  return name
    .split(" ")
    .map((part) => part[0])
    .join("")
    .toUpperCase();
};

interface DocumentEditorProps {
  documentId: string;
  initialContent: any | null;
  isNewDocument: boolean;
}

export default function DocumentEditor({
  documentId,
  initialContent,
  isNewDocument,
}: DocumentEditorProps) {
  const router = useRouter();
  const { toast } = useToast();
  const [isSaving, setIsSaving] = useState(false);
  const [documentTitle, setDocumentTitle] = useState(
    initialContent?.title || "Untitled Document"
  );
  const [showCollaborators, setShowCollaborators] = useState(false);
  const [activeCollaborators, setActiveCollaborators] = useState<any[]>([]);
  const [shareDialogOpen, setShareDialogOpen] = useState(false);
  const [shareLink, setShareLink] = useState("");
  const [shareEmail, setShareEmail] = useState("");
  const [linkCopied, setLinkCopied] = useState(false);

  // Use refs to prevent re-creation on each render
  const ydocRef = useRef<Y.Doc>(new Y.Doc());
  const providerRef = useRef<WebrtcProvider | null>(null);
  const userNameRef = useRef(getRandomName());
  const userColorRef = useRef(getRandomColor());
  const userInitialsRef = useRef(getInitials(userNameRef.current));

  // Set up Yjs document for collaboration - only once
  useEffect(() => {
    if (!providerRef.current) {
      providerRef.current = new WebrtcProvider(
        `precious-docs-${documentId}`,
        ydocRef.current
      );

      // Set up user information for collaboration
      providerRef.current.awareness.setLocalStateField("user", {
        name: userNameRef.current,
        color: userColorRef.current,
        initials: userInitialsRef.current,
      });
    }

    return () => {
      if (providerRef.current) {
        providerRef.current.destroy();
        providerRef.current = null;
      }
      ydocRef.current.destroy();
    };
  }, [documentId]);

  // Generate share link
  useEffect(() => {
    setShareLink(`${window.location.origin}/documents/${documentId}`);
  }, [documentId]);

  // Track active collaborators
  useEffect(() => {
    if (!providerRef.current) return;

    const updateCollaborators = () => {
      const states = providerRef.current?.awareness.getStates();
      if (!states) return;

      const collaborators: any[] = [];
      states.forEach((state, clientId) => {
        if (
          state.user &&
          clientId !== providerRef.current?.awareness.clientID
        ) {
          collaborators.push({
            id: clientId,
            ...state.user,
          });
        }
      });

      setActiveCollaborators(collaborators);
    };

    providerRef.current.awareness.on("change", updateCollaborators);
    updateCollaborators(); // Initial call

    return () => {
      providerRef.current?.awareness.off("change", updateCollaborators);
    };
  }, []);

  // Set up the editor
  const editor = useEditor({
    extensions: [
      StarterKit,
      Placeholder.configure({
        placeholder: "Start writing your document...",
      }),
      Collaboration.configure({
        document: ydocRef.current,
      }),
      CollaborationCursor.configure({
        provider: providerRef.current!,
        user: {
          name: userNameRef.current,
          color: userColorRef.current,
        },
      }),
    ],
    content: initialContent?.content || "",
    autofocus: true,
    editorProps: {
      attributes: {
        class:
          "prose prose-slate max-w-none focus:outline-none min-h-[300px] px-8 py-4",
      },
    },
    onUpdate: ({ editor }) => {
      // Auto-save on changes (debounced in a real app)
      // This is just for demonstration
      console.log("Content updated, would auto-save in a real app");
    },
  });

  const saveDocument = useCallback(async () => {
    if (!editor) return;

    setIsSaving(true);

    try {
      // Get the document content
      const content = editor.getJSON();

      // In a real app, you would save to your database
      console.log("Saving document:", {
        id: documentId,
        title: documentTitle,
        content,
      });

      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 800));

      // Show success toast
      toast({
        title: "Document saved",
        description: "Your document has been saved successfully.",
      });

      // If this is a new document, redirect to the document page
      if (isNewDocument) {
        router.push(`/documents/${documentId}`);
      }
    } catch (error) {
      console.error("Error saving document:", error);
      toast({
        title: "Save failed",
        description:
          "There was an error saving your document. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsSaving(false);
    }
  }, [editor, documentId, documentTitle, isNewDocument, router, toast]);

  const downloadDocument = useCallback(() => {
    if (!editor) return;

    // Get the document content as HTML
    const html = `
      <!DOCTYPE html>
      <html>
      <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>${documentTitle}</title>
        <style>
          body {
            font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif;
            line-height: 1.6;
            color: #333;
            max-width: 800px;
            margin: 0 auto;
            padding: 20px;
          }
          h1, h2, h3, h4, h5, h6 {
            margin-top: 1.5em;
            margin-bottom: 0.5em;
          }
          p {
            margin: 1em 0;
          }
          blockquote {
            border-left: 4px solid #ddd;
            padding-left: 1em;
            margin-left: 0;
            color: #666;
          }
          pre {
            background: #f5f5f5;
            padding: 1em;
            border-radius: 4px;
            overflow-x: auto;
          }
          img {
            max-width: 100%;
          }
        </style>
      </head>
      <body>
        <h1>${documentTitle}</h1>
        ${editor.getHTML()}
        <footer>
          <p><small>Generated from Precious Docs on ${new Date().toLocaleDateString()}</small></p>
        </footer>
      </body>
      </html>
    `;

    // Create a blob and download it
    const blob = new Blob([html], { type: "text/html" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `${documentTitle.replace(/\s+/g, "-").toLowerCase()}.html`;
    a.click();
    URL.revokeObjectURL(url);

    toast({
      title: "Document downloaded",
      description: "Your document has been downloaded as HTML.",
    });
  }, [editor, documentTitle, toast]);

  const copyShareLink = useCallback(() => {
    navigator.clipboard.writeText(shareLink);
    setLinkCopied(true);
    setTimeout(() => setLinkCopied(false), 2000);

    toast({
      title: "Link copied",
      description: "Share link copied to clipboard.",
    });
  }, [shareLink, toast]);

  const shareViaEmail = useCallback(() => {
    if (!shareEmail) return;

    // In a real app, you would send an invitation email
    console.log(`Sharing document with ${shareEmail}`);

    toast({
      title: "Invitation sent",
      description: `An invitation has been sent to ${shareEmail}.`,
    });

    setShareEmail("");
  }, [shareEmail, toast]);

  // Auto-save on interval
  useEffect(() => {
    const interval = setInterval(() => {
      if (editor && !isSaving) {
        console.log("Auto-saving document...");
        // In a real app, you would implement actual saving logic here
      }
    }, 30000); // Every 30 seconds

    return () => clearInterval(interval);
  }, [editor, isSaving]);

  return (
    <div className="flex h-screen flex-col">
      {/* Header */}
      <header className="flex items-center justify-between border-b border-slate-200 bg-white px-4 py-2 shadow-sm">
        <div className="flex items-center">
          <Button
            variant="ghost"
            size="icon"
            onClick={() => router.push("/")}
            className="mr-2"
          >
            <ArrowLeft className="h-5 w-5" />
          </Button>
          <input
            type="text"
            value={documentTitle}
            onChange={(e) => setDocumentTitle(e.target.value)}
            className="border-none bg-transparent text-lg font-medium text-slate-800 focus:outline-none focus:ring-0"
            placeholder="Untitled Document"
          />
        </div>
        <div className="flex items-center gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={() => setShowCollaborators(!showCollaborators)}
            className="relative"
          >
            <Users className="mr-2 h-4 w-4" />
            Collaborators
            {activeCollaborators.length > 0 && (
              <span className="absolute -right-1 -top-1 flex h-5 w-5 items-center justify-center rounded-full bg-amber-500 text-xs text-white">
                {activeCollaborators.length}
              </span>
            )}
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={() => setShareDialogOpen(true)}
          >
            <Share className="mr-2 h-4 w-4" />
            Share
          </Button>
          <Button variant="outline" size="sm" onClick={downloadDocument}>
            <Download className="mr-2 h-4 w-4" />
            Download
          </Button>
          <Button
            size="sm"
            onClick={saveDocument}
            disabled={isSaving}
            className="bg-amber-600 hover:bg-amber-700"
          >
            {isSaving ? (
              <>Saving...</>
            ) : (
              <>
                <Save className="mr-2 h-4 w-4" />
                Save
              </>
            )}
          </Button>
        </div>
      </header>

      {/* Toolbar */}
      <Toolbar editor={editor} />

      {/* Collaborators sidebar */}
      {showCollaborators && providerRef.current && (
        <CollaboratorsList
          collaborators={activeCollaborators}
          currentUser={{
            id: providerRef.current.awareness.clientID,
            name: userNameRef.current,
            color: userColorRef.current,
            initials: userInitialsRef.current,
          }}
          onClose={() => setShowCollaborators(false)}
        />
      )}

      {/* Editor */}
      <div className="flex-1 overflow-auto bg-white">
        <div className="mx-auto max-w-4xl">
          <EditorContent editor={editor} className="min-h-screen" />
        </div>
      </div>

      {/* Share dialog */}
      <Dialog open={shareDialogOpen} onOpenChange={setShareDialogOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Share Document</DialogTitle>
            <DialogDescription>
              Invite others to collaborate on this document.
            </DialogDescription>
          </DialogHeader>

          <Tabs defaultValue="link">
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="link">Share Link</TabsTrigger>
              <TabsTrigger value="email">Invite by Email</TabsTrigger>
            </TabsList>

            <TabsContent value="link" className="mt-4">
              <div className="flex items-center space-x-2">
                <div className="grid flex-1 gap-2">
                  <Label htmlFor="link" className="sr-only">
                    Link
                  </Label>
                  <Input id="link" value={shareLink} readOnly className="h-9" />
                </div>
                <Button size="sm" className="px-3" onClick={copyShareLink}>
                  {linkCopied ? (
                    <Check className="h-4 w-4" />
                  ) : (
                    <Copy className="h-4 w-4" />
                  )}
                </Button>
              </div>
              <div className="mt-4">
                <Button
                  variant="outline"
                  className="w-full"
                  onClick={() => {
                    window.open(shareLink, "_blank");
                  }}
                >
                  <ExternalLink className="mr-2 h-4 w-4" />
                  Open in new tab
                </Button>
              </div>
            </TabsContent>

            <TabsContent value="email" className="mt-4">
              <div className="grid gap-4">
                <div className="grid gap-2">
                  <Label htmlFor="email">Email address</Label>
                  <Input
                    id="email"
                    placeholder="colleague@example.com"
                    type="email"
                    value={shareEmail}
                    onChange={(e) => setShareEmail(e.target.value)}
                  />
                </div>
                <Button
                  onClick={shareViaEmail}
                  disabled={!shareEmail}
                  className="bg-amber-600 hover:bg-amber-700"
                >
                  Send invitation
                </Button>
              </div>
            </TabsContent>
          </Tabs>
        </DialogContent>
      </Dialog>
    </div>
  );
}

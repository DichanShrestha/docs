"use client";
import "./styles.scss";
import { Color } from "@tiptap/extension-color";
import ListItem from "@tiptap/extension-list-item";
import TextStyle from "@tiptap/extension-text-style";
import { useEditor, EditorContent } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import React, { useEffect, useState, useCallback } from "react";
import { useParams } from "next/navigation";
import axios from "axios";
import { InviteLinkDialog } from "@/components/dialog/InviteLinkDialog";
import { socket } from "@/lib/socket";
import { MenuBar } from "./components/Menubar";
import { debounce } from "lodash";

const extensions = [
  Color.configure({ types: [TextStyle.name, ListItem.name] }),
  TextStyle.configure({}),
  StarterKit.configure({
    bulletList: { keepMarks: true, keepAttributes: true },
    orderedList: { keepMarks: true, keepAttributes: true },
    paragraph: {
      HTMLAttributes: {
        style: "white-space: pre-wrap;",
      },
    },
  }),
];

const TiptapEditor = () => {
  const [inviteLink, setInviteLink] = useState("");
  const [userId, setUserId] = useState("");
  const { id } = useParams();
  const [initialContent, setInitialContent] = useState<any>(null);

  // Debounced update handler
  const sendUpdate = useCallback(
    debounce((json: any) => {
      if (!id) return;
      socket.emit("publish", {
        channel: `doc-id: ${id}`,
        message: json,
        senderId: socket.id,
      });
    }, 500), // 500ms debounce delay
    [id]
  );

  const editorHook = useEditor({
    extensions,
    editorProps: {
      attributes: {
        class: "min-h-[300px] p-4",
      },
    },
    onUpdate: ({ editor }) => {
      const json = editor.getJSON();
      sendUpdate(json);
    },
  });

  // Fetch initial doc content
  useEffect(() => {
    async function fetchDocs() {
      try {
        const response = await axios.get(
          `${process.env.NEXT_PUBLIC_HTTP_URL}/docs/${id}`
        );
        setInitialContent(response.data.data.content.message);
      } catch (error) {
        console.error("Error fetching document:", error);
        // Initialize with empty doc if fetch fails
        setInitialContent({
          type: "doc",
          content: [
            {
              type: "paragraph",
            },
          ],
        });
      }
    }
    fetchDocs();
  }, [id]);

  // Set initial content once ready
  useEffect(() => {
    if (editorHook && initialContent) {
      editorHook.commands.setContent(initialContent);
      editorHook.setEditable(true); // Ensure editor is editable
    }
  }, [editorHook, initialContent]);

  // Socket subscription
  useEffect(() => {
    if (!id || !editorHook) return;

    const channel = `doc-id: ${id}`;
    socket.emit("subscribe", { channel });

    const handler = (data: any) => {
      if (data.senderId === socket.id || !editorHook) return;
      // Use transaction to prevent cursor jumping
      editorHook.view.dispatch(
        editorHook.state.tr.insertText(
          data.message.content?.[0]?.content?.[0]?.text || "",
          0
        )
      );
    };

    socket.on(channel, handler);

    return () => {
      socket.off(channel, handler);
      socket.emit("unsubscribe", { channel });
      sendUpdate.cancel(); // Cancel any pending updates
    };
  }, [id, editorHook, sendUpdate]);

  async function handleInvite() {
    try {
      const url = `${process.env.NEXT_PUBLIC_HTTP_URL}/collaboration/docs/${id}`;
      const response = await axios.post(url, { userId });
      setInviteLink(response.data.data);
    } catch (error) {
      console.log("Error generating invite link:", error);
    }
  }

  return (
    <div className="max-w-4xl mx-auto my-8">
      <div className="mb-4 flex items-center gap-4">
        <InviteLinkDialog
          userId={userId}
          setUserId={setUserId}
          handleInvite={handleInvite}
          inviteLink={inviteLink}
        />
      </div>
      <div className="border rounded-lg shadow-sm overflow-hidden">
        {editorHook && (
          <>
            <MenuBar editor={editorHook} />
            <EditorContent editor={editorHook} />
          </>
        )}
      </div>
    </div>
  );
};

export default TiptapEditor;

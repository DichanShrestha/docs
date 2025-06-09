"use client";

import { X, UserPlus } from "lucide-react";
import { useState } from "react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

// Simple toast implementation
const useToast = () => {
  const showToast = (message: string) => {
    // Create toast element
    const toast = document.createElement("div");
    toast.className =
      "fixed bottom-4 right-4 z-50 rounded-md bg-green-100 p-4 text-green-800 shadow-md animate-fade-in";
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
    }: {
      title: string;
      description?: string;
    }) => {
      showToast(description || title);
    },
  };
};

interface Collaborator {
  id: number;
  name: string;
  color: string;
  initials: string;
}

interface CollaboratorsListProps {
  collaborators: Collaborator[];
  currentUser: Collaborator;
  onClose: () => void;
}

export function CollaboratorsList({
  collaborators,
  currentUser,
  onClose,
}: CollaboratorsListProps) {
  const { toast } = useToast();
  const [inviteEmail, setInviteEmail] = useState("");

  const handleInvite = () => {
    if (!inviteEmail) return;

    // In a real app, you would send an invitation email
    console.log(`Inviting ${inviteEmail} to collaborate`);

    toast({
      title: "Invitation sent",
      description: `An invitation has been sent to ${inviteEmail}.`,
    });

    setInviteEmail("");
  };

  return (
    <div className="absolute right-0 top-16 z-10 h-[calc(100vh-4rem)] w-72 border-l border-slate-200 bg-white p-4 shadow-lg">
      <div className="mb-4 flex items-center justify-between">
        <h3 className="text-lg font-medium text-slate-800">Collaborators</h3>
        <Button variant="ghost" size="icon" onClick={onClose}>
          <X className="h-4 w-4" />
        </Button>
      </div>

      <div className="mb-6">
        <div className="mb-2 text-sm font-medium text-slate-500">You</div>
        <div className="flex items-center gap-3 rounded-md border border-slate-100 bg-slate-50 p-3">
          <div
            className="flex h-8 w-8 items-center justify-center rounded-full text-sm font-medium text-white"
            style={{ backgroundColor: currentUser.color }}
          >
            {currentUser.initials}
          </div>
          <div>
            <div className="font-medium text-slate-800">{currentUser.name}</div>
            <div className="text-xs text-slate-500">You (editing)</div>
          </div>
        </div>
      </div>

      {collaborators.length > 0 ? (
        <>
          <div className="mb-2 text-sm font-medium text-slate-500">
            Currently editing ({collaborators.length})
          </div>
          <div className="space-y-2">
            {collaborators.map((collaborator) => (
              <div
                key={collaborator.id}
                className="flex items-center gap-3 rounded-md border border-slate-100 p-3"
              >
                <div
                  className="flex h-8 w-8 items-center justify-center rounded-full text-sm font-medium text-white"
                  style={{ backgroundColor: collaborator.color }}
                >
                  {collaborator.initials}
                </div>
                <div>
                  <div className="font-medium text-slate-800">
                    {collaborator.name}
                  </div>
                  <div className="text-xs text-slate-500">Editing now</div>
                </div>
              </div>
            ))}
          </div>
        </>
      ) : (
        <div className="rounded-md border border-dashed border-slate-200 p-4 text-center text-sm text-slate-500">
          No one else is editing this document right now
        </div>
      )}

      <div className="mt-6 space-y-4">
        <div className="text-sm font-medium text-slate-500">Invite someone</div>
        <div className="flex gap-2">
          <Input
            placeholder="Email address"
            value={inviteEmail}
            onChange={(e) => setInviteEmail(e.target.value)}
            className="h-9"
          />
          <Button
            size="icon"
            onClick={handleInvite}
            disabled={!inviteEmail}
            className="h-9 w-9 bg-amber-600 hover:bg-amber-700"
          >
            <UserPlus className="h-4 w-4" />
          </Button>
        </div>
        <Button
          variant="outline"
          className="w-full"
          onClick={() => {
            // In a real app, this would copy the document link to clipboard
            navigator.clipboard.writeText(
              `${window.location.origin}/documents/${currentUser.id}`
            );
            toast({
              title: "Link copied",
              description: "Share link copied to clipboard.",
            });
          }}
        >
          Copy invite link
        </Button>
      </div>
    </div>
  );
}

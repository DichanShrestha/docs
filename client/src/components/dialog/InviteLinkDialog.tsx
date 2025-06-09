"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Copy } from "lucide-react";

interface InviteLinkDialogProps {
  userId: string;
  setUserId: (value: string) => void;
  handleInvite: () => void;
  inviteLink: string | null;
}

export function InviteLinkDialog({
  userId,
  setUserId,
  handleInvite,
  inviteLink,
}: InviteLinkDialogProps) {
  const [open, setOpen] = useState(false);

  const generateInvite = () => {
    handleInvite();
  };

  const copyToClipboard = () => {
    if (inviteLink) {
      navigator.clipboard.writeText(inviteLink);
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="outline" className="px-4 py-2 rounded-2xl">
          Generate Invite Link
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Generate Invite Link</DialogTitle>
          <DialogDescription>
            Create a shareable invite link for the specified user.
          </DialogDescription>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="userId" className="text-right">
              User ID
            </Label>
            <Input
              id="userId"
              value={userId}
              onChange={(e) => setUserId(e.target.value)}
              className="col-span-3"
            />
          </div>
          {inviteLink && (
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="link" className="text-right">
                Invite Link
              </Label>
              <div className="col-span-3 flex items-center gap-2">
                <Input
                  id="link"
                  value={inviteLink}
                  readOnly
                  className="col-span-3"
                />
                <Button
                  size="icon"
                  variant="outline"
                  onClick={copyToClipboard}
                  title="Copy to clipboard"
                >
                  <Copy className="h-4 w-4" />
                </Button>
              </div>
            </div>
          )}
        </div>
        <DialogFooter>
          <Button type="submit" onClick={generateInvite}>
            {inviteLink ? "Regenerate Link" : "Generate Link"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

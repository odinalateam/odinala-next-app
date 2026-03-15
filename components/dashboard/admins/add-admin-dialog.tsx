"use client";

import { useState } from "react";
import { searchUsers, promoteToAdmin } from "@/lib/actions/admin-users";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import type { User } from "@/lib/types";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Plus } from "lucide-react";

export function AddAdminDialog() {
  const [open, setOpen] = useState(false);
  const [query, setQuery] = useState("");
  const [results, setResults] = useState<User[]>([]);
  const [loading, setLoading] = useState(false);
  const [promoting, setPromoting] = useState<string | null>(null);

  const handleSearch = async (value: string) => {
    setQuery(value);
    if (value.trim().length < 2) {
      setResults([]);
      return;
    }
    setLoading(true);
    try {
      const users = await searchUsers(value);
      setResults(users);
    } finally {
      setLoading(false);
    }
  };

  const handlePromote = async (userId: string) => {
    setPromoting(userId);
    try {
      await promoteToAdmin(userId);
      setOpen(false);
      setQuery("");
      setResults([]);
    } finally {
      setPromoting(null);
    }
  };

  return (
    <Dialog
      open={open}
      onOpenChange={(open) => {
        setOpen(open);
        if (!open) {
          setQuery("");
          setResults([]);
        }
      }}
    >
      <DialogTrigger
        render={
          <Button size="sm">
            <Plus className="h-4 w-4 mr-1" />
            Add Admin
          </Button>
        }
      />
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Add Admin</DialogTitle>
        </DialogHeader>
        <div className="space-y-4">
          <Input
            placeholder="Search users by name or email..."
            value={query}
            onChange={(e) => handleSearch(e.target.value)}
          />
          {loading && (
            <p className="text-sm text-muted-foreground">Searching...</p>
          )}
          {results.length > 0 && (
            <div className="space-y-1 max-h-60 overflow-y-auto">
              {results.map((user) => (
                <div
                  key={user.id}
                  className="flex items-center justify-between p-2 rounded-lg hover:bg-muted/50"
                >
                  <div>
                    <p className="text-sm font-medium">{user.name}</p>
                    <p className="text-xs text-muted-foreground">
                      {user.email}
                    </p>
                  </div>
                  <Button
                    size="xs"
                    onClick={() => handlePromote(user.id)}
                    disabled={promoting === user.id}
                  >
                    {promoting === user.id ? "..." : "Promote"}
                  </Button>
                </div>
              ))}
            </div>
          )}
          {!loading && query.trim().length >= 2 && results.length === 0 && (
            <p className="text-sm text-muted-foreground">No users found.</p>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}

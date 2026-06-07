"use client";

import { useState, useEffect } from "react";
import { UsersRound, Plus, Trash2, Loader2, Phone, Mail, Copy } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { toast } from "sonner";

type Contact = {
  _id: string;
  name: string;
  relationship: string;
  phone?: string;
  email?: string;
  preferredMethod: "sms" | "email" | "copy";
};

const methodIcon = {
  sms: Phone,
  email: Mail,
  copy: Copy,
};

export function TrustedCircleManager() {
  const [contacts, setContacts] = useState<Contact[]>([]);
  const [loading, setLoading] = useState(true);
  const [adding, setAdding] = useState(false);
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState({
    name: "",
    relationship: "",
    phone: "",
    email: "",
    preferredMethod: "copy",
  });

  useEffect(() => {
    fetchContacts();
  }, []);

  const fetchContacts = async () => {
    try {
      const res = await fetch("/api/trusted-circle");
      const data = await res.json();
      if (data.contacts) setContacts(data.contacts);
    } catch {
      toast.error("Failed to load trusted contacts");
    } finally {
      setLoading(false);
    }
  };

  const handleAdd = async () => {
    if (!form.name || !form.relationship) {
      toast.error("Name and relationship are required");
      return;
    }
    setAdding(true);
    try {
      const res = await fetch("/api/trusted-circle", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });
      const data = await res.json();
      if (data.contact) {
        setContacts((prev) => [data.contact, ...prev]);
        setForm({ name: "", relationship: "", phone: "", email: "", preferredMethod: "copy" });
        setShowForm(false);
        toast.success("Contact added to your Trusted Circle");
      }
    } catch {
      toast.error("Failed to add contact");
    } finally {
      setAdding(false);
    }
  };

  const handleDelete = async (id: string) => {
    try {
      await fetch(`/api/trusted-circle/${id}`, { method: "DELETE" });
      setContacts((prev) => prev.filter((c) => c._id !== id));
      toast.success("Contact removed");
    } catch {
      toast.error("Failed to remove contact");
    }
  };

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <CardTitle className="flex items-center gap-2">
              <UsersRound className="size-5 text-primary" />
              Trusted Circle
            </CardTitle>
            <CardDescription className="mt-1">
              People you trust to check in on you. Selam never shares your private notes without your permission.
            </CardDescription>
          </div>
          <Button
            size="sm"
            variant="outline"
            onClick={() => setShowForm(!showForm)}
            className="shrink-0"
          >
            <Plus className="size-4 mr-1" />
            Add
          </Button>
        </div>
      </CardHeader>

      <CardContent className="space-y-4">
        {/* Add form */}
        {showForm && (
          <div className="rounded-lg border bg-muted/30 p-4 space-y-3">
            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-1">
                <Label>Name *</Label>
                <Input
                  value={form.name}
                  onChange={(e) => setForm({ ...form, name: e.target.value })}
                  placeholder="Almaz"
                />
              </div>
              <div className="space-y-1">
                <Label>Relationship *</Label>
                <Input
                  value={form.relationship}
                  onChange={(e) => setForm({ ...form, relationship: e.target.value })}
                  placeholder="Sister, Best Friend..."
                />
              </div>
              <div className="space-y-1">
                <Label>Phone (optional)</Label>
                <Input
                  value={form.phone}
                  onChange={(e) => setForm({ ...form, phone: e.target.value })}
                  placeholder="+251 9..."
                />
              </div>
              <div className="space-y-1">
                <Label>Email (optional)</Label>
                <Input
                  value={form.email}
                  onChange={(e) => setForm({ ...form, email: e.target.value })}
                  placeholder="name@email.com"
                />
              </div>
            </div>
            <div className="space-y-1">
              <Label>Preferred contact method</Label>
              <Select
                value={form.preferredMethod}
                onValueChange={(v) => setForm({ ...form, preferredMethod: v })}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="copy">Copy message</SelectItem>
                  <SelectItem value="sms">SMS link</SelectItem>
                  <SelectItem value="email">Email link</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="flex gap-2 pt-1">
              <Button onClick={handleAdd} disabled={adding} size="sm">
                {adding && <Loader2 className="mr-1 size-3 animate-spin" />}
                Save contact
              </Button>
              <Button variant="ghost" size="sm" onClick={() => setShowForm(false)}>
                Cancel
              </Button>
            </div>
          </div>
        )}

        {/* Contact list */}
        {loading ? (
          <div className="flex justify-center py-6">
            <Loader2 className="animate-spin text-muted-foreground" />
          </div>
        ) : contacts.length === 0 ? (
          <p className="text-sm text-muted-foreground text-center py-6">
            No trusted contacts yet. Add someone you can reach out to.
          </p>
        ) : (
          <div className="space-y-2">
            {contacts.map((contact) => {
              const Icon = methodIcon[contact.preferredMethod] ?? Copy;
              return (
                <div
                  key={contact._id}
                  className="flex items-center justify-between gap-3 rounded-lg border bg-card px-4 py-3"
                >
                  <div className="flex items-center gap-3 min-w-0">
                    <div className="size-8 rounded-full bg-primary/10 flex items-center justify-center shrink-0">
                      <span className="text-sm font-bold text-primary">
                        {contact.name[0].toUpperCase()}
                      </span>
                    </div>
                    <div className="min-w-0">
                      <p className="font-medium text-sm truncate">{contact.name}</p>
                      <p className="text-xs text-muted-foreground truncate">{contact.relationship}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2 shrink-0">
                    <Badge variant="secondary" className="flex items-center gap-1 text-xs">
                      <Icon className="size-3" />
                      {contact.preferredMethod}
                    </Badge>
                    <Button
                      variant="ghost"
                      size="icon"
                      className="size-7 text-destructive hover:bg-destructive/10"
                      onClick={() => handleDelete(contact._id)}
                    >
                      <Trash2 className="size-3.5" />
                    </Button>
                  </div>
                </div>
              );
            })}
          </div>
        )}

        <p className="text-[10px] text-muted-foreground text-center pt-1">
          Selam never shares your private journal notes unless you choose to copy and send them yourself.
        </p>
      </CardContent>
    </Card>
  );
}

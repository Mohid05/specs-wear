import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/lib/supabase";
import { MessageSquare, Trash2, CheckCircle, Clock } from "lucide-react";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { formatWhatsAppNumber } from "@/lib/utils";

export default function AdminInquiries() {
  const queryClient = useQueryClient();

  // Fetch messages from database
  const { data: messages = [], isLoading } = useQuery({
    queryKey: ['admin-inquiries'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('contact_messages')
        .select('*')
        .order('created_at', { ascending: false });
      if (error) throw error;
      return data;
    }
  });

  const deleteMutation = useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase.from('contact_messages').delete().eq('id', id);
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin-inquiries'] });
      queryClient.invalidateQueries({ queryKey: ['admin-unread-count'] });
      toast.success("Message deleted successfully");
    },
    onError: (err) => {
      toast.error(`Error deleting message: ${err.message}`);
    }
  });

  const updateStatusMutation = useMutation({
    mutationFn: async ({ id, status }: { id: string, status: string }) => {
      const { error } = await supabase.from('contact_messages').update({ status }).eq('id', id);
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin-inquiries'] });
      queryClient.invalidateQueries({ queryKey: ['admin-unread-count'] });
    }
  });

  const handleWhatsApp = (phone: string, name: string) => {
    const formattedPhone = formatWhatsAppNumber(phone);
    if (!formattedPhone) {
      toast.error("No valid phone number provided for this contact");
      return;
    }
    const message = encodeURIComponent(`Hello ${name}! We received your message via SPECS WEAR website...`);
    window.open(`https://wa.me/${formattedPhone}?text=${message}`, "_blank");
  };

  const handleDelete = (id: string) => {
    if (window.confirm("Are you sure you want to delete this message?")) {
      deleteMutation.mutate(id);
    }
  };

  const toggleStatus = (id: string, currentStatus: string) => {
    const nextStatus = currentStatus === 'unread' ? 'read' : 'unread';
    updateStatusMutation.mutate({ id, status: nextStatus });
  };

  return (
    <div>
      <h1 className="font-display text-2xl font-bold text-foreground">Customer Inquiries</h1>
      <p className="text-muted-foreground mt-1">Manage messages sent via the contact form</p>

      <div className="mt-6 overflow-auto rounded-xl border border-border bg-card">
        {isLoading ? (
          <div className="p-8 text-center text-muted-foreground">Loading inquiries...</div>
        ) : messages.length === 0 ? (
          <div className="p-8 text-center text-muted-foreground">No inquiries found.</div>
        ) : (
          <table className="w-full text-sm">
            <thead className="border-b border-border bg-secondary text-left">
              <tr>
                <th className="px-4 py-3 font-medium text-muted-foreground">Sender Info</th>
                <th className="px-4 py-3 font-medium text-muted-foreground">Message</th>
                <th className="px-4 py-3 font-medium text-muted-foreground">Date</th>
                <th className="px-4 py-3 font-medium text-muted-foreground">Status</th>
                <th className="px-4 py-3 font-medium text-muted-foreground">Actions</th>
              </tr>
            </thead>
            <tbody>
              {messages.map((msg: any) => (
                <tr key={msg.id} className={`border-b border-border last:border-0 hover:bg-secondary/50 transition-colors ${msg.status === 'unread' ? 'bg-primary/5' : ''}`}>
                  <td className="px-4 py-4 min-w-[180px]">
                    <div className="font-medium text-foreground">{msg.name}</div>
                    <div className="text-muted-foreground text-xs mt-1">{msg.email}</div>
                    <div className="text-muted-foreground text-xs">{msg.phone || 'No phone'}</div>
                  </td>
                  <td className="px-4 py-4 min-w-[250px] max-w-md">
                    <p className="whitespace-pre-wrap text-foreground break-words">{msg.message}</p>
                  </td>
                  <td className="px-4 py-4 text-muted-foreground whitespace-nowrap">
                    {new Date(msg.created_at).toLocaleDateString()}
                  </td>
                  <td className="px-4 py-4">
                    <button 
                      onClick={() => toggleStatus(msg.id, msg.status)}
                      className={`flex items-center gap-1.5 rounded-full px-2.5 py-1 text-xs font-medium transition-colors ${
                        msg.status === 'unread' 
                          ? 'bg-orange-100 text-orange-700 dark:bg-orange-900/20 dark:text-orange-400' 
                          : 'bg-green-100 text-green-700 dark:bg-green-900/20 dark:text-green-400'
                      }`}
                    >
                      {msg.status === 'unread' ? <Clock className="h-3 w-3" /> : <CheckCircle className="h-3 w-3" />}
                      {msg.status === 'unread' ? 'Unread' : 'Read'}
                    </button>
                  </td>
                  <td className="px-4 py-4">
                    <div className="flex gap-2">
                      <Button 
                        size="sm" 
                        variant="outline" 
                        className="bg-green-50 text-green-600 border-green-200 hover:bg-[#15a349] hover:text-white hover:border-[#15a349] dark:bg-green-900/20 dark:border-green-800 dark:text-green-400 dark:hover:bg-[#15a349] dark:hover:text-white dark:hover:border-[#15a349] gap-1.5 transition-colors"
                        onClick={() => handleWhatsApp(msg.phone, msg.name)}
                        disabled={!msg.phone}
                      >
                        <MessageSquare className="h-3.5 w-3.5" /> WhatsApp
                      </Button>
                      <Button 
                        size="sm" 
                        variant="ghost"
                        className="text-muted-foreground hover:text-destructive hover:bg-destructive/10"
                        onClick={() => handleDelete(msg.id)}
                        disabled={deleteMutation.isPending}
                      >
                        <Trash2 className="h-3.5 w-3.5" />
                      </Button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
}

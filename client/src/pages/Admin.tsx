import { useEffect, useState } from "react";
import { 
  Card, 
  CardContent, 
  CardDescription, 
  CardHeader, 
  CardTitle 
} from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { format } from "date-fns";

interface ContactMessage {
  id: number;
  name: string;
  phone: string;
  email: string;
  course: string;
  message: string;
  createdAt: string;
}

export default function Admin() {
  const [messages, setMessages] = useState<ContactMessage[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    let isMounted = true;
    
    const fetchMessages = async () => {
      try {
        if (!isMounted) return;
        setLoading(true);
        
        const response = await fetch("/api/admin/messages");
        
        if (!response.ok) {
          throw new Error("Failed to fetch messages");
        }
        
        const data = await response.json();
        console.log("API response:", data);
        
        if (!isMounted) return;
        
        if (Array.isArray(data)) {
          setMessages(data);
          setError("");
        } else {
          throw new Error("Invalid data format received");
        }
      } catch (err: any) {
        if (!isMounted) return;
        setError(`Failed to load messages: ${err.message || "Unknown error"}`);
        console.error("Error fetching messages:", err);
      } finally {
        if (isMounted) {
          setLoading(false);
        }
      }
    };

    fetchMessages();
    
    return () => {
      isMounted = false;
    };
  }, []);

  return (
    <div className="container mx-auto px-4 py-8">
      <Card className="mb-8">
        <CardHeader>
          <CardTitle className="text-2xl md:text-3xl font-bold">Admin Dashboard</CardTitle>
          <CardDescription>View all contact form submissions</CardDescription>
        </CardHeader>
        <CardContent>
          {loading ? (
            <div className="text-center py-8">Loading messages...</div>
          ) : error ? (
            <div className="text-center py-8 text-red-500">{error}</div>
          ) : messages.length === 0 ? (
            <div className="text-center py-8">No messages found.</div>
          ) : (
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Date</TableHead>
                    <TableHead>Name</TableHead>
                    <TableHead>Phone</TableHead>
                    <TableHead>Email</TableHead>
                    <TableHead>Course</TableHead>
                    <TableHead>Message</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {messages.map((message) => (
                    <TableRow key={message.id}>
                      <TableCell>
                        {message.createdAt ? 
                          format(new Date(message.createdAt), "PPP p") : 
                          "Unknown date"}
                      </TableCell>
                      <TableCell>{message.name || "N/A"}</TableCell>
                      <TableCell>{message.phone || "N/A"}</TableCell>
                      <TableCell>{message.email || "N/A"}</TableCell>
                      <TableCell>{message.course || "N/A"}</TableCell>
                      <TableCell className="max-w-xs truncate">{message.message || "N/A"}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
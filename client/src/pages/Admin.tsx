import { 
  Card, 
  CardContent, 
  CardDescription, 
  CardHeader, 
  CardTitle 
} from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { format, isValid } from "date-fns";
import { useQuery } from "@tanstack/react-query";

// Safe date formatting function
const formatDate = (dateString: string | null | undefined): string => {
  if (!dateString) return "Unknown date";
  
  try {
    const date = new Date(dateString);
    return isValid(date) ? format(date, "PPP p") : "Invalid date";
  } catch (error) {
    console.error("Error formatting date:", error);
    return "Date error";
  }
};

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
  const { 
    data: messages = [], 
    isLoading,
    error,
    isError
  } = useQuery<ContactMessage[]>({
    queryKey: ['/api/admin/messages'],
    refetchInterval: 30000, // Refetch every 30 seconds
  });

  return (
    <div className="container mx-auto px-4 py-8">
      <Card className="mb-8">
        <CardHeader>
          <CardTitle className="text-2xl md:text-3xl font-bold">Admin Dashboard</CardTitle>
          <CardDescription>View all contact form submissions</CardDescription>
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <div className="text-center py-8">Loading messages...</div>
          ) : isError ? (
            <div className="text-center py-8 text-red-500">
              Failed to load messages. Please try again later.
            </div>
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
                        {formatDate(message.createdAt)}
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
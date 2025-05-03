import { useState } from "react";
import { 
  Card, 
  CardContent, 
  CardDescription, 
  CardHeader, 
  CardTitle 
} from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { format, isValid } from "date-fns";
import { useQuery, useMutation } from "@tanstack/react-query";
import { apiRequest, queryClient } from "@/lib/queryClient";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";
import { LogOut } from "lucide-react";

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
  status: string; // 'open' or 'closed'
  createdAt: string;
}

interface Certificate {
  id: number;
  certificateNumber: string;
  name: string;
  address: string;
  aadharNumber: string;
  certificateName: string;
  issueDate: string;
  percentageScore: number;
}

export default function Admin() {
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [activeTab, setActiveTab] = useState("messages");
  const [certificateToEdit, setCertificateToEdit] = useState<Certificate | null>(null);
  const [certificateIdToDelete, setCertificateIdToDelete] = useState<number | null>(null);
  const { toast } = useToast();
  
  // Form state for new certificate
  const [certificateData, setCertificateData] = useState({
    certificateNumber: "",
    name: "",
    address: "",
    aadharNumber: "",
    certificateName: "",
    issueDate: new Date().toISOString().split('T')[0], // Today's date in YYYY-MM-DD format
    percentageScore: 70,
  });

  // Contact messages query
  const { 
    data: messages = [], 
    isLoading: messagesLoading,
    isError: messagesError
  } = useQuery<ContactMessage[]>({
    queryKey: ['/api/admin/messages'],
    queryFn: async () => {
      const res = await fetch('/api/admin/messages', { credentials: 'include' });
      if (!res.ok) throw new Error('Failed to fetch messages');
      return res.json();
    },
    refetchInterval: 30000, // Refetch every 30 seconds
    enabled: activeTab === "messages",
  });

  // Certificates query
  const {
    data: certificates = [],
    isLoading: certificatesLoading,
    isError: certificatesError
  } = useQuery<Certificate[]>({
    queryKey: ['/api/certificates'],
    queryFn: async () => {
      const res = await fetch('/api/certificates', { credentials: 'include' });
      if (!res.ok) throw new Error('Failed to fetch certificates');
      return res.json();
    },
    enabled: activeTab === "certificates",
  });

  // Add certificate mutation
  const addCertificateMutation = useMutation({
    mutationFn: async (data: typeof certificateData) => {
      const res = await apiRequest("POST", "/api/certificates", data);
      return res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/certificates'] });
      setIsDialogOpen(false);
      setCertificateData({
        certificateNumber: "",
        name: "",
        address: "",
        aadharNumber: "",
        certificateName: "",
        issueDate: new Date().toISOString().split('T')[0],
        percentageScore: 70,
      });
      toast({
        title: "Success",
        description: "Certificate added successfully",
      });
    },
    onError: (error) => {
      toast({
        title: "Error",
        description: `Failed to add certificate: ${error.message}`,
        variant: "destructive",
      });
    }
  });

  // Edit certificate mutation
  const editCertificateMutation = useMutation({
    mutationFn: async ({ id, data }: { id: number, data: Partial<typeof certificateData> }) => {
      const res = await apiRequest("PUT", `/api/certificates/${id}`, data);
      return res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/certificates'] });
      setIsEditDialogOpen(false);
      setCertificateToEdit(null);
      toast({
        title: "Success",
        description: "Certificate updated successfully",
      });
    },
    onError: (error) => {
      toast({
        title: "Error",
        description: `Failed to update certificate: ${error.message}`,
        variant: "destructive",
      });
    }
  });

  // Delete certificate mutation
  const deleteCertificateMutation = useMutation({
    mutationFn: async (id: number) => {
      await apiRequest("DELETE", `/api/certificates/${id}`);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/certificates'] });
      setIsDeleteDialogOpen(false);
      setCertificateIdToDelete(null);
      toast({
        title: "Success",
        description: "Certificate deleted successfully",
      });
    },
    onError: (error) => {
      toast({
        title: "Error",
        description: `Failed to delete certificate: ${error.message}`,
        variant: "destructive",
      });
    }
  });

  // Logout mutation
  const logoutMutation = useMutation({
    mutationFn: async () => {
      await apiRequest("POST", "/api/logout");
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/user'] });
      window.location.href = "/auth";
    },
    onError: (error) => {
      toast({
        title: "Logout failed",
        description: error.message,
        variant: "destructive",
      });
    },
  });

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setCertificateData(prev => ({
      ...prev,
      [name]: name === 'percentageScore' ? parseInt(value) : value
    }));
  };

  const handleEditInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    if (certificateToEdit) {
      setCertificateToEdit({
        ...certificateToEdit,
        [name]: name === 'percentageScore' ? parseInt(value) : value
      });
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    addCertificateMutation.mutate(certificateData);
  };

  const handleEditSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (certificateToEdit) {
      editCertificateMutation.mutate({
        id: certificateToEdit.id,
        data: certificateToEdit
      });
    }
  };

  const handleEditCertificate = (certificate: Certificate) => {
    console.log('Certificate to edit:', certificate);
    
    // Map certificate data from API response to our form model
    // The data might come with snake_case keys from the database but our TypeScript expects camelCase
    const formattedCertificate = {
      ...certificate,
      id: certificate.id,
      certificateNumber: certificate.certificateNumber || (certificate as any).certificate_number || '',
      name: certificate.name || '',
      address: certificate.address || '', 
      aadharNumber: certificate.aadharNumber || (certificate as any).aadhar_number || '',
      certificateName: certificate.certificateName || (certificate as any).certificate_name || '', 
      issueDate: certificate.issueDate || (certificate as any).issue_date || new Date().toISOString().split('T')[0],
      percentageScore: certificate.percentageScore || (certificate as any).percentage_score || 0
    };
    
    console.log('Formatted certificate:', formattedCertificate);
    setCertificateToEdit(formattedCertificate);
    setIsEditDialogOpen(true);
  };

  const handleDeleteCertificate = (id: number) => {
    setCertificateIdToDelete(id);
    setIsDeleteDialogOpen(true);
  };
  
  // Message status toggle mutation
  const updateMessageStatusMutation = useMutation({
    mutationFn: async ({ id, status }: { id: number, status: string }) => {
      const res = await apiRequest("PUT", `/api/admin/messages/${id}/status`, { status });
      return res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/admin/messages'] });
      toast({
        title: "Success",
        description: "Message status updated",
      });
    },
    onError: (error) => {
      toast({
        title: "Error",
        description: `Failed to update message status: ${error.message}`,
        variant: "destructive",
      });
    }
  });
  
  // Delete message mutation
  const deleteMessageMutation = useMutation({
    mutationFn: async (id: number) => {
      await apiRequest("DELETE", `/api/admin/messages/${id}`);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/admin/messages'] });
      toast({
        title: "Success",
        description: "Message deleted successfully",
      });
    },
    onError: (error) => {
      toast({
        title: "Error",
        description: `Failed to delete message: ${error.message}`,
        variant: "destructive",
      });
    }
  });
  
  const toggleMessageStatus = (id: number, currentStatus: string) => {
    const newStatus = currentStatus === 'open' ? 'closed' : 'open';
    updateMessageStatusMutation.mutate({ id, status: newStatus });
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold">Admin Dashboard</h1>
        <Button 
          variant="outline" 
          onClick={() => logoutMutation.mutate()}
          disabled={logoutMutation.isPending}
        >
          <LogOut className="mr-2 h-4 w-4" />
          {logoutMutation.isPending ? "Logging out..." : "Logout"}
        </Button>
      </div>

      <Tabs defaultValue="messages" value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="mb-4">
          <TabsTrigger value="messages">Contact Messages</TabsTrigger>
          <TabsTrigger value="certificates">Certificates</TabsTrigger>
        </TabsList>
        
        {/* Contact Messages Tab */}
        <TabsContent value="messages">
          <Card>
            <CardHeader>
              <CardTitle>Contact Form Submissions</CardTitle>
              <CardDescription>View all messages sent through the contact form</CardDescription>
            </CardHeader>
            <CardContent>
              {messagesLoading ? (
                <div className="text-center py-8">Loading messages...</div>
              ) : messagesError ? (
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
                        <TableHead>Status</TableHead>
                        <TableHead className="text-right">Actions</TableHead>
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
                          <TableCell>
                            <Badge 
                              variant={message.status === 'open' ? 'default' : 'destructive'}
                              className={message.status === 'open' ? 'bg-green-500' : 'bg-red-500'}
                            >
                              {message.status === 'open' ? 'Open' : 'Closed'}
                            </Badge>
                          </TableCell>
                          <TableCell className="text-right">
                            <div className="flex justify-end gap-2">
                              <Button
                                variant="outline"
                                size="sm"
                                onClick={() => toggleMessageStatus(message.id, message.status)}
                                disabled={updateMessageStatusMutation.isPending}
                              >
                                {message.status === 'open' ? 'Close' : 'Open'}
                              </Button>
                              <Button
                                variant="destructive"
                                size="sm"
                                onClick={() => deleteMessageMutation.mutate(message.id)}
                                disabled={deleteMessageMutation.isPending}
                              >
                                Delete
                              </Button>
                            </div>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>
        
        {/* Certificates Tab */}
        <TabsContent value="certificates">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between">
              <div>
                <CardTitle>Certificate Management</CardTitle>
                <CardDescription>Manage certificates for students</CardDescription>
              </div>
              <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
                <DialogTrigger asChild>
                  <Button>Add New Certificate</Button>
                </DialogTrigger>
                <DialogContent className="sm:max-w-[500px]">
                  <form onSubmit={handleSubmit}>
                    <DialogHeader>
                      <DialogTitle>Add New Certificate</DialogTitle>
                      <DialogDescription>
                        Fill in the details to create a new certificate for a student
                      </DialogDescription>
                    </DialogHeader>
                    <div className="grid gap-4 py-4">
                      <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-2">
                          <Label htmlFor="certificateNumber">Certificate Number</Label>
                          <Input
                            id="certificateNumber"
                            name="certificateNumber"
                            placeholder="e.g., ADCA-2023-1234"
                            value={certificateData.certificateNumber}
                            onChange={handleInputChange}
                            required
                          />
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="certificateName">Certificate Name</Label>
                          <Input
                            id="certificateName"
                            name="certificateName"
                            placeholder="e.g., ADCA, DCA, etc."
                            value={certificateData.certificateName}
                            onChange={handleInputChange}
                            required
                          />
                        </div>
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="name">Student Name</Label>
                        <Input
                          id="name"
                          name="name"
                          placeholder="Enter student's full name"
                          value={certificateData.name}
                          onChange={handleInputChange}
                          required
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="address">Address</Label>
                        <Input
                          id="address"
                          name="address"
                          placeholder="Enter student's address"
                          value={certificateData.address}
                          onChange={handleInputChange}
                          required
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="aadharNumber">Aadhar Number</Label>
                        <Input
                          id="aadharNumber"
                          name="aadharNumber"
                          placeholder="Enter 12-digit Aadhar number"
                          value={certificateData.aadharNumber}
                          onChange={handleInputChange}
                          required
                        />
                      </div>
                      <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-2">
                          <Label htmlFor="issueDate">Issue Date</Label>
                          <Input
                            id="issueDate"
                            name="issueDate"
                            type="date"
                            value={certificateData.issueDate}
                            onChange={handleInputChange}
                            required
                          />
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="percentageScore">Percentage Score</Label>
                          <Input
                            id="percentageScore"
                            name="percentageScore"
                            type="number"
                            min="1"
                            max="100"
                            value={certificateData.percentageScore}
                            onChange={handleInputChange}
                            required
                          />
                        </div>
                      </div>
                    </div>
                    <DialogFooter>
                      <Button 
                        type="submit" 
                        disabled={addCertificateMutation.isPending}
                      >
                        {addCertificateMutation.isPending ? "Adding..." : "Add Certificate"}
                      </Button>
                    </DialogFooter>
                  </form>
                </DialogContent>
              </Dialog>
            </CardHeader>
            <CardContent>
              {certificatesLoading ? (
                <div className="text-center py-8">Loading certificates...</div>
              ) : certificatesError ? (
                <div className="text-center py-8 text-red-500">
                  Failed to load certificates. Please try again later.
                </div>
              ) : certificates.length === 0 ? (
                <div className="text-center py-8">No certificates found.</div>
              ) : (
                <div className="overflow-x-auto">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Certificate Number</TableHead>
                        <TableHead>Name</TableHead>
                        <TableHead>Course</TableHead>
                        <TableHead>Issue Date</TableHead>
                        <TableHead>Score</TableHead>
                        <TableHead className="text-right">Actions</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {certificates.map((cert) => (
                        <TableRow key={cert.id}>
                          <TableCell>{cert.certificateNumber}</TableCell>
                          <TableCell>{cert.name}</TableCell>
                          <TableCell>{cert.certificateName}</TableCell>
                          <TableCell>{formatDate(cert.issueDate)}</TableCell>
                          <TableCell>{cert.percentageScore}%</TableCell>
                          <TableCell className="text-right">
                            <div className="flex justify-end gap-2">
                              <Button
                                variant="outline"
                                size="sm"
                                onClick={() => handleEditCertificate(cert)}
                              >
                                Edit
                              </Button>
                              <Button
                                variant="destructive"
                                size="sm"
                                onClick={() => handleDeleteCertificate(cert.id)}
                              >
                                Delete
                              </Button>
                            </div>
                          </TableCell>
                        </TableRow>
                      ))}
                      
                      {/* Edit Certificate Dialog */}
                      <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
                        <DialogContent className="sm:max-w-[500px]">
                          {certificateToEdit && (
                            <form onSubmit={handleEditSubmit}>
                              <DialogHeader>
                                <DialogTitle>Edit Certificate</DialogTitle>
                                <DialogDescription>
                                  Update certificate details
                                </DialogDescription>
                              </DialogHeader>
                              <div className="grid gap-4 py-4">
                                <div className="grid grid-cols-2 gap-4">
                                  <div className="space-y-2">
                                    <Label htmlFor="edit-certificateNumber">Certificate Number</Label>
                                    <Input
                                      id="edit-certificateNumber"
                                      name="certificateNumber"
                                      placeholder="e.g., ADCA-2023-1234"
                                      value={certificateToEdit.certificateNumber}
                                      onChange={handleEditInputChange}
                                      required
                                    />
                                  </div>
                                  <div className="space-y-2">
                                    <Label htmlFor="edit-certificateName">Certificate Name</Label>
                                    <Input
                                      id="edit-certificateName"
                                      name="certificateName"
                                      placeholder="e.g., ADCA, DCA, etc."
                                      value={certificateToEdit.certificateName}
                                      onChange={handleEditInputChange}
                                      required
                                    />
                                  </div>
                                </div>
                                <div className="space-y-2">
                                  <Label htmlFor="edit-name">Student Name</Label>
                                  <Input
                                    id="edit-name"
                                    name="name"
                                    placeholder="Enter student's full name"
                                    value={certificateToEdit.name}
                                    onChange={handleEditInputChange}
                                    required
                                  />
                                </div>
                                <div className="space-y-2">
                                  <Label htmlFor="edit-address">Address</Label>
                                  <Input
                                    id="edit-address"
                                    name="address"
                                    placeholder="Enter student's address"
                                    value={certificateToEdit.address}
                                    onChange={handleEditInputChange}
                                    required
                                  />
                                </div>
                                <div className="space-y-2">
                                  <Label htmlFor="edit-aadharNumber">Aadhar Number</Label>
                                  <Input
                                    id="edit-aadharNumber"
                                    name="aadharNumber"
                                    placeholder="Enter 12-digit Aadhar number"
                                    value={certificateToEdit.aadharNumber}
                                    onChange={handleEditInputChange}
                                    required
                                  />
                                </div>
                                <div className="grid grid-cols-2 gap-4">
                                  <div className="space-y-2">
                                    <Label htmlFor="edit-issueDate">Issue Date</Label>
                                    <Input
                                      id="edit-issueDate"
                                      name="issueDate"
                                      type="date"
                                      value={certificateToEdit.issueDate ? 
                                        (certificateToEdit.issueDate.includes('T') ? 
                                          certificateToEdit.issueDate.split('T')[0] : 
                                          certificateToEdit.issueDate) : 
                                        new Date().toISOString().split('T')[0]}
                                      onChange={handleEditInputChange}
                                      required
                                    />
                                  </div>
                                  <div className="space-y-2">
                                    <Label htmlFor="edit-percentageScore">Percentage Score</Label>
                                    <Input
                                      id="edit-percentageScore"
                                      name="percentageScore"
                                      type="number"
                                      min="1"
                                      max="100"
                                      value={certificateToEdit.percentageScore}
                                      onChange={handleEditInputChange}
                                      required
                                    />
                                  </div>
                                </div>
                              </div>
                              <DialogFooter>
                                <Button 
                                  type="submit" 
                                  disabled={editCertificateMutation.isPending}
                                >
                                  {editCertificateMutation.isPending ? "Updating..." : "Update Certificate"}
                                </Button>
                              </DialogFooter>
                            </form>
                          )}
                        </DialogContent>
                      </Dialog>
                      
                      {/* Delete Confirmation Dialog */}
                      <AlertDialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
                        <AlertDialogContent>
                          <AlertDialogHeader>
                            <AlertDialogTitle>Are you sure?</AlertDialogTitle>
                            <AlertDialogDescription>
                              This action cannot be undone. This will permanently delete the certificate.
                            </AlertDialogDescription>
                          </AlertDialogHeader>
                          <AlertDialogFooter>
                            <AlertDialogCancel>Cancel</AlertDialogCancel>
                            <AlertDialogAction 
                              onClick={() => {
                                if (certificateIdToDelete !== null) {
                                  deleteCertificateMutation.mutate(certificateIdToDelete);
                                }
                              }}
                              disabled={deleteCertificateMutation.isPending}
                              className="bg-red-600 hover:bg-red-700"
                            >
                              {deleteCertificateMutation.isPending ? "Deleting..." : "Delete"}
                            </AlertDialogAction>
                          </AlertDialogFooter>
                        </AlertDialogContent>
                      </AlertDialog>
                    </TableBody>
                  </Table>
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
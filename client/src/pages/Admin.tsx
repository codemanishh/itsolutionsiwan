import React, { useState } from "react";
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
import { ChevronDown, ChevronUp, LogOut } from "lucide-react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import CoursesTab from "@/components/admin/CoursesTab";
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

interface ComputerCourseType {
  id: number;
  title: string;
  fullName: string;
  duration: string;
  price: string;
  description: string;
  learningPoints: { id: number; point: string; sortOrder: number; courseId: number; }[];
  createdAt: string;
  updatedAt: string;
}

interface TypingCourseType {
  id: number;
  title: string;
  duration: string;
  price: string;
  description: string;
  learningPoints: { id: number; point: string; sortOrder: number; courseId: number; }[];
  createdAt: string;
  updatedAt: string;
}

export default function Admin() {
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [activeTab, setActiveTab] = useState("messages");
  
  // For new course management
  const [activeCourseTab, setActiveCourseTab] = useState<string>("computer");
  const [certificateToEdit, setCertificateToEdit] = useState<Certificate | null>(null);
  const [certificateIdToDelete, setCertificateIdToDelete] = useState<number | null>(null);
  const [expandedMessageIds, setExpandedMessageIds] = useState<number[]>([]);
  
  // Course management state
  const [isCourseDialogOpen, setIsCourseDialogOpen] = useState(false);
  const [isEditCourseDialogOpen, setIsEditCourseDialogOpen] = useState(false);
  const [isDeleteCourseDialogOpen, setIsDeleteCourseDialogOpen] = useState(false);
  const [courseIdToDelete, setCourseIdToDelete] = useState<number | null>(null);
  const [computerCourseToEdit, setComputerCourseToEdit] = useState<ComputerCourseType | null>(null);
  const [typingCourseToEdit, setTypingCourseToEdit] = useState<TypingCourseType | null>(null);
  
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
  
  // Form state for new computer course
  const [computerCourseData, setComputerCourseData] = useState({
    title: "",
    fullName: "",
    duration: "",
    price: "",
    description: "",
    learningPoints: [] as {point: string}[],
  });
  
  // Form state for new typing course
  const [typingCourseData, setTypingCourseData] = useState({
    title: "",
    duration: "",
    price: "",
    description: "",
    learningPoints: [] as {point: string}[],
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
  
  // Computer courses query
  const {
    data: computerCourses = [],
    isLoading: computerCoursesLoading,
    isError: computerCoursesError
  } = useQuery<ComputerCourseType[]>({
    queryKey: ['/api/computer-courses'],
    queryFn: async () => {
      const res = await fetch('/api/computer-courses', { credentials: 'include' });
      if (!res.ok) throw new Error('Failed to fetch computer courses');
      return res.json();
    },
    enabled: activeTab === "courses" && activeCourseTab === "computer",
  });
  
  // Typing courses query
  const {
    data: typingCourses = [],
    isLoading: typingCoursesLoading,
    isError: typingCoursesError
  } = useQuery<TypingCourseType[]>({
    queryKey: ['/api/typing-courses'],
    queryFn: async () => {
      const res = await fetch('/api/typing-courses', { credentials: 'include' });
      if (!res.ok) throw new Error('Failed to fetch typing courses');
      return res.json();
    },
    enabled: activeTab === "courses" && activeCourseTab === "typing",
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
  
  // Add computer course mutation
  const addComputerCourseMutation = useMutation({
    mutationFn: async (data: typeof computerCourseData) => {
      const res = await apiRequest("POST", "/api/computer-courses", data);
      return res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/computer-courses'] });
      setIsCourseDialogOpen(false);
      setComputerCourseData({
        title: "",
        fullName: "",
        duration: "",
        price: "",
        description: "",
        learningPoints: [],
      });
      toast({
        title: "Success",
        description: "Computer course added successfully",
      });
    },
    onError: (error) => {
      toast({
        title: "Error",
        description: `Failed to add computer course: ${error.message}`,
        variant: "destructive",
      });
    }
  });
  
  // Edit computer course mutation
  const editComputerCourseMutation = useMutation({
    mutationFn: async ({ id, data }: { id: number, data: Partial<ComputerCourseType> }) => {
      const res = await apiRequest("PUT", `/api/computer-courses/${id}`, data);
      return res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/computer-courses'] });
      setIsEditCourseDialogOpen(false);
      setComputerCourseToEdit(null);
      toast({
        title: "Success",
        description: "Computer course updated successfully",
      });
    },
    onError: (error) => {
      toast({
        title: "Error",
        description: `Failed to update computer course: ${error.message}`,
        variant: "destructive",
      });
    }
  });
  
  // Delete computer course mutation
  const deleteComputerCourseMutation = useMutation({
    mutationFn: async (id: number) => {
      await apiRequest("DELETE", `/api/computer-courses/${id}`);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/computer-courses'] });
      setIsDeleteCourseDialogOpen(false);
      setCourseIdToDelete(null);
      toast({
        title: "Success",
        description: "Computer course deleted successfully",
      });
    },
    onError: (error) => {
      toast({
        title: "Error",
        description: `Failed to delete computer course: ${error.message}`,
        variant: "destructive",
      });
    }
  });
  
  // Add typing course mutation
  const addTypingCourseMutation = useMutation({
    mutationFn: async (data: typeof typingCourseData) => {
      const res = await apiRequest("POST", "/api/typing-courses", data);
      return res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/typing-courses'] });
      setIsCourseDialogOpen(false);
      setTypingCourseData({
        title: "",
        duration: "",
        price: "",
        description: "",
        learningPoints: [],
      });
      toast({
        title: "Success",
        description: "Typing course added successfully",
      });
    },
    onError: (error) => {
      toast({
        title: "Error",
        description: `Failed to add typing course: ${error.message}`,
        variant: "destructive",
      });
    }
  });
  
  // Edit typing course mutation
  const editTypingCourseMutation = useMutation({
    mutationFn: async ({ id, data }: { id: number, data: Partial<TypingCourseType> }) => {
      const res = await apiRequest("PUT", `/api/typing-courses/${id}`, data);
      return res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/typing-courses'] });
      setIsEditCourseDialogOpen(false);
      setTypingCourseToEdit(null);
      toast({
        title: "Success",
        description: "Typing course updated successfully",
      });
    },
    onError: (error) => {
      toast({
        title: "Error",
        description: `Failed to update typing course: ${error.message}`,
        variant: "destructive",
      });
    }
  });
  
  // Delete typing course mutation
  const deleteTypingCourseMutation = useMutation({
    mutationFn: async (id: number) => {
      await apiRequest("DELETE", `/api/typing-courses/${id}`);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/typing-courses'] });
      setIsDeleteCourseDialogOpen(false);
      setCourseIdToDelete(null);
      toast({
        title: "Success",
        description: "Typing course deleted successfully",
      });
    },
    onError: (error) => {
      toast({
        title: "Error",
        description: `Failed to delete typing course: ${error.message}`,
        variant: "destructive",
      });
    }
  });
  
  const toggleMessageStatus = (id: number, currentStatus: string) => {
    const newStatus = currentStatus === 'open' ? 'closed' : 'open';
    updateMessageStatusMutation.mutate({ id, status: newStatus });
  };
  
  // Toggle message expansion
  const toggleMessageExpansion = (id: number) => {
    setExpandedMessageIds(prev => 
      prev.includes(id) 
        ? prev.filter(messageId => messageId !== id) 
        : [...prev, id]
    );
  };
  
  // Course handlers
  const handleComputerCourseInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setComputerCourseData(prev => ({
      ...prev,
      [name]: value
    }));
  };
  
  const handleTypingCourseInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setTypingCourseData(prev => ({
      ...prev,
      [name]: value
    }));
  };
  
  const handleComputerCourseSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    addComputerCourseMutation.mutate(computerCourseData);
  };
  
  const handleTypingCourseSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    addTypingCourseMutation.mutate(typingCourseData);
  };
  
  const handleEditComputerCourse = (course: ComputerCourseType) => {
    setComputerCourseToEdit(course);
    setIsEditCourseDialogOpen(true);
  };
  
  const handleEditTypingCourse = (course: TypingCourseType) => {
    setTypingCourseToEdit(course);
    setIsEditCourseDialogOpen(true);
  };
  
  const handleDeleteComputerCourse = (id: number) => {
    setCourseIdToDelete(id);
    setIsDeleteCourseDialogOpen(true);
  };
  
  const handleDeleteTypingCourse = (id: number) => {
    setCourseIdToDelete(id);
    setIsDeleteCourseDialogOpen(true);
  };
  
  const handleEditComputerCourseSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (computerCourseToEdit) {
      editComputerCourseMutation.mutate({
        id: computerCourseToEdit.id,
        data: computerCourseToEdit
      });
    }
  };
  
  const handleEditTypingCourseSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (typingCourseToEdit) {
      editTypingCourseMutation.mutate({
        id: typingCourseToEdit.id,
        data: typingCourseToEdit
      });
    }
  };
  
  const handleEditComputerCourseInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    if (computerCourseToEdit) {
      setComputerCourseToEdit({
        ...computerCourseToEdit,
        [name]: value
      });
    }
  };
  
  const handleEditTypingCourseInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    if (typingCourseToEdit) {
      setTypingCourseToEdit({
        ...typingCourseToEdit,
        [name]: value
      });
    }
  };
  
  // Learning points handlers for computer courses
  const addComputerLearningPoint = () => {
    setComputerCourseData(prev => ({
      ...prev,
      learningPoints: [...prev.learningPoints, { point: "" }]
    }));
  };
  
  const removeComputerLearningPoint = (index: number) => {
    setComputerCourseData(prev => ({
      ...prev,
      learningPoints: prev.learningPoints.filter((_, i) => i !== index)
    }));
  };
  
  const updateComputerLearningPoint = (index: number, value: string) => {
    setComputerCourseData(prev => {
      const newLearningPoints = [...prev.learningPoints];
      newLearningPoints[index] = { point: value };
      return {
        ...prev,
        learningPoints: newLearningPoints
      };
    });
  };
  
  // Learning points handlers for typing courses
  const addTypingLearningPoint = () => {
    setTypingCourseData(prev => ({
      ...prev,
      learningPoints: [...prev.learningPoints, { point: "" }]
    }));
  };
  
  const removeTypingLearningPoint = (index: number) => {
    setTypingCourseData(prev => ({
      ...prev,
      learningPoints: prev.learningPoints.filter((_, i) => i !== index)
    }));
  };
  
  const updateTypingLearningPoint = (index: number, value: string) => {
    setTypingCourseData(prev => {
      const newLearningPoints = [...prev.learningPoints];
      newLearningPoints[index] = { point: value };
      return {
        ...prev,
        learningPoints: newLearningPoints
      };
    });
  };
  
  // Learning points handlers for edit mode
  const addEditComputerLearningPoint = () => {
    if (computerCourseToEdit) {
      setComputerCourseToEdit({
        ...computerCourseToEdit,
        learningPoints: [...computerCourseToEdit.learningPoints, { id: 0, point: "", sortOrder: computerCourseToEdit.learningPoints.length, courseId: computerCourseToEdit.id }]
      });
    }
  };
  
  const removeEditComputerLearningPoint = (index: number) => {
    if (computerCourseToEdit) {
      setComputerCourseToEdit({
        ...computerCourseToEdit,
        learningPoints: computerCourseToEdit.learningPoints.filter((_, i) => i !== index)
      });
    }
  };
  
  const updateEditComputerLearningPoint = (index: number, value: string) => {
    if (computerCourseToEdit) {
      const newLearningPoints = [...computerCourseToEdit.learningPoints];
      newLearningPoints[index] = { ...newLearningPoints[index], point: value };
      setComputerCourseToEdit({
        ...computerCourseToEdit,
        learningPoints: newLearningPoints
      });
    }
  };
  
  const addEditTypingLearningPoint = () => {
    if (typingCourseToEdit) {
      setTypingCourseToEdit({
        ...typingCourseToEdit,
        learningPoints: [...typingCourseToEdit.learningPoints, { id: 0, point: "", sortOrder: typingCourseToEdit.learningPoints.length, courseId: typingCourseToEdit.id }]
      });
    }
  };
  
  const removeEditTypingLearningPoint = (index: number) => {
    if (typingCourseToEdit) {
      setTypingCourseToEdit({
        ...typingCourseToEdit,
        learningPoints: typingCourseToEdit.learningPoints.filter((_, i) => i !== index)
      });
    }
  };
  
  const updateEditTypingLearningPoint = (index: number, value: string) => {
    if (typingCourseToEdit) {
      const newLearningPoints = [...typingCourseToEdit.learningPoints];
      newLearningPoints[index] = { ...newLearningPoints[index], point: value };
      setTypingCourseToEdit({
        ...typingCourseToEdit,
        learningPoints: newLearningPoints
      });
    }
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
          <TabsTrigger value="courses">Courses</TabsTrigger>
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
                        <React.Fragment key={message.id}>
                          <TableRow>
                            <TableCell>
                              {formatDate(message.createdAt)}
                            </TableCell>
                            <TableCell>{message.name || "N/A"}</TableCell>
                            <TableCell>{message.phone || "N/A"}</TableCell>
                            <TableCell>{message.email || "N/A"}</TableCell>
                            <TableCell>{message.course || "N/A"}</TableCell>
                            <TableCell className="max-w-xs">
                              <div className="flex items-center space-x-2">
                                <Button 
                                  variant="ghost" 
                                  size="sm" 
                                  className="h-6 w-6 p-0"
                                  onClick={() => toggleMessageExpansion(message.id)}
                                >
                                  {expandedMessageIds.includes(message.id) 
                                    ? <ChevronUp className="h-4 w-4" /> 
                                    : <ChevronDown className="h-4 w-4" />
                                  }
                                </Button>
                                <span className={expandedMessageIds.includes(message.id) ? "" : "truncate"}>
                                  {message.message || "N/A"}
                                </span>
                              </div>
                            </TableCell>
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
                          
                          {/* Expanded message view */}
                          {expandedMessageIds.includes(message.id) && (
                            <TableRow>
                              <TableCell colSpan={8} className="bg-muted/50 px-4 py-3">
                                <div className="bg-white dark:bg-gray-800 rounded-md p-4 shadow-sm">
                                  <h4 className="font-semibold mb-2">Full Message:</h4>
                                  <p className="whitespace-pre-wrap">{message.message}</p>
                                </div>
                              </TableCell>
                            </TableRow>
                          )}
                        </React.Fragment>
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
                                      value={certificateToEdit.issueDate}
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
                      
                      {/* Delete Certificate Confirmation */}
                      <AlertDialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
                        <AlertDialogContent>
                          <AlertDialogHeader>
                            <AlertDialogTitle>Confirm Deletion</AlertDialogTitle>
                            <AlertDialogDescription>
                              Are you sure you want to delete this certificate? This action cannot be undone.
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

        {/* Courses Tab */}
        <TabsContent value="courses">
          <CoursesTab />
        </TabsContent>
      </Tabs>
    </div>
  );
}
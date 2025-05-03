import React from "react";
import { 
  Card, 
  CardContent, 
  CardDescription, 
  CardHeader, 
  CardTitle 
} from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { useQuery, useMutation } from "@tanstack/react-query";
import { apiRequest, queryClient } from "@/lib/queryClient";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";
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
} from "@/components/ui/alert-dialog";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

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

export default function CoursesTab() {
  const [activeCourseTab, setActiveCourseTab] = React.useState<string>("computer");
  const [isCourseDialogOpen, setIsCourseDialogOpen] = React.useState(false);
  const [isEditCourseDialogOpen, setIsEditCourseDialogOpen] = React.useState(false);
  const [isDeleteCourseDialogOpen, setIsDeleteCourseDialogOpen] = React.useState(false);
  const [courseIdToDelete, setCourseIdToDelete] = React.useState<number | null>(null);
  const [computerCourseToEdit, setComputerCourseToEdit] = React.useState<ComputerCourseType | null>(null);
  const [typingCourseToEdit, setTypingCourseToEdit] = React.useState<TypingCourseType | null>(null);
  
  const { toast } = useToast();
  
  // Form state for new computer course
  const [computerCourseData, setComputerCourseData] = React.useState({
    title: "",
    fullName: "",
    duration: "",
    price: "",
    description: "",
    learningPoints: [] as {point: string}[],
  });
  
  // Form state for new typing course
  const [typingCourseData, setTypingCourseData] = React.useState({
    title: "",
    duration: "",
    price: "",
    description: "",
    learningPoints: [] as {point: string}[],
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
    enabled: activeCourseTab === "computer",
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
    enabled: activeCourseTab === "typing",
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
    // Format learning points to ensure they are in the correct format
    const formattedLearningPoints = course.learningPoints.map(point => ({
      id: point.id,
      point: typeof point.point === 'string' 
        ? point.point 
        : typeof point.point === 'object' && point.point !== null
          ? JSON.stringify(point.point)
          : String(point.point),
      sortOrder: point.sortOrder,
      courseId: point.courseId
    }));
    
    setComputerCourseToEdit({
      ...course,
      learningPoints: formattedLearningPoints
    });
    setIsEditCourseDialogOpen(true);
  };
  
  const handleEditTypingCourse = (course: TypingCourseType) => {
    // Format learning points to ensure they are in the correct format
    const formattedLearningPoints = course.learningPoints.map(point => ({
      id: point.id,
      point: typeof point.point === 'string' 
        ? point.point 
        : typeof point.point === 'object' && point.point !== null
          ? JSON.stringify(point.point)
          : String(point.point),
      sortOrder: point.sortOrder,
      courseId: point.courseId
    }));
    
    setTypingCourseToEdit({
      ...course,
      learningPoints: formattedLearningPoints
    });
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
      // Format the learning points properly before submitting
      const formattedLearningPoints = computerCourseToEdit.learningPoints.map(point => ({
        id: point.id,
        point: typeof point.point === 'string' ? point.point : String(point.point),
        sortOrder: point.sortOrder,
        courseId: point.courseId
      }));
      
      const formattedData = {
        ...computerCourseToEdit,
        learningPoints: formattedLearningPoints
      };
      
      editComputerCourseMutation.mutate({
        id: computerCourseToEdit.id,
        data: formattedData
      });
    }
  };
  
  const handleEditTypingCourseSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (typingCourseToEdit) {
      // Format the learning points properly before submitting
      const formattedLearningPoints = typingCourseToEdit.learningPoints.map(point => ({
        id: point.id,
        point: typeof point.point === 'string' ? point.point : String(point.point),
        sortOrder: point.sortOrder,
        courseId: point.courseId
      }));
      
      const formattedData = {
        ...typingCourseToEdit,
        learningPoints: formattedLearningPoints
      };
      
      editTypingCourseMutation.mutate({
        id: typingCourseToEdit.id,
        data: formattedData
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
      // Make sure point property is a string
      newLearningPoints[index] = { 
        ...newLearningPoints[index], 
        point: value 
      };
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
      // Make sure point property is a string
      newLearningPoints[index] = { 
        ...newLearningPoints[index], 
        point: value 
      };
      setTypingCourseToEdit({
        ...typingCourseToEdit,
        learningPoints: newLearningPoints
      });
    }
  };

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between">
        <div>
          <CardTitle>Course Management</CardTitle>
          <CardDescription>Manage computer and typing courses</CardDescription>
        </div>
        <Dialog open={isCourseDialogOpen} onOpenChange={setIsCourseDialogOpen}>
          <DialogTrigger asChild>
            <Button>Add New Course</Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-[600px]">
            {/* Course creation form */}
            <Tabs value={activeCourseTab} onValueChange={setActiveCourseTab}>
              <TabsList className="grid w-full grid-cols-2 mb-4">
                <TabsTrigger value="computer">Computer Course</TabsTrigger>
                <TabsTrigger value="typing">Typing Course</TabsTrigger>
              </TabsList>
              
              {/* Computer course form */}
              <TabsContent value="computer">
                <form onSubmit={handleComputerCourseSubmit}>
                  <DialogHeader>
                    <DialogTitle>Add New Computer Course</DialogTitle>
                    <DialogDescription>
                      Fill in the details to create a new computer course
                    </DialogDescription>
                  </DialogHeader>
                  <div className="grid gap-4 py-4">
                    <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="title">Course Code</Label>
                        <Input
                          id="title"
                          name="title"
                          placeholder="e.g., ADCA, DCA"
                          value={computerCourseData.title}
                          onChange={handleComputerCourseInputChange}
                          required
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="fullName">Full Course Name</Label>
                        <Input
                          id="fullName"
                          name="fullName"
                          placeholder="e.g., Advance Diploma in Computer Application"
                          value={computerCourseData.fullName}
                          onChange={handleComputerCourseInputChange}
                          required
                        />
                      </div>
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="duration">Duration</Label>
                        <Input
                          id="duration"
                          name="duration"
                          placeholder="e.g., 6 Months"
                          value={computerCourseData.duration}
                          onChange={handleComputerCourseInputChange}
                          required
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="price">Price</Label>
                        <Input
                          id="price"
                          name="price"
                          placeholder="e.g., ₹5,000"
                          value={computerCourseData.price}
                          onChange={handleComputerCourseInputChange}
                          required
                        />
                      </div>
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="description">Description</Label>
                      <Input
                        id="description"
                        name="description"
                        placeholder="Brief description of the course"
                        value={computerCourseData.description}
                        onChange={handleComputerCourseInputChange}
                        required
                      />
                    </div>
                    <div className="space-y-2">
                      <div className="flex justify-between items-center mb-2">
                        <Label>Learning Points</Label>
                        <Button 
                          type="button" 
                          variant="outline" 
                          size="sm"
                          onClick={addComputerLearningPoint}
                        >
                          Add Point
                        </Button>
                      </div>
                      {computerCourseData.learningPoints.length === 0 ? (
                        <div className="text-center py-4 text-gray-500">
                          No learning points added. Click "Add Point" to add some.
                        </div>
                      ) : (
                        <div className="space-y-2">
                          {computerCourseData.learningPoints.map((point, index) => (
                            <div key={index} className="flex items-center gap-2">
                              <Input
                                placeholder={`Learning point ${index + 1}`}
                                value={point.point}
                                onChange={(e) => updateComputerLearningPoint(index, e.target.value)}
                                required
                              />
                              <Button 
                                type="button" 
                                variant="destructive" 
                                size="sm"
                                onClick={() => removeComputerLearningPoint(index)}
                              >
                                Remove
                              </Button>
                            </div>
                          ))}
                        </div>
                      )}
                    </div>
                  </div>
                  <DialogFooter>
                    <Button 
                      type="submit" 
                      disabled={addComputerCourseMutation.isPending}
                    >
                      {addComputerCourseMutation.isPending ? "Adding..." : "Add Computer Course"}
                    </Button>
                  </DialogFooter>
                </form>
              </TabsContent>
              
              {/* Typing course form */}
              <TabsContent value="typing">
                <form onSubmit={handleTypingCourseSubmit}>
                  <DialogHeader>
                    <DialogTitle>Add New Typing Course</DialogTitle>
                    <DialogDescription>
                      Fill in the details to create a new typing course
                    </DialogDescription>
                  </DialogHeader>
                  <div className="grid gap-4 py-4">
                    <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="title">Course Title</Label>
                        <Input
                          id="title"
                          name="title"
                          placeholder="e.g., Hindi Typing"
                          value={typingCourseData.title}
                          onChange={handleTypingCourseInputChange}
                          required
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="duration">Duration</Label>
                        <Input
                          id="duration"
                          name="duration"
                          placeholder="e.g., 1 Month"
                          value={typingCourseData.duration}
                          onChange={handleTypingCourseInputChange}
                          required
                        />
                      </div>
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="price">Price</Label>
                        <Input
                          id="price"
                          name="price"
                          placeholder="e.g., ₹2,000"
                          value={typingCourseData.price}
                          onChange={handleTypingCourseInputChange}
                          required
                        />
                      </div>
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="description">Description</Label>
                      <Input
                        id="description"
                        name="description"
                        placeholder="Brief description of the course"
                        value={typingCourseData.description}
                        onChange={handleTypingCourseInputChange}
                        required
                      />
                    </div>
                    <div className="space-y-2">
                      <div className="flex justify-between items-center mb-2">
                        <Label>Learning Points</Label>
                        <Button 
                          type="button" 
                          variant="outline" 
                          size="sm"
                          onClick={addTypingLearningPoint}
                        >
                          Add Point
                        </Button>
                      </div>
                      {typingCourseData.learningPoints.length === 0 ? (
                        <div className="text-center py-4 text-gray-500">
                          No learning points added. Click "Add Point" to add some.
                        </div>
                      ) : (
                        <div className="space-y-2">
                          {typingCourseData.learningPoints.map((point, index) => (
                            <div key={index} className="flex items-center gap-2">
                              <Input
                                placeholder={`Learning point ${index + 1}`}
                                value={point.point}
                                onChange={(e) => updateTypingLearningPoint(index, e.target.value)}
                                required
                              />
                              <Button 
                                type="button" 
                                variant="destructive" 
                                size="sm"
                                onClick={() => removeTypingLearningPoint(index)}
                              >
                                Remove
                              </Button>
                            </div>
                          ))}
                        </div>
                      )}
                    </div>
                  </div>
                  <DialogFooter>
                    <Button 
                      type="submit" 
                      disabled={addTypingCourseMutation.isPending}
                    >
                      {addTypingCourseMutation.isPending ? "Adding..." : "Add Typing Course"}
                    </Button>
                  </DialogFooter>
                </form>
              </TabsContent>
            </Tabs>
          </DialogContent>
        </Dialog>
      </CardHeader>
      <CardContent>
        <Tabs value={activeCourseTab} onValueChange={setActiveCourseTab}>
          <TabsList className="mb-4">
            <TabsTrigger value="computer">Computer Courses</TabsTrigger>
            <TabsTrigger value="typing">Typing Courses</TabsTrigger>
          </TabsList>
          
          {/* Computer courses list */}
          <TabsContent value="computer">
            {computerCoursesLoading ? (
              <div className="text-center py-8">Loading computer courses...</div>
            ) : computerCoursesError ? (
              <div className="text-center py-8 text-red-500">
                Failed to load computer courses. Please try again later.
              </div>
            ) : computerCourses.length === 0 ? (
              <div className="text-center py-8">No computer courses found.</div>
            ) : (
              <div className="overflow-x-auto">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Course Code</TableHead>
                      <TableHead>Full Name</TableHead>
                      <TableHead>Duration</TableHead>
                      <TableHead>Price</TableHead>
                      <TableHead>Learning Points</TableHead>
                      <TableHead className="text-right">Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {computerCourses.map((course) => (
                      <TableRow key={course.id}>
                        <TableCell className="font-medium">{course.title}</TableCell>
                        <TableCell>{course.fullName}</TableCell>
                        <TableCell>{course.duration}</TableCell>
                        <TableCell>{course.price}</TableCell>
                        <TableCell>
                          {course.learningPoints && course.learningPoints.length > 0 ? (
                            <Badge className="bg-green-500">{course.learningPoints.length} Points</Badge>
                          ) : (
                            <Badge variant="destructive">No Points</Badge>
                          )}
                        </TableCell>
                        <TableCell className="text-right">
                          <div className="flex justify-end gap-2">
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => handleEditComputerCourse(course)}
                            >
                              Edit
                            </Button>
                            <Button
                              variant="destructive"
                              size="sm"
                              onClick={() => handleDeleteComputerCourse(course.id)}
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
          </TabsContent>
          
          {/* Typing courses list */}
          <TabsContent value="typing">
            {typingCoursesLoading ? (
              <div className="text-center py-8">Loading typing courses...</div>
            ) : typingCoursesError ? (
              <div className="text-center py-8 text-red-500">
                Failed to load typing courses. Please try again later.
              </div>
            ) : typingCourses.length === 0 ? (
              <div className="text-center py-8">No typing courses found.</div>
            ) : (
              <div className="overflow-x-auto">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Title</TableHead>
                      <TableHead>Duration</TableHead>
                      <TableHead>Price</TableHead>
                      <TableHead>Learning Points</TableHead>
                      <TableHead className="text-right">Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {typingCourses.map((course) => (
                      <TableRow key={course.id}>
                        <TableCell className="font-medium">{course.title}</TableCell>
                        <TableCell>{course.duration}</TableCell>
                        <TableCell>{course.price}</TableCell>
                        <TableCell>
                          {course.learningPoints && course.learningPoints.length > 0 ? (
                            <Badge className="bg-green-500">{course.learningPoints.length} Points</Badge>
                          ) : (
                            <Badge variant="destructive">No Points</Badge>
                          )}
                        </TableCell>
                        <TableCell className="text-right">
                          <div className="flex justify-end gap-2">
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => handleEditTypingCourse(course)}
                            >
                              Edit
                            </Button>
                            <Button
                              variant="destructive"
                              size="sm"
                              onClick={() => handleDeleteTypingCourse(course.id)}
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
          </TabsContent>
        </Tabs>
        
        {/* Edit Computer Course Dialog */}
        <Dialog open={isEditCourseDialogOpen && computerCourseToEdit !== null} onOpenChange={(open) => {
          if (!open) setComputerCourseToEdit(null);
          setIsEditCourseDialogOpen(open);
        }}>
          <DialogContent className="sm:max-w-[600px]">
            {computerCourseToEdit && (
              <form onSubmit={handleEditComputerCourseSubmit}>
                <DialogHeader>
                  <DialogTitle>Edit Computer Course</DialogTitle>
                  <DialogDescription>
                    Make changes to the computer course
                  </DialogDescription>
                </DialogHeader>
                <div className="grid gap-4 py-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="edit-title">Course Code</Label>
                      <Input
                        id="edit-title"
                        name="title"
                        value={computerCourseToEdit.title}
                        onChange={handleEditComputerCourseInputChange}
                        required
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="edit-fullName">Full Course Name</Label>
                      <Input
                        id="edit-fullName"
                        name="fullName"
                        value={computerCourseToEdit.fullName}
                        onChange={handleEditComputerCourseInputChange}
                        required
                      />
                    </div>
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="edit-duration">Duration</Label>
                      <Input
                        id="edit-duration"
                        name="duration"
                        value={computerCourseToEdit.duration}
                        onChange={handleEditComputerCourseInputChange}
                        required
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="edit-price">Price</Label>
                      <Input
                        id="edit-price"
                        name="price"
                        value={computerCourseToEdit.price}
                        onChange={handleEditComputerCourseInputChange}
                        required
                      />
                    </div>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="edit-description">Description</Label>
                    <Input
                      id="edit-description"
                      name="description"
                      value={computerCourseToEdit.description}
                      onChange={handleEditComputerCourseInputChange}
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <div className="flex justify-between items-center mb-2">
                      <Label>Learning Points</Label>
                      <Button 
                        type="button" 
                        variant="outline" 
                        size="sm"
                        onClick={addEditComputerLearningPoint}
                      >
                        Add Point
                      </Button>
                    </div>
                    {computerCourseToEdit.learningPoints.length === 0 ? (
                      <div className="text-center py-4 text-gray-500">
                        No learning points added. Click "Add Point" to add some.
                      </div>
                    ) : (
                      <div className="space-y-2">
                        {computerCourseToEdit.learningPoints.map((point, index) => (
                          <div key={index} className="flex items-center gap-2">
                            <Input
                              placeholder={`Learning point ${index + 1}`}
                              value={typeof point.point === 'string' ? point.point : JSON.stringify(point.point)}
                              onChange={(e) => updateEditComputerLearningPoint(index, e.target.value)}
                              required
                            />
                            <Button 
                              type="button" 
                              variant="destructive" 
                              size="sm"
                              onClick={() => removeEditComputerLearningPoint(index)}
                            >
                              Remove
                            </Button>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                </div>
                <DialogFooter>
                  <Button 
                    type="submit" 
                    disabled={editComputerCourseMutation.isPending}
                  >
                    {editComputerCourseMutation.isPending ? "Saving..." : "Save Changes"}
                  </Button>
                </DialogFooter>
              </form>
            )}
          </DialogContent>
        </Dialog>
        
        {/* Edit Typing Course Dialog */}
        <Dialog open={isEditCourseDialogOpen && typingCourseToEdit !== null} onOpenChange={(open) => {
          if (!open) setTypingCourseToEdit(null);
          setIsEditCourseDialogOpen(open);
        }}>
          <DialogContent className="sm:max-w-[600px]">
            {typingCourseToEdit && (
              <form onSubmit={handleEditTypingCourseSubmit}>
                <DialogHeader>
                  <DialogTitle>Edit Typing Course</DialogTitle>
                  <DialogDescription>
                    Make changes to the typing course
                  </DialogDescription>
                </DialogHeader>
                <div className="grid gap-4 py-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="edit-typing-title">Course Title</Label>
                      <Input
                        id="edit-typing-title"
                        name="title"
                        value={typingCourseToEdit.title}
                        onChange={handleEditTypingCourseInputChange}
                        required
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="edit-typing-duration">Duration</Label>
                      <Input
                        id="edit-typing-duration"
                        name="duration"
                        value={typingCourseToEdit.duration}
                        onChange={handleEditTypingCourseInputChange}
                        required
                      />
                    </div>
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="edit-typing-price">Price</Label>
                      <Input
                        id="edit-typing-price"
                        name="price"
                        value={typingCourseToEdit.price}
                        onChange={handleEditTypingCourseInputChange}
                        required
                      />
                    </div>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="edit-typing-description">Description</Label>
                    <Input
                      id="edit-typing-description"
                      name="description"
                      value={typingCourseToEdit.description}
                      onChange={handleEditTypingCourseInputChange}
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <div className="flex justify-between items-center mb-2">
                      <Label>Learning Points</Label>
                      <Button 
                        type="button" 
                        variant="outline" 
                        size="sm"
                        onClick={addEditTypingLearningPoint}
                      >
                        Add Point
                      </Button>
                    </div>
                    {typingCourseToEdit.learningPoints.length === 0 ? (
                      <div className="text-center py-4 text-gray-500">
                        No learning points added. Click "Add Point" to add some.
                      </div>
                    ) : (
                      <div className="space-y-2">
                        {typingCourseToEdit.learningPoints.map((point, index) => (
                          <div key={index} className="flex items-center gap-2">
                            <Input
                              placeholder={`Learning point ${index + 1}`}
                              value={typeof point.point === 'string' ? point.point : JSON.stringify(point.point)}
                              onChange={(e) => updateEditTypingLearningPoint(index, e.target.value)}
                              required
                            />
                            <Button 
                              type="button" 
                              variant="destructive" 
                              size="sm"
                              onClick={() => removeEditTypingLearningPoint(index)}
                            >
                              Remove
                            </Button>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                </div>
                <DialogFooter>
                  <Button 
                    type="submit" 
                    disabled={editTypingCourseMutation.isPending}
                  >
                    {editTypingCourseMutation.isPending ? "Saving..." : "Save Changes"}
                  </Button>
                </DialogFooter>
              </form>
            )}
          </DialogContent>
        </Dialog>
        
        {/* Delete Course Confirmation Dialog */}
        <AlertDialog open={isDeleteCourseDialogOpen} onOpenChange={setIsDeleteCourseDialogOpen}>
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle>Are you sure?</AlertDialogTitle>
              <AlertDialogDescription>
                This action cannot be undone. This will permanently delete the course and all its associated data.
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel onClick={() => setCourseIdToDelete(null)}>Cancel</AlertDialogCancel>
              <AlertDialogAction
                onClick={() => {
                  if (courseIdToDelete !== null) {
                    if (activeCourseTab === "computer") {
                      deleteComputerCourseMutation.mutate(courseIdToDelete);
                    } else {
                      deleteTypingCourseMutation.mutate(courseIdToDelete);
                    }
                  }
                }}
                className="bg-red-600 hover:bg-red-700"
              >
                {(deleteComputerCourseMutation.isPending || deleteTypingCourseMutation.isPending) 
                  ? "Deleting..." 
                  : "Delete"}
              </AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
      </CardContent>
    </Card>
  );
}
import { useState } from "react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import ComputerCourses from "@/components/ComputerCourses";
import TypingCourses from "@/components/TypingCourses";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

export default function CoursesPage() {
  const [activeTab, setActiveTab] = useState<string>("computer");

  return (
    <div className="flex flex-col min-h-screen">
      <Navbar />
      <main className="flex-grow">
        <div className="py-8 bg-primary text-white">
          <div className="container mx-auto px-4">
            <h1 className="text-3xl md:text-4xl font-bold">Our Courses</h1>
            <p className="mt-2 text-lg">Explore our computer and typing courses designed to build your skills</p>
          </div>
        </div>
        
        <div className="container mx-auto px-4 py-8">
          <div className="flex flex-col items-center mb-8">
            <h2 className="text-2xl font-bold mb-4 text-center">Select Course Type</h2>
            
            <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full max-w-md">
              <TabsList className="grid w-full grid-cols-2">
                <TabsTrigger value="computer">Computer Courses</TabsTrigger>
                <TabsTrigger value="typing">Typing Courses</TabsTrigger>
              </TabsList>
              
              {/* We're not using TabsContent because we want to control the display outside the tabs */}
            </Tabs>
          </div>
          
          {/* Show courses based on active tab */}
          {activeTab === "computer" ? (
            <ComputerCourses />
          ) : (
            <TypingCourses />
          )}
        </div>
      </main>
      <Footer />
    </div>
  );
}
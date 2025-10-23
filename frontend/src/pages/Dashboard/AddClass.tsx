import { useState, FormEvent, ChangeEvent, useRef } from "react"; // 1. Impor useRef
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Trash2 } from "lucide-react";
import apiClient from "@/lib/apiClient";
import { useClassData } from "@/context/ClassDataContext"; // Import the context to update classes after adding

type ClassStatus = 'booked' | 'in use' | 'available';

export default function AddClass() {
  const [className, setClassName] = useState("");
  const [classDescription, setClassDescription] = useState("");
  const [classLocation, setClassLocation] = useState("");
  const [classImage, setClassImage] = useState<File | null>(null);
  const [classStatus, setClassStatus] = useState<ClassStatus>("available");
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false); // Loading state

  // Import context to update classes after adding
  const { setClasses } = useClassData();

  // 2. Buat ref untuk elemen input file
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleImageChange = (e: ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      setClassImage(file);
      setImagePreview(URL.createObjectURL(file));
    } else {
      setClassImage(null);
      setImagePreview(null);
    }
  };

  // 3. Buat fungsi untuk menghapus gambar yang dipilih
  const handleRemoveImage = () => {
    setClassImage(null);
    setImagePreview(null);
    // Reset nilai input file agar bisa memilih file yang sama lagi
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    if (!classImage) {
      alert("Please select an image to upload.");
      return;
    }
    
    setIsLoading(true); // Set loading state

    // Prepare data to send to backend
    // Note: backend might have different field names
    const roomData = {
      name: className,
      description: classDescription,
      location: classLocation,
      status: classStatus.charAt(0).toUpperCase() + classStatus.slice(1) // Capitalize first letter to match backend format
    };

    try {
      console.log("Sending data to backend:", roomData);
      
      // Create a FormData object to potentially include image
      const formData = new FormData();
      formData.append('name', roomData.name);
      formData.append('description', roomData.description);
      formData.append('location', roomData.location);
      formData.append('status', roomData.status);
      
      // If there's an image to upload, add it to the form
      if (classImage) {
        formData.append('image', classImage);
      }
      
      // Send the data to the backend API using POST /rooms/ with multipart form data
      // Note: The backend endpoint might have a prefix like '/api/v1' - adjust as needed
      const response = await apiClient.post("/rooms/", formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        }
      });
      
      console.log("API Response:", response.data);
      
      // Update the context with the new class data
      setClasses(prevClasses => {
        // Add the new class to the existing classes
        return [...prevClasses, {
          id: response.data.id || Date.now(), // Use backend ID if available, otherwise create temporary one
          name: response.data.name || roomData.name,
          description: response.data.description || roomData.description,
          location: response.data.location || roomData.location,
          status: response.data.status || (roomData.status as "Available" | "Booked" | "In Use"),
          image: response.data.image || "" // Use image from response if available
        }];
      });
      
      // Show success message
      alert("Class added successfully!");
      
      // Reset form
      setClassName("");
      setClassDescription("");
      setClassLocation("");
      setClassImage(null);
      setClassStatus("available");
      setImagePreview(null);
      
      // Reset file input
      if (fileInputRef.current) {
        fileInputRef.current.value = "";
      }
      
    } catch (error: any) {
      console.error("Error adding class:", error);
      
      // Handle different types of errors
      if (error.response) {
        // Server responded with error status
        console.log("Response data:", error.response.data);
        console.log("Response status:", error.response.status);
        console.log("Response headers:", error.response.headers);
        
        alert(`Error: ${error.response.data.detail || "Failed to add class"}`);
      } else if (error.request) {
        // Request was made but no response received
        console.log("Request object:", error.request);
        alert("Error: No response from server. Please check if the backend is running on http://localhost:8000.");
      } else {
        // Something else happened
        console.log("General error:", error.message);
        alert(`Error: ${error.message}`);
      }
    } finally {
      setIsLoading(false); // Reset loading state
    }
  };

  return (
    <div className="max-w-2xl mx-auto p-6 bg-white rounded-lg shadow-md">
      <h1 className="text-2xl font-bold mb-6 text-teal-700">Add New Class</h1>
      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Class Name */}
        <div>
          <label htmlFor="className" className="block text-sm font-medium text-gray-700 mb-1">
            Class Name
          </label>
          <Input 
            id="className" 
            placeholder="Class Name" 
            value={className} 
            onChange={(e) => setClassName(e.target.value)} 
            required
          />
        </div>
        
        {/* Description */}
        <div>
          <label htmlFor="classDescription" className="block text-sm font-medium text-gray-700 mb-1">
            Description
          </label>
          <Input 
            id="classDescription" 
            placeholder="Class Description" 
            value={classDescription} 
            onChange={(e) => setClassDescription(e.target.value)} 
            required
          />
        </div>
        
        {/* Location */}
        <div>
          <label htmlFor="classLocation" className="block text-sm font-medium text-gray-700 mb-1">
            Location
          </label>
          <Input 
            id="classLocation" 
            placeholder="Class Location" 
            value={classLocation} 
            onChange={(e) => setClassLocation(e.target.value)} 
            required
          />
        </div>

        {/* Image Upload */}
        <div>
          <label htmlFor="image-upload" className="block text-sm font-medium text-gray-700 mb-1">
            Upload class image
          </label>
          <Input
            id="image-upload"
            type="file"
            accept="image/png, image/jpeg, image/webp"
            onChange={handleImageChange}
            ref={fileInputRef}
            className="file:text-blue-500 file:border-none file:bg-transparent file:hover:bg-gray-100 dark:file:hover:bg-gray-700"
            required
          />
          {imagePreview && (
            <div className="relative mt-4 p-2 border rounded-md dark:border-gray-700">
              <p className="text-sm text-gray-600 dark:text-gray-400 mb-2">Image Preview:</p>

              <img
                src={imagePreview}
                alt="Selected class preview"
                className="max-w-full h-auto rounded-md object-cover"
                style={{ maxHeight: '200px' }}
              />

              <Button
                type="button"
                onClick={handleRemoveImage}
                className="
                  absolute top-2 right-2
                  h-8 w-8
                  rounded-full
                  bg-red-600 hover:bg-red-700
                  text-white
                  flex items-center justify-center
                  transition-all hover:scale-110 active:scale-95
                  focus:ring-2 focus:ring-red-500 focus:ring-offset-2
                "
              >
                <Trash2 className="h-4 w-4" />
              </Button>
            </div>
          )}
        </div>

        {/* Status Select */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Status
          </label>
          <Select
            value={classStatus}
            onValueChange={(value: string) => setClassStatus(value as ClassStatus)} // BENAR
          >
            <SelectTrigger className="w-full text-blue-500">
              <SelectValue placeholder="Select status" />
            </SelectTrigger>
            <SelectContent className="bg-white dark:bg-gray-800">
              <SelectItem className="hover:bg-cyan-400 hover:text-white" value="available">Available</SelectItem>
              <SelectItem className="hover:bg-cyan-400 hover:text-white" value="in use">In Use</SelectItem>
              <SelectItem className="hover:bg-cyan-400 hover:text-white" value="booked">Booked</SelectItem>
            </SelectContent>
          </Select>
        </div>
        
        {/* Submit Button */}
        <Button 
          type="submit" 
          className="bg-teal-600 hover:bg-teal-700 text-white w-full py-3 font-semibold"
          disabled={isLoading}
        >
          {isLoading ? "Adding Class..." : "Add Class"}
        </Button>
      </form>
    </div>
  );
}

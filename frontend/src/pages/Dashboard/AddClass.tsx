import { useState, FormEvent, ChangeEvent, useRef } from "react"; // 1. Impor useRef
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Trash2 } from "lucide-react";
import apiClient from "@/lib/apiClient";
import { useAuth } from "@/hooks/useAuth";
import { useNavigate } from "react-router-dom";

type ClassStatus = "booked" | "in_use" | "available";

export default function AddClass() {
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [location, setLocation] = useState("");
  const [capacity, setCapacity] = useState<number | string>("");
  const [image, setImage] = useState<File | null>(null);
  const [status, setStatus] = useState<ClassStatus>("available");
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const { user } = useAuth();
  const navigate = useNavigate();

  const [errors, setErrors] = useState({
    name: "",
    description: "",
    location: "",
    capacity: "",
    image: "",
  });

  const handleImageChange = (e: ChangeEvent<HTMLInputElement>) => {
    setError(null);
    if (errors.image) setErrors((prev) => ({ ...prev, image: "" }));

    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      if (!["image/png", "image/jpeg", "image/webp"].includes(file.type)) {
        setError("Invalid file type. Please upload PNG, JPEG, or WEBP.");
        handleRemoveImage();
        return;
      }
      setImage(file);
      setImagePreview(URL.createObjectURL(file));
    } else {
      handleRemoveImage();
    }
  };

  // 3. Buat fungsi untuk menghapus gambar yang dipilih
  const handleRemoveImage = () => {
    setImage(null);
    setImagePreview(null);
    // Reset nilai input file agar bisa memilih file yang sama lagi
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setError(null);

    let formIsValid = true;
    const newErrors = {
      name: "",
      description: "",
      location: "",
      capacity: "",
      image: "",
    };

    if (!name.trim()) {
      newErrors.name = "Class Name is required.";
      formIsValid = false;
    }
    if (!description.trim()) {
      newErrors.description = "Class Description is required."; // ✅ Tambahkan validasi deskripsi
      formIsValid = false;
    }
    if (!location.trim()) {
      newErrors.location = "Class Location is required.";
      formIsValid = false;
    }
    if (capacity === "") {
      newErrors.capacity = "Capacity is required.";
      formIsValid = false;
    } else {
      const numCapacity = Number(capacity);
      if (isNaN(numCapacity) || numCapacity <= 0) {
        newErrors.capacity = "Capacity must be a positive number.";
        formIsValid = false;
      }
    }
    if (!image) {
      newErrors.image = "Please select an image to upload.";
      formIsValid = false;
    }
    // 'status' memiliki default, jadi tidak perlu dicek

    setErrors(newErrors);
    if (!formIsValid) return;

    const numCapacity = Number(capacity);
    const formData = new FormData();
    formData.append("name", name.trim());
    formData.append("description", description.trim());
    formData.append("location", location.trim());
    formData.append("capacity", String(numCapacity));
    formData.append("status", status);
    formData.append("image", image!);

    setIsLoading(true);

    try {
      const response = await apiClient.post("/rooms", formData); // Adjust '/classes' if needed

      console.log("Class added successfully:", response.data);
      alert("Class added successfully!");
      navigate("/dashboard/manage-class");
    } catch (err: any) {
      console.error("Failed to add class:", err);
      const errorMessage =
        err.response?.data?.detail || "Failed to add class. Please try again.";
      setError(errorMessage);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div>
      <h1 className="text-2xl font-bold mb-4">Add New Class</h1>
      <form onSubmit={handleSubmit} className="space-y-4">
        {/* ... Input lainnya tetap sama ... */}
        <Input
          id="name"
          placeholder="Class Name"
          value={name}
          onChange={(e) => {
            setName(e.target.value);
            if (errors.name) setErrors((prev) => ({ ...prev, name: "" }));
          }}
        />
        {errors.name && <p className="text-red-500 text-sm">{errors.name}</p>}
        <Input
          id="description"
          placeholder="Masukan deskripsi kelas"
          value={description}
          onChange={(e) => {
            setDescription(e.target.value);
            if (errors.description)
              setErrors((prev) => ({ ...prev, description: "" }));
          }}
        />
        {errors.description && (
          <p className="text-red-500 text-sm">{errors.description}</p>
        )}
        <Input
          id="location"
          placeholder="Class Location (e.g., Building A, Room 101)"
          value={location}
          onChange={(e) => {
            setLocation(e.target.value);
            if (errors.location)
              setErrors((prev) => ({ ...prev, location: "" }));
          }}
        />
        {errors.location && (
          <p className="text-red-500 text-sm">{errors.location}</p>
        )}
        <Input
          id="capacity"
          type="number"
          placeholder="Class Capacity (e.g., 30)"
          value={capacity}
          onChange={(e) => {
            setCapacity(e.target.value);
            if (errors.capacity)
              setErrors((prev) => ({ ...prev, capacity: "" }));
          }}
        />
        {errors.capacity && (
          <p className="text-red-500 text-sm">{errors.capacity}</p>
        )}

        <div>
          <label
            htmlFor="image-upload"
            className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1"
          >
            Upload class image
          </label>
          <Input
            id="image-upload"
            type="file"
            accept="image/png, image/jpeg, image/webp"
            onChange={handleImageChange}
            ref={fileInputRef}
            required
            className="file:text-blue-500 file:border-none file:bg-transparent file:hover:bg-gray-100 dark:file:hover:bg-gray-700"
          />
          {errors.image && (
            <p className="text-red-500 text-sm mt-1">{errors.image}</p>
          )}
          {imagePreview && (
            <div className="relative mt-4 p-2 border rounded-md dark:border-gray-700">
              <p className="text-sm text-gray-600 dark:text-gray-400 mb-2">
                Image Preview:
              </p>

              <img
                src={imagePreview}
                alt="Selected class preview"
                className="max-w-full h-auto rounded-md object-cover"
                style={{ maxHeight: "200px" }}
              />

              <Button
                type="button"
                variant="destructive"
                size="icon"
                onClick={handleRemoveImage}
                className="absolute top-2 right-2 h-8 w-8 rounded-md bg-red-600 hover:bg-red-700 text-white flex items-center justify-center p-4 transition-all hover:scale-110 active:scale-95 focus:ring-2 focus:ring-red-500 focus:ring-offset-2"
              >
                <Trash2 className="h-4 w-4" />{" "}
              </Button>
            </div>
          )}
        </div>

        <Select
          value={status}
          onValueChange={(value: string) => setStatus(value as ClassStatus)} // BENAR
        >
          <SelectTrigger className="w-full text-blue-500">
            <SelectValue placeholder="Select status" />
          </SelectTrigger>
          <SelectContent className="bg-white dark:bg-gray-800">
            <SelectItem
              className="hover:bg-cyan-400 hover:text-white"
              value="available"
            >
              Available
            </SelectItem>
            <SelectItem
              className="hover:bg-cyan-400 hover:text-white"
              value="in_use"
            >
              In Use
            </SelectItem>
            <SelectItem
              className="hover:bg-cyan-400 hover:text-white"
              value="booked"
            >
              Booked
            </SelectItem>
          </SelectContent>
        </Select>

        {error && <p className="text-red-500 text-sm text-center">{error}</p>}

        <Button
          type="submit"
          className="w-full bg-blue-600 hover:bg-blue-700 text-white"
          disabled={isLoading}
        >
          {isLoading ? "Adding Class..." : "Add Class"}
        </Button>
      </form>
    </div>
  );
}

import { useState, FormEvent, ChangeEvent, useRef } from "react"; // 1. Impor useRef
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Trash2 } from "lucide-react";

type ClassStatus = 'booked' | 'in use' | 'available';

export default function AddClass() {
  const [className, setClassName] = useState("");
  const [classDescription, setClassDescription] = useState("");
  const [classLocation, setClassLocation] = useState("");
  const [classImage, setClassImage] = useState<File | null>(null);
  const [classStatus, setClassStatus] = useState<ClassStatus>("available");
  const [imagePreview, setImagePreview] = useState<string | null>(null);

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
    const formData = new FormData();
    formData.append("className", className);
    formData.append("description", classDescription);
    formData.append("location", classLocation);
    formData.append("status", classStatus);
    formData.append("image", classImage);
    console.log("Preparing to send data:");
    for (let [key, value] of formData.entries()) {
      console.log(`${key}:`, value);
    }
    // ... Logika Fetch API ...
  };

  return (
    <div>
      <h1 className="text-2xl font-bold mb-4">Add New Class</h1>
      <form onSubmit={handleSubmit} className="space-y-4">
        {/* ... Input lainnya tetap sama ... */}
        <Input placeholder="Class Name" value={className} onChange={(e) => setClassName(e.target.value)} />
        <Input placeholder="Class Description" value={classDescription} onChange={(e) => setClassDescription(e.target.value)} />
        <Input placeholder="Class Location" value={classLocation} onChange={(e) => setClassLocation(e.target.value)} />

        <div>
          <label htmlFor="image-upload" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
            Upload class image
          </label>
          <Input
            id="image-upload"
            type="file"
            accept="image/png, image/jpeg, image/webp"
            onChange={handleImageChange}
            ref={fileInputRef} // 4. Hubungkan ref ke elemen input
            className="file:text-blue-500 file:border-none file:bg-transparent file:hover:bg-gray-100 dark:file:hover:bg-gray-700"
          />
          {imagePreview && (
            // 5. Tambahkan tombol hapus ke area pratinjau
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
        rounded-md
        bg-red-600 hover:bg-red-700
        text-white
        flex items-center justify-center
        p-4
        transition-all hover:scale-110 active:scale-95
        focus:ring-2 focus:ring-red-500 focus:ring-offset-2
    "
>
    <Trash2 className="h-4 w-4" /> {/* Atur ukuran ikon di dalamnya */}
</Button>
            </div>
          )}
        </div>

        {/* ... Komponen Select dan Button Submit tetap sama ... */}
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
        <Button type="submit" className="bg-blue-500 text-white w-full">Add Class</Button>
      </form>
    </div>
  );
}

import { useState, FormEvent } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

export default function AddClass() {
  const [className, setClassName] = useState("");

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    console.log("New Class:", className);
    // TODO: Call API -> POST /classes
    setClassName("");
  };

  return (
    <div>
      <h1 className="text-2xl font-bold mb-4">Add New Class</h1>
      <form onSubmit={handleSubmit} className="space-y-4">
        <Input
          placeholder="Class Name"
          value={className}
          onChange={(e) => setClassName(e.target.value)}
        />
        <Button type="submit" className="bg-blue-500 text-white">Add Class</Button>
      </form>
    </div>
  );
}

import { useState } from "react";
import { useWardrobe } from "@/context/WardrobeContext";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card } from "@/components/ui/card";
import { Plus, X } from "lucide-react";
import { motion } from "framer-motion";
import { useToast } from "@/components/ui/use-toast";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

const CATEGORIES = ["Shoes", "Trousers", "Tops", "Hats"] as const;

export function AddClothingForm() {
  const { addClothingItem, tags, addTag } = useWardrobe();
  const { toast } = useToast();
  const [name, setName] = useState("");
  const [category, setCategory] = useState<string>("");
  const [selectedTags, setSelectedTags] = useState<string[]>([]);
  const [image, setImage] = useState<string>("");
  const [newTagName, setNewTagName] = useState("");
  const [newTagColor, setNewTagColor] = useState("#000000");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!category) {
      toast({
        title: "Error",
        description: "Please select a category",
        variant: "destructive",
      });
      return;
    }
    const newItem = {
      id: Date.now().toString(),
      name,
      category,
      image,
      tags: tags.filter((tag) => selectedTags.includes(tag.id)),
      dateAdded: new Date().toISOString(),
    };
    addClothingItem(newItem);
    toast({
      title: "Success",
      description: "Item added to your wardrobe",
    });
    // Reset form
    setName("");
    setCategory("");
    setSelectedTags([]);
    setImage("");
  };

  const handleAddTag = () => {
    if (newTagName.trim()) {
      const newTag = {
        id: Date.now().toString(),
        name: newTagName.trim(),
        color: newTagColor,
      };
      addTag(newTag);
      setNewTagName("");
      setNewTagColor("#000000");
      toast({
        title: "Success",
        description: "New tag created",
      });
    }
  };

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setImage(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  return (
    <Card className="p-6 max-w-md mx-auto bg-white shadow-sm">
      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="space-y-2">
          <Label htmlFor="image">Image</Label>
          <div className="mt-1 flex justify-center px-6 pt-5 pb-6 border-2 border-dashed rounded-md">
            {image ? (
              <div className="relative w-full aspect-square">
                <img
                  src={image}
                  alt="Preview"
                  className="object-cover w-full h-full rounded-md"
                />
                <Button
                  type="button"
                  variant="destructive"
                  size="icon"
                  className="absolute top-2 right-2"
                  onClick={() => setImage("")}
                >
                  <X className="h-4 w-4" />
                </Button>
              </div>
            ) : (
              <div className="space-y-1 text-center">
                <div className="flex text-sm text-gray-600">
                  <label
                    htmlFor="file-upload"
                    className="relative cursor-pointer rounded-md font-medium text-primary hover:text-primary/80 focus-within:outline-none"
                  >
                    <span>Upload a file</span>
                    <input
                      id="file-upload"
                      name="file-upload"
                      type="file"
                      className="sr-only"
                      accept="image/*"
                      onChange={handleImageUpload}
                    />
                  </label>
                </div>
              </div>
            )}
          </div>
        </div>

        <div className="space-y-2">
          <Label htmlFor="name">Name</Label>
          <Input
            id="name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="category">Category</Label>
          <Select value={category} onValueChange={setCategory} required>
            <SelectTrigger>
              <SelectValue placeholder="Select a category" />
            </SelectTrigger>
            <SelectContent>
              {CATEGORIES.map((cat) => (
                <SelectItem key={cat} value={cat}>
                  {cat}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div className="space-y-2">
          <Label>Create New Tag</Label>
          <div className="flex gap-2">
            <Input
              placeholder="Tag name"
              value={newTagName}
              onChange={(e) => setNewTagName(e.target.value)}
            />
            <Input
              type="color"
              value={newTagColor}
              onChange={(e) => setNewTagColor(e.target.value)}
              className="w-20"
            />
            <Button type="button" onClick={handleAddTag}>
              Add Tag
            </Button>
          </div>
        </div>

        <div className="space-y-2">
          <Label>Tags</Label>
          <div className="flex flex-wrap gap-2">
            {tags.map((tag) => (
              <Button
                key={tag.id}
                type="button"
                variant={selectedTags.includes(tag.id) ? "default" : "outline"}
                onClick={() =>
                  setSelectedTags((prev) =>
                    prev.includes(tag.id)
                      ? prev.filter((id) => id !== tag.id)
                      : [...prev, tag.id]
                  )
                }
                className="text-sm"
                style={{
                  backgroundColor: selectedTags.includes(tag.id)
                    ? tag.color
                    : "transparent",
                  color: selectedTags.includes(tag.id) ? "white" : "inherit",
                }}
              >
                {tag.name}
              </Button>
            ))}
          </div>
        </div>

        <Button type="submit" className="w-full">
          <Plus className="mr-2 h-4 w-4" /> Add Item
        </Button>
      </form>
    </Card>
  );
}
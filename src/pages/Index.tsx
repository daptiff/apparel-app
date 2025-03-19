import { useState } from "react";
import { WardrobeProvider, useWardrobe } from "@/context/WardrobeContext";
import { ClothingCard } from "@/components/ClothingCard";
import { AddClothingForm } from "@/components/AddClothingForm";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useToast } from "@/components/ui/use-toast";
import { Plus, Filter, ChevronUp } from "lucide-react";
import { motion } from "framer-motion";
import { ClothingItem } from "@/types/wardrobe";
import { AuthDialog } from "@/components/AuthDialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

const CATEGORIES = ["Shoes", "Trousers", "Tops", "Hats"] as const;
const CATEGORIES_ORDER = ["hats", "tops", "trousers", "shoes"];

function WardrobeContent() {
  const { clothes, tags, filterByTag, removeClothingItem, addOutfit } = useWardrobe();
  const [showAddForm, setShowAddForm] = useState(false);
  const [showOutfitCreator, setShowOutfitCreator] = useState(false);
  const [selectedTagId, setSelectedTagId] = useState<string | null>(null);
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [outfitName, setOutfitName] = useState("");
  const [selectedItems, setSelectedItems] = useState<Record<string, ClothingItem | null>>({
    hats: null,
    tops: null,
    trousers: null,
    shoes: null,
  });
  const { toast } = useToast();

  const filteredByTag = filterByTag(selectedTagId);
  const filteredClothes = selectedCategory
    ? filteredByTag.filter((item) => item.category === selectedCategory)
    : filteredByTag;

  const handleItemClick = (category: string, item: ClothingItem) => {
    setSelectedItems(prev => ({
      ...prev,
      [category]: prev[category]?.id === item.id ? null : item
    }));
  };

  const handleCreateOutfit = () => {
    const items = Object.values(selectedItems).filter((item): item is ClothingItem => item !== null);
    
    if (items.length === 0) {
      toast({
        title: "Error",
        description: "Please select at least one item for your outfit",
        variant: "destructive",
      });
      return;
    }

    if (!outfitName.trim()) {
      toast({
        title: "Error",
        description: "Please provide a name for your outfit",
        variant: "destructive",
      });
      return;
    }

    addOutfit({
      id: crypto.randomUUID(),
      name: outfitName,
      items,
      dateCreated: new Date().toISOString(),
    });

    toast({
      title: "Success",
      description: "Outfit created successfully!",
    });

    setOutfitName("");
    setSelectedItems({
      hats: null,
      tops: null,
      trousers: null,
      shoes: null,
    });
    setShowOutfitCreator(false);
  };

  return (
    <div className="container py-8">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-4xl font-light tracking-tight">My Wardrobe</h1>
        <div className="flex items-center gap-4">
          <AuthDialog />
          <div className="h-6 w-px bg-gray-200" />
          <div className="flex gap-2">
            <Button size="sm" onClick={() => setShowAddForm(!showAddForm)}>
              <Plus className="mr-2 h-4 w-4" />
              Add Item
            </Button>
            <Button
              size="sm"
              onClick={() => setShowOutfitCreator(!showOutfitCreator)}
              variant="outline"
            >
              {showOutfitCreator ? (
                <>
                  <ChevronUp className="mr-2 h-4 w-4" />
                  Hide Outfit Creator
                </>
              ) : (
                <>
                  <Plus className="mr-2 h-4 w-4" />
                  Create Outfit
                </>
              )}
            </Button>
          </div>
        </div>
      </div>

      {showAddForm && (
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -20 }}
          className="mb-8"
        >
          <AddClothingForm />
        </motion.div>
      )}

      <div className="space-y-8">
        <div>
          <div className="mb-6 space-y-4">
            <div className="flex flex-col sm:flex-row gap-4">
              <div className="flex-1">
                <div className="flex items-center gap-2 mb-2">
                  <Filter className="h-4 w-4" />
                  <span className="text-sm font-medium">Filter by tag:</span>
                </div>
                <div className="flex flex-wrap gap-2">
                  <Button
                    variant={selectedTagId === null ? "default" : "outline"}
                    onClick={() => setSelectedTagId(null)}
                    className="text-sm"
                  >
                    All
                  </Button>
                  {tags.map((tag) => (
                    <Button
                      key={tag.id}
                      variant={selectedTagId === tag.id ? "default" : "outline"}
                      onClick={() => setSelectedTagId(tag.id)}
                      className="text-sm"
                      style={{
                        backgroundColor:
                          selectedTagId === tag.id ? tag.color : "transparent",
                        color: selectedTagId === tag.id ? "white" : "inherit",
                      }}
                    >
                      {tag.name}
                    </Button>
                  ))}
                </div>
              </div>
              
              <div className="w-full sm:w-48">
                <div className="flex items-center gap-2 mb-2">
                  <Filter className="h-4 w-4" />
                  <span className="text-sm font-medium">Filter by category:</span>
                </div>
                <Select
                  value={selectedCategory || "all"}
                  onValueChange={(value) =>
                    setSelectedCategory(value === "all" ? null : value)
                  }
                >
                  <SelectTrigger>
                    <SelectValue placeholder="All categories" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All categories</SelectItem>
                    {CATEGORIES.map((category) => (
                      <SelectItem key={category} value={category}>
                        {category}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {filteredClothes.map((item) => (
              <ClothingCard
                key={item.id}
                item={item}
                onRemove={() => removeClothingItem(item.id)}
                onClick={() => handleItemClick(item.category.toLowerCase(), item)}
              />
            ))}
          </div>

          {clothes.length === 0 && !showAddForm && (
            <div className="text-center py-12">
              <p className="text-lg text-gray-600 mb-4">
                Your wardrobe is empty. Start by adding some clothes!
              </p>
              <Button onClick={() => setShowAddForm(true)}>
                <Plus className="mr-2 h-4 w-4" />
                Add Your First Item
              </Button>
            </div>
          )}
        </div>

        {showOutfitCreator && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            className="bg-gray-50 p-6 rounded-lg mt-8"
          >
            <h2 className="text-2xl font-light tracking-tight mb-4">Create Outfit</h2>
            <div className="flex flex-col gap-4">
              <div>
                <Label htmlFor="outfitName">Outfit Name</Label>
                <Input
                  id="outfitName"
                  value={outfitName}
                  onChange={(e) => setOutfitName(e.target.value)}
                  placeholder="Enter outfit name"
                  className="mb-4"
                />
              </div>
              <div className="flex flex-wrap justify-center gap-4">
                {CATEGORIES_ORDER.map((category) => (
                  <div key={category} className="w-24">
                    {selectedItems[category] ? (
                      <div className="w-24 h-24">
                        <ClothingCard
                          item={selectedItems[category]!}
                          onClick={() => handleItemClick(category, selectedItems[category]!)}
                        />
                      </div>
                    ) : (
                      <div className="w-24 h-24 border-2 border-dashed border-gray-300 rounded-lg flex items-center justify-center text-gray-400 text-xs text-center p-2">
                        Select {category}
                      </div>
                    )}
                  </div>
                ))}
              </div>
              <Button onClick={handleCreateOutfit} className="mt-4">
                Save Outfit
              </Button>
            </div>
          </motion.div>
        )}
      </div>
    </div>
  );
}

const Index = () => {
  return (
    <WardrobeProvider>
      <div className="min-h-screen bg-wardrobe-muted">
        <WardrobeContent />
      </div>
    </WardrobeProvider>
  );
};

export default Index;


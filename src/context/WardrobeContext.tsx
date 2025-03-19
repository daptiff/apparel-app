import React, { createContext, useContext, useState, useEffect } from "react";
import { ClothingItem, Outfit, ClothingTag } from "@/types/wardrobe";

interface WardrobeContextType {
  clothes: ClothingItem[];
  outfits: Outfit[];
  tags: ClothingTag[];
  addClothingItem: (item: ClothingItem) => void;
  addOutfit: (outfit: Outfit) => void;
  addTag: (tag: ClothingTag) => void;
  removeClothingItem: (id: string) => void;
  removeTag: (id: string) => void;
  filterByTag: (tagId: string | null) => ClothingItem[];
}

const WardrobeContext = createContext<WardrobeContextType | undefined>(undefined);

// Load data from localStorage
const loadFromStorage = (key: string) => {
  const data = localStorage.getItem(key);
  return data ? JSON.parse(data) : [];
};

// Save data to localStorage
const saveToStorage = (key: string, data: any) => {
  localStorage.setItem(key, JSON.stringify(data));
};

export function WardrobeProvider({ children }: { children: React.ReactNode }) {
  const [clothes, setClothes] = useState<ClothingItem[]>(() => loadFromStorage('wardrobe-clothes'));
  const [outfits, setOutfits] = useState<Outfit[]>(() => loadFromStorage('wardrobe-outfits'));
  const [tags, setTags] = useState<ClothingTag[]>(() => loadFromStorage('wardrobe-tags'));

  // Save to localStorage whenever data changes
  useEffect(() => {
    saveToStorage('wardrobe-clothes', clothes);
  }, [clothes]);

  useEffect(() => {
    saveToStorage('wardrobe-outfits', outfits);
  }, [outfits]);

  useEffect(() => {
    saveToStorage('wardrobe-tags', tags);
  }, [tags]);

  const addClothingItem = (item: ClothingItem) => {
    setClothes((prev) => [...prev, item]);
  };

  const removeClothingItem = (id: string) => {
    setClothes((prev) => prev.filter((item) => item.id !== id));
  };

  const addOutfit = (outfit: Outfit) => {
    setOutfits((prev) => [...prev, outfit]);
  };

  const addTag = (tag: ClothingTag) => {
    setTags((prev) => [...prev, tag]);
  };

  const removeTag = (id: string) => {
    setTags((prev) => prev.filter((tag) => tag.id !== id));
  };

  const filterByTag = (tagId: string | null) => {
    if (!tagId) return clothes;
    return clothes.filter((item) => 
      item.tags.some((tag) => tag.id === tagId)
    );
  };

  return (
    <WardrobeContext.Provider
      value={{
        clothes,
        outfits,
        tags,
        addClothingItem,
        addOutfit,
        addTag,
        removeClothingItem,
        removeTag,
        filterByTag,
      }}
    >
      {children}
    </WardrobeContext.Provider>
  );
}

export function useWardrobe() {
  const context = useContext(WardrobeContext);
  if (context === undefined) {
    throw new Error("useWardrobe must be used within a WardrobeProvider");
  }
  return context;
}
export type ClothingTag = {
  id: string;
  name: string;
  color: string;
};

export type ClothingItem = {
  id: string;
  name: string;
  image: string;
  tags: ClothingTag[];
  category: string;
  dateAdded: string;
};

export type Outfit = {
  id: string;
  name: string;
  items: ClothingItem[];
  dateCreated: string;
};
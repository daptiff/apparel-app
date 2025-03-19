import { ClothingItem } from "@/types/wardrobe";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Trash2 } from "lucide-react";
import { motion } from "framer-motion";

interface ClothingCardProps {
  item: ClothingItem;
  onClick?: () => void;
  onRemove?: () => void;
}

export function ClothingCard({ item, onClick, onRemove }: ClothingCardProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      whileHover={{ scale: 1.02 }}
      className="relative"
    >
      <Card className="overflow-hidden bg-white shadow-sm hover:shadow-md transition-shadow duration-300">
        <div className="aspect-square relative overflow-hidden">
          <img
            src={item.image}
            alt={item.name}
            className="object-cover w-full h-full cursor-pointer"
            onClick={onClick}
            loading="lazy"
          />
          {onRemove && (
            <Button
              variant="destructive"
              size="icon"
              className="absolute top-2 right-2"
              onClick={(e) => {
                e.stopPropagation();
                onRemove();
              }}
            >
              <Trash2 className="h-4 w-4" />
            </Button>
          )}
        </div>
        <div className="p-4">
          <h3 className="font-medium text-lg mb-2">{item.name}</h3>
          <div className="flex flex-wrap gap-2">
            {item.tags.map((tag) => (
              <Badge
                key={tag.id}
                variant="secondary"
                className="text-xs text-white"
                style={{ backgroundColor: tag.color }}
              >
                {tag.name}
              </Badge>
            ))}
          </div>
        </div>
      </Card>
    </motion.div>
  );
}
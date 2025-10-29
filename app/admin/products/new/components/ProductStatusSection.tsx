import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";

interface ProductStatusSectionProps {
  formData: {
    inStock: boolean;
    isActive: boolean;
    isFeatured: boolean;
    isNew: boolean;
  };
  handleCheckboxChange: (name: string, checked: boolean) => void;
}

export default function ProductStatusSection({
  formData,
  handleCheckboxChange,
}: ProductStatusSectionProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Product Status</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="flex items-center space-x-2">
          <Checkbox
            id="inStock"
            checked={formData.inStock}
            onCheckedChange={(checked) =>
              handleCheckboxChange("inStock", checked as boolean)
            }
          />
          <Label htmlFor="inStock">In Stock</Label>
        </div>

        <div className="flex items-center space-x-2">
          <Checkbox
            id="isActive"
            checked={formData.isActive}
            onCheckedChange={(checked) =>
              handleCheckboxChange("isActive", checked as boolean)
            }
          />
          <Label htmlFor="isActive">Active (Visible to customers)</Label>
        </div>

        <div className="flex items-center space-x-2">
          <Checkbox
            id="isFeatured"
            checked={formData.isFeatured}
            onCheckedChange={(checked) =>
              handleCheckboxChange("isFeatured", checked as boolean)
            }
          />
          <Label htmlFor="isFeatured">Featured Product</Label>
        </div>

        <div className="flex items-center space-x-2">
          <Checkbox
            id="isNew"
            checked={formData.isNew}
            onCheckedChange={(checked) =>
              handleCheckboxChange("isNew", checked as boolean)
            }
          />
          <Label htmlFor="isNew">New Arrival</Label>
        </div>
      </CardContent>
    </Card>
  );
}

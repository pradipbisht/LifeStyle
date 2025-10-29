import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

interface SpecificationsSectionProps {
  formData: {
    specifications: {
      weight: string;
      dimensions: string;
      ingredients: string;
      usage: string;
    };
  };
  handleSpecChange: (name: string, value: string) => void;
}

export default function SpecificationsSection({
  formData,
  handleSpecChange,
}: SpecificationsSectionProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Specifications (Optional)</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label htmlFor="weight">Weight</Label>
            <Input
              id="weight"
              value={formData.specifications.weight}
              onChange={(e) => handleSpecChange("weight", e.target.value)}
              placeholder="e.g., 100g"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="dimensions">Dimensions</Label>
            <Input
              id="dimensions"
              value={formData.specifications.dimensions}
              onChange={(e) => handleSpecChange("dimensions", e.target.value)}
              placeholder="e.g., 10x5x3 cm"
            />
          </div>
        </div>

        <div className="space-y-2">
          <Label htmlFor="ingredients">Ingredients</Label>
          <Textarea
            id="ingredients"
            value={formData.specifications.ingredients}
            onChange={(e) => handleSpecChange("ingredients", e.target.value)}
            rows={3}
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="usage">Usage Instructions</Label>
          <Textarea
            id="usage"
            value={formData.specifications.usage}
            onChange={(e) => handleSpecChange("usage", e.target.value)}
            rows={3}
          />
        </div>
      </CardContent>
    </Card>
  );
}

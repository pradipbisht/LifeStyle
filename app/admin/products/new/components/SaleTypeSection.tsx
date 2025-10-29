import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { AffiliateProvider } from "@/lib/types/shop";

interface SaleTypeSectionProps {
  formData: {
    saleType: "affiliate" | "direct";
    affiliateProvider: AffiliateProvider;
    affiliateLink: string;
    stock: string;
  };
  handleInputChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  handleSelectChange: (name: string, value: string) => void;
}

export default function SaleTypeSection({
  formData,
  handleInputChange,
  handleSelectChange,
}: SaleTypeSectionProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Sale Type</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="space-y-2">
          <Label>Sale Type *</Label>
          <Select
            value={formData.saleType}
            onValueChange={(value) => handleSelectChange("saleType", value)}>
            <SelectTrigger>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="affiliate">Affiliate</SelectItem>
              <SelectItem value="direct">Direct</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {formData.saleType === "affiliate" && (
          <>
            <div className="space-y-2">
              <Label htmlFor="affiliateProvider">Affiliate Provider *</Label>
              <Select
                value={formData.affiliateProvider}
                onValueChange={(value) =>
                  handleSelectChange("affiliateProvider", value)
                }>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="amazon">Amazon</SelectItem>
                  <SelectItem value="flipkart">Flipkart</SelectItem>
                  <SelectItem value="custom">Custom</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="affiliateLink">Affiliate Link *</Label>
              <Input
                id="affiliateLink"
                name="affiliateLink"
                type="url"
                value={formData.affiliateLink}
                onChange={handleInputChange}
                required
              />
            </div>
          </>
        )}

        {formData.saleType === "direct" && (
          <div className="space-y-2">
            <Label htmlFor="stock">Stock Quantity *</Label>
            <Input
              id="stock"
              name="stock"
              type="number"
              value={formData.stock}
              onChange={handleInputChange}
              required
            />
          </div>
        )}
      </CardContent>
    </Card>
  );
}

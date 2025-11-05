"use client";

import { useState, useEffect } from "react";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Users, Target, Filter } from "lucide-react";

interface AudienceSelectorProps {
  campaign: any;
  onChange: (campaign: any) => void;
}

export default function AudienceSelector({
  campaign,
  onChange,
}: AudienceSelectorProps) {
  const [estimatedReach, setEstimatedReach] = useState(0);

  // Mock subscriber data for demonstration
  const mockSubscribers = 1247;
  const interests = ["health", "skincare", "haircare", "pets", "parenting"];
  const preferences = [
    "offers",
    "newsletters",
    "productUpdates",
    "specialEvents",
  ];

  useEffect(() => {
    calculateEstimatedReach();
  }, [campaign.audience]);

  const calculateEstimatedReach = () => {
    let reach = mockSubscribers;

    if (campaign.audience.targetType === "segmented") {
      // Apply filters to estimate reach
      const filters = campaign.audience.filters;

      if (filters.interests?.length > 0) {
        reach = Math.floor(reach * 0.7); // Rough estimation
      }

      if (filters.preferences?.length > 0) {
        reach = Math.floor(reach * 0.8);
      }
    }

    setEstimatedReach(reach);
  };

  const handleAudienceChange = (field: string, value: any) => {
    onChange({
      ...campaign,
      audience: {
        ...campaign.audience,
        [field]: value,
      },
    });
  };

  const handleFilterChange = (filterType: string, value: string) => {
    const currentFilters = campaign.audience.filters[filterType] || [];
    const newFilters = currentFilters.includes(value)
      ? currentFilters.filter((item: string) => item !== value)
      : [...currentFilters, value];

    onChange({
      ...campaign,
      audience: {
        ...campaign.audience,
        filters: {
          ...campaign.audience.filters,
          [filterType]: newFilters,
        },
      },
    });
  };

  return (
    <div className="space-y-6">
      {/* Audience Overview */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Target className="w-5 h-5" />
            Audience Overview
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-between p-4 bg-slate-50 rounded-lg">
            <div>
              <p className="text-sm text-slate-600">Estimated Reach</p>
              <p className="text-3xl font-bold text-amber-600">
                {estimatedReach.toLocaleString()}
              </p>
              <p className="text-sm text-slate-500">subscribers</p>
            </div>
            <Users className="w-12 h-12 text-slate-400" />
          </div>
        </CardContent>
      </Card>

      {/* Audience Type Selection */}
      <div>
        <Label htmlFor="audienceType">Audience Type</Label>
        <Select
          value={campaign.audience.targetType}
          onValueChange={(value) => handleAudienceChange("targetType", value)}>
          <SelectTrigger className="mt-1">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Active Subscribers</SelectItem>
            <SelectItem value="segmented">Segmented Audience</SelectItem>
            <SelectItem value="custom">Custom Filter</SelectItem>
            <SelectItem value="test">Test Group (10 subscribers)</SelectItem>
          </SelectContent>
        </Select>
        <p className="text-sm text-slate-500 mt-1">
          Choose how to target your email campaign
        </p>
      </div>

      {/* Segmentation Options */}
      {campaign.audience.targetType === "segmented" && (
        <div className="space-y-6">
          <div className="border-t pt-6">
            <h3 className="text-lg font-semibold text-slate-900 mb-4 flex items-center gap-2">
              <Filter className="w-5 h-5" />
              Audience Filters
            </h3>

            {/* Interest-based Filtering */}
            <div className="space-y-4">
              <div>
                <Label>Interest Categories</Label>
                <p className="text-sm text-slate-500 mb-3">
                  Select categories that match your campaign content
                </p>
                <div className="flex flex-wrap gap-2">
                  {interests.map((interest) => {
                    const isSelected =
                      campaign.audience.filters.interests?.includes(interest);
                    return (
                      <Badge
                        key={interest}
                        variant={isSelected ? "default" : "outline"}
                        className={`cursor-pointer transition-colors ${
                          isSelected
                            ? "bg-amber-600 hover:bg-amber-700"
                            : "hover:bg-slate-100"
                        }`}
                        onClick={() =>
                          handleFilterChange("interests", interest)
                        }>
                        {interest}
                      </Badge>
                    );
                  })}
                </div>
              </div>

              {/* Preference-based Filtering */}
              <div>
                <Label>Email Preferences</Label>
                <p className="text-sm text-slate-500 mb-3">
                  Target users who opted in for specific content types
                </p>
                <div className="flex flex-wrap gap-2">
                  {preferences.map((preference) => {
                    const isSelected =
                      campaign.audience.filters.preferences?.includes(
                        preference
                      );
                    return (
                      <Badge
                        key={preference}
                        variant={isSelected ? "default" : "outline"}
                        className={`cursor-pointer transition-colors ${
                          isSelected
                            ? "bg-amber-600 hover:bg-amber-700"
                            : "hover:bg-slate-100"
                        }`}
                        onClick={() =>
                          handleFilterChange("preferences", preference)
                        }>
                        {preference}
                      </Badge>
                    );
                  })}
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Audience Tips */}
      <div className="bg-green-50 border border-green-200 rounded-lg p-4">
        <h4 className="font-medium text-green-900 mb-2">🎯 Targeting Tips</h4>
        <ul className="text-sm text-green-800 space-y-1">
          <li>
            • Start with broader audiences and narrow down based on performance
          </li>
          <li>
            • Test campaigns with small segments before sending to all
            subscribers
          </li>
          <li>• Use interest-based targeting for product-specific campaigns</li>
          <li>• Consider time zones when scheduling for different regions</li>
        </ul>
      </div>
    </div>
  );
}

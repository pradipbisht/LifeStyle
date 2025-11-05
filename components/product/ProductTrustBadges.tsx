import { Truck, Shield, Package } from "lucide-react";

export default function ProductTrustBadges() {
  return (
    <div className="grid grid-cols-3 gap-4 pt-6 border-t border-slate-200">
      <div className="text-center group">
        <div className="bg-amber-50 p-3 rounded-full w-fit mx-auto mb-2 group-hover:bg-amber-100 transition-colors">
          <Truck className="w-6 h-6 text-amber-600" />
        </div>
        <p className="text-sm font-medium text-slate-900">Free Shipping</p>
        <p className="text-xs text-slate-500">On orders over ₹500</p>
      </div>
      <div className="text-center group">
        <div className="bg-green-50 p-3 rounded-full w-fit mx-auto mb-2 group-hover:bg-green-100 transition-colors">
          <Shield className="w-6 h-6 text-green-600" />
        </div>
        <p className="text-sm font-medium text-slate-900">Secure Payment</p>
        <p className="text-xs text-slate-500">100% protected</p>
      </div>
      <div className="text-center group">
        <div className="bg-blue-50 p-3 rounded-full w-fit mx-auto mb-2 group-hover:bg-blue-100 transition-colors">
          <Package className="w-6 h-6 text-blue-600" />
        </div>
        <p className="text-sm font-medium text-slate-900">Easy Returns</p>
        <p className="text-xs text-slate-500">30-day policy</p>
      </div>
    </div>
  );
}

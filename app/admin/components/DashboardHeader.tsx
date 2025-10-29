import { Playfair_Display } from "next/font/google";

const playfair = Playfair_Display({
  subsets: ["latin"],
  weight: ["700"],
});

export default function DashboardHeader() {
  return (
    <div>
      <h1
        className={`${playfair.className} text-4xl font-bold text-gray-900 mb-2`}>
        Dashboard Overview
      </h1>
      <p className="text-gray-600">
        Welcome back! Here's what's happening with your platform.
      </p>
    </div>
  );
}

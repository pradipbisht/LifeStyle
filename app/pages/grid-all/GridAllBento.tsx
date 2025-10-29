// import React from "react";
// import Link from "next/link";
// import { Card } from "@/components/ui/card";
// import { GiWeightLiftingUp, GiBabyFace } from "react-icons/gi";
// import { FaHeart, FaScissors } from "react-icons/fa6";
// import { LuSparkles } from "react-icons/lu";
// import { PiPawPrintFill } from "react-icons/pi";

// function GridAllBento() {
//   const categories = [
//     {
//       name: "Health & Fitness",
//       icon: <GiWeightLiftingUp className="h-8 w-8 md:h-10 md:w-10" />,
//       description: "Fitness tips, diet plans & wellness guides",
//       href: "/health-lifestyle",
//       color: "from-green-500 to-emerald-700",
//     },
//     {
//       name: "Lifestyle",
//       icon: <FaHeart className="h-8 w-8 md:h-10 md:w-10" />,
//       description: "Self-improvement & daily habits",
//       href: "/health-lifestyle",
//       color: "from-purple-500 to-violet-700",
//     },
//     {
//       name: "Skincare",
//       icon: <LuSparkles className="h-8 w-8 md:h-10 md:w-10" />,
//       description: "Expert routines & product guides",
//       href: "/skincare",
//       color: "from-pink-500 to-rose-700",
//     },
//     {
//       name: "Haircare",
//       icon: <FaScissors className="h-8 w-8 md:h-10 md:w-10" />,
//       description: "Hair health tips & styling guides",
//       href: "/haircare",
//       color: "from-amber-500 to-orange-700",
//     },
//     {
//       name: "Pets",
//       icon: <PiPawPrintFill className="h-8 w-8 md:h-10 md:w-10" />,
//       description: "Pet care tips & expert advice",
//       href: "/pets",
//       color: "from-blue-500 to-indigo-700",
//     },
//     {
//       name: "Parenting",
//       icon: <GiBabyFace className="h-8 w-8 md:h-10 md:w-10" />,
//       description: "Newborn care & parenting guides",
//       href: "/parenting",
//       color: "from-teal-500 to-cyan-700",
//     },
//   ];
//   return (
//     <div>
//       <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 mt-8">
//         {categories.map((category) => (
//           <Link
//             href={category.href}
//             key={category.name}
//             aria-label={category.name}>
//             <Card className="group relative overflow-hidden hover:shadow-lg hover:translate-y-[-2px] transition-transform duration-200 border border-border/50 min-h-[150px] md:min-h-[180px]">
//               <div className="absolute inset-0 bg-gradient-to-r opacity-6 group-hover:opacity-20 transition-opacity duration-300" />
//               <div className="p-6 flex items-start gap-4">
//                 <div
//                   className={`p-4 rounded-2xl bg-gradient-to-br ${category.color} text-white shadow-lg flex items-center justify-center`}>
//                   {category.icon}
//                 </div>
//                 <div>
//                   <h3 className="font-semibold text-lg mb-1 group-hover:text-primary transition-colors">
//                     {category.name}
//                   </h3>
//                   <p className="text-muted-foreground text-sm">
//                     {category.description}
//                   </p>
//                 </div>
//               </div>
//             </Card>
//           </Link>
//         ))}
//       </div>
//     </div>
//   );
// }

// export default GridAllBento;

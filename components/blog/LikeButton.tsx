"use client";

import { useState, useEffect } from "react";
import { Heart } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/components/context/AuthContext";
import {
  collection,
  query,
  where,
  getDocs,
  addDoc,
  deleteDoc,
  doc,
  onSnapshot,
  serverTimestamp,
  updateDoc,
  increment,
} from "firebase/firestore";
import { db } from "@/firebase";

interface LikeButtonProps {
  blogId: string;
  initialLikes?: number;
  showCount?: boolean;
  size?: "sm" | "md" | "lg";
}

export default function LikeButton({
  blogId,
  initialLikes = 0,
  showCount = true,
  size = "md",
}: LikeButtonProps) {
  const { user } = useAuth();
  const [likes, setLikes] = useState(initialLikes);
  const [isLiked, setIsLiked] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [likeDocId, setLikeDocId] = useState<string | null>(null);

  // Real-time listener for like count
  useEffect(() => {
    const blogRef = doc(db, "blogs", blogId);
    const unsubscribe = onSnapshot(blogRef, (doc) => {
      if (doc.exists()) {
        setLikes(doc.data().likes || 0);
      }
    });

    return () => unsubscribe();
  }, [blogId]);

  // Check if current user has liked this blog
  useEffect(() => {
    if (!user) {
      // For anonymous users, check localStorage
      const likedBlogs = JSON.parse(localStorage.getItem("likedBlogs") || "[]");
      setIsLiked(likedBlogs.includes(blogId));
      setLikeDocId(null);
      return;
    }

    const checkUserLike = async () => {
      try {
        const likesRef = collection(db, "blogLikes");
        const q = query(
          likesRef,
          where("blogId", "==", blogId),
          where("userId", "==", user.uid)
        );
        const snapshot = await getDocs(q);

        if (!snapshot.empty) {
          setIsLiked(true);
          setLikeDocId(snapshot.docs[0].id);
        } else {
          setIsLiked(false);
          setLikeDocId(null);
        }
      } catch (error) {
        console.error("Error checking like status:", error);
      }
    };

    checkUserLike();
  }, [user, blogId]);

  const handleLike = async () => {
    setIsLoading(true);

    try {
      if (user) {
        // AUTHENTICATED USER - Use Firestore
        if (isLiked && likeDocId) {
          // Unlike: Remove like document and decrement counter
          await deleteDoc(doc(db, "blogLikes", likeDocId));
          await updateDoc(doc(db, "blogs", blogId), {
            likes: increment(-1),
          });
          setIsLiked(false);
          setLikeDocId(null);
        } else {
          // Like: Add like document and increment counter
          const likeData = {
            blogId,
            userId: user.uid,
            type: "like",
            createdAt: serverTimestamp(),
          };

          const docRef = await addDoc(collection(db, "blogLikes"), likeData);
          await updateDoc(doc(db, "blogs", blogId), {
            likes: increment(1),
          });
          setIsLiked(true);
          setLikeDocId(docRef.id);
        }
      } else {
        // ANONYMOUS USER - Use localStorage + Firestore counter only
        const likedBlogs = JSON.parse(
          localStorage.getItem("likedBlogs") || "[]"
        );

        if (isLiked) {
          // Unlike
          const updatedLikes = likedBlogs.filter((id: string) => id !== blogId);
          localStorage.setItem("likedBlogs", JSON.stringify(updatedLikes));
          await updateDoc(doc(db, "blogs", blogId), {
            likes: increment(-1),
          });
          setIsLiked(false);
        } else {
          // Like
          likedBlogs.push(blogId);
          localStorage.setItem("likedBlogs", JSON.stringify(likedBlogs));
          await updateDoc(doc(db, "blogs", blogId), {
            likes: increment(1),
          });
          setIsLiked(true);
        }
      }
    } catch (error) {
      console.error("Error toggling like:", error);
      alert("Failed to update like. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  const sizeClasses = {
    sm: "h-8 px-3 text-sm",
    md: "h-10 px-4",
    lg: "h-12 px-6 text-lg",
  };

  const iconSizes = {
    sm: 16,
    md: 20,
    lg: 24,
  };

  return (
    <Button
      onClick={handleLike}
      disabled={isLoading}
      variant={isLiked ? "default" : "outline"}
      className={`${sizeClasses[size]} gap-2 transition-all ${
        isLiked
          ? "bg-red-500 hover:bg-red-600 text-white"
          : "hover:bg-red-50 hover:text-red-500 hover:border-red-300"
      }`}>
      <Heart
        size={iconSizes[size]}
        className={`transition-all ${isLiked ? "fill-current" : ""}`}
      />
      {showCount && <span className="font-semibold">{likes}</span>}
    </Button>
  );
}

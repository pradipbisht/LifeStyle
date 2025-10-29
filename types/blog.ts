export interface Blog {
  id: string;
  title: string;
  content: string;
  excerpt: string;
  author: string;
  authorId: string;
  category: string;
  likes: number;
  dislikes: number;
  createdAt: any;
  updatedAt: any;
  isPublished: boolean; // Keep for backward compatibility
  status: "draft" | "pending" | "published"; // New status field
  coverImage?: string;
}

export interface BlogLike {
  id: string;
  blogId: string;
  userId: string;
  type: "like" | "dislike";
  createdAt: any;
}

export interface BlogComment {
  id: string;
  blogId: string;
  userId: string;
  userName: string;
  content: string;
  createdAt: any;
}

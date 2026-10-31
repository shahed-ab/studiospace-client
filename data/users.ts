import { User } from "@/types";

export const mockUsers: User[] = [
  {
    id: "usr_host_1",
    name: "Alex Vance",
    email: "host@studiospace.io",
    photoURL:
      "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=400&q=80",
    role: "user",
  },
  {
    id: "usr_creator_2",
    name: "Maya Lin",
    email: "creator@studiospace.io",
    photoURL:
      "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=400&q=80",
    role: "user",
  },
  {
    id: "usr_admin_3",
    name: "Elena Rostova",
    email: "admin@studiospace.io",
    photoURL:
      "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&w=400&q=80",
    role: "admin",
  },
];


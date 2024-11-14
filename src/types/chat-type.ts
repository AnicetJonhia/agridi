export interface User {
  id: number;
  username: string;
  profile_picture?: string;
}

export interface Group {
  id: number;
  name: string;
  members: number[];
  owner: number;
  photo?: string;
}

export interface Message {
  id: number;
  sender: User;
  receiver?: User;
  content?: string | null;
  timestamp: string;
  files?: { id: number; file: string }[];
  group?:Group
}

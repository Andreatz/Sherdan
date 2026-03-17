export type NotificationCategory = 'sessione' | 'missione' | 'lore' | 'generale';

export interface AppNotification {
  id: string;
  user_id: string;
  title: string;
  message: string;
  category: NotificationCategory;
  read: boolean;
  link?: string | null;
  created_at: string;
}

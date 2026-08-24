import React from 'react';
import { Bell, X, CheckCircle2, AlertCircle, Clock } from 'lucide-react';
import { Button } from './Button';

export interface NotificationItem {
  id: string;
  type: 'renewal' | 'rental_expiring' | 'payment_success' | 'alert';
  title: string;
  message: string;
  time: string;
  read: boolean;
}

export interface NotificationDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  notifications: NotificationItem[];
  onMarkAllAsRead?: () => void;
}

export const NotificationDrawer: React.FC<NotificationDrawerProps> = ({
  isOpen,
  onClose,
  notifications,
  onMarkAllAsRead,
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex justify-end bg-black/10 transition-opacity">
      <div className="w-full max-w-sm bg-white h-full border-l border-[#DCDDD8] flex flex-col shadow-none">
        {/* Header */}
        <div className="px-5 py-4 border-b border-[#EBEBE7] flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Bell className="w-4 h-4 text-[#0D3B85]" strokeWidth={1.75} />
            <h3 className="text-sm font-medium text-[#111111]">Notifications</h3>
          </div>
          <button
            onClick={onClose}
            className="text-[#6B6E68] hover:text-[#111111] p-1 rounded hover:bg-[#FAFAF9]"
            aria-label="Close notification drawer"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Content list */}
        <div className="flex-1 overflow-y-auto divide-y divide-[#EBEBE7]">
          {notifications.length === 0 ? (
            <div className="p-8 text-center text-xs text-[#6B6E68]">
              No active notifications
            </div>
          ) : (
            notifications.map((n) => (
              <div
                key={n.id}
                className={`p-4 transition-colors ${
                  n.read ? 'bg-white' : 'bg-[#FAFAF9]'
                }`}
              >
                <div className="flex items-start gap-2.5">
                  {n.type === 'renewal' && <Clock className="w-4 h-4 text-[#1B6FC9] shrink-0 mt-0.5" />}
                  {n.type === 'rental_expiring' && <AlertCircle className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />}
                  {n.type === 'payment_success' && <CheckCircle2 className="w-4 h-4 text-[#7CB342] shrink-0 mt-0.5" />}
                  {n.type === 'alert' && <AlertCircle className="w-4 h-4 text-red-600 shrink-0 mt-0.5" />}
                  
                  <div className="flex-1">
                    <p className="text-xs font-medium text-[#111111]">{n.title}</p>
                    <p className="text-xs text-[#6B6E68] mt-0.5 leading-relaxed">{n.message}</p>
                    <span className="text-[10px] text-[#6B6E68] mt-1 block">{n.time}</span>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>

        {/* Footer */}
        {notifications.length > 0 && onMarkAllAsRead ? (
          <div className="p-3 border-t border-[#EBEBE7] bg-[#FAFAF9]">
            <Button variant="ghost" size="sm" className="w-full text-xs" onClick={onMarkAllAsRead}>
              Mark all as read
            </Button>
          </div>
        ) : null}
      </div>
    </div>
  );
};

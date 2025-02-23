import { BellIcon } from '@heroicons/react/24/outline';
import Link from 'next/link';
import type { FC } from 'react';
import { useNotificationStore } from 'src/store/persisted/useNotificationStore';

const NotificationIcon: FC = () => {
  const latestNotificationId = useNotificationStore(
    (state) => state.latestNotificationId
  );
  const lastOpenedNotificationId = useNotificationStore(
    (state) => state.lastOpenedNotificationId
  );
  const setLastOpenedNotificationId = useNotificationStore(
    (state) => state.setLastOpenedNotificationId
  );

  return (
    <Link
      href="/notifications"
      className="outline-brand-500 hidden items-start justify-center rounded-md px-2 py-1 hover:bg-gray-300/20 md:flex"
      onClick={() => {
        if (latestNotificationId) {
          setLastOpenedNotificationId(latestNotificationId);
        }
      }}
    >
      <BellIcon className="h-5 w-5 sm:h-6 sm:w-6" />
      {lastOpenedNotificationId !== latestNotificationId ? (
        <span className="h-2 w-2 rounded-full bg-red-500" />
      ) : null}
    </Link>
  );
};

export default NotificationIcon;

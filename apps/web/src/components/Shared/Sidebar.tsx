import cn from '@hey/ui/cn';
import Link from 'next/link';
import { useRouter } from 'next/router';
import { type FC, type ReactNode } from 'react';

interface MenuProps {
  children: ReactNode;
  current: boolean;
  url: string;
}

const Menu: FC<MenuProps> = ({ children, current, url }) => (
  <Link
    href={url}
    className={cn(
      { 'bg-brand-100 dark:bg-brand-300/20 text-brand-500 font-bold': current },
      'hover:bg-brand-100/80 hover:text-brand-400 dark:hover:bg-brand-300/30',
      'flex items-center space-x-2 rounded-lg px-3 py-2'
    )}
  >
    {children}
  </Link>
);

interface SidebarProps {
  items: {
    title: ReactNode;
    icon: ReactNode;
    url: string;
    active?: boolean;
    enabled?: boolean;
  }[];
}

const Sidebar: FC<SidebarProps> = ({ items }) => {
  const { pathname } = useRouter();
  const menuItems = items.map((item) => ({
    ...item,
    enabled: item.enabled || true
  }));

  return (
    <div className="mb-4 space-y-2 px-3 sm:px-0">
      {menuItems.map((item: any) =>
        item?.enabled ? (
          <Menu
            key={item.title}
            current={pathname === item.url || item.active}
            url={item.url}
          >
            {item.icon}
            <div>{item.title}</div>
          </Menu>
        ) : null
      )}
    </div>
  );
};

export default Sidebar;

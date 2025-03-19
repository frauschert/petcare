'use client';

import { useTranslations } from 'next-intl';
import { useRouter, usePathname } from 'next/navigation';

export default function Navbar() {
  const t = useTranslations('Navbar');
  const router = useRouter();
  const pathname = usePathname();

  const isActive = (path: string) => pathname === path;

  return (
    <nav className="fixed left-0 top-0 h-full w-64 bg-surface-tonal-a10 text-foreground p-6 shadow-xl">
      <div className="mb-8 flex items-center space-x-3">
        <svg
          xmlns="http://www.w3.org/2000/svg"
          className="h-8 w-8 text-primary-a30"
          viewBox="0 0 20 20"
          fill="currentColor"
        >
          <path
            fillRule="evenodd"
            d="M6.672 1.911a1 1 0 10-1.932.518l.259.966a1 1 0 001.932-.518l-.26-.966zM2.429 4.74a1 1 0 10-.517 1.932l.966.259a1 1 0 00.517-1.932l-.966-.26zm8.814-.569a1 1 0 00-1.415-1.414l-.707.707a1 1 0 101.415 1.415l.707-.708zm-7.071 7.072l.707-.707A1 1 0 003.465 9.12l-.708.707a1 1 0 001.415 1.415zm3.2-5.171a1 1 0 00-1.3 1.3l4 10a1 1 0 001.823.075l1.38-2.759 3.018 3.02a1 1 0 001.414-1.415l-3.019-3.02 2.76-1.379a1 1 0 00-.076-1.822l-10-4z"
            clipRule="evenodd"
          />
        </svg>
        <h1 className="text-2xl font-bold text-foreground">Pet Care</h1>
      </div>

      <div className="space-y-2">
        <button
          onClick={() => router.push('/')}
          className={`w-full flex items-center space-x-3 text-left px-4 py-3 rounded-lg transition-colors text-foreground ${
            isActive('/') ? 'bg-primary-a10' : 'hover:bg-primary-a20'
          }`}
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-5 w-5"
            viewBox="0 0 20 20"
            fill="currentColor"
          >
            <path d="M10.707 2.293a1 1 0 00-1.414 0l-7 7a1 1 0 001.414 1.414L4 10.414V17a1 1 0 001 1h2a1 1 0 001-1v-2a1 1 0 011-1h2a1 1 0 011 1v2a1 1 0 001 1h2a1 1 0 001-1v-6.586l.293.293a1 1 0 001.414-1.414l-7-7z" />
          </svg>
          <span>Dashboard</span>
        </button>

        <div className="pt-4 mt-4 border-t border-primary-a20">
          <h2 className="px-4 text-sm font-medium text-primary-a20 uppercase tracking-wider">
            Quick Actions
          </h2>
          <div className="mt-3 space-y-2">
            <button
              onClick={() => router.push('/add-pet')}
              className={`w-full flex items-center space-x-3 text-left px-4 py-2 rounded-lg text-foreground transition-colors ${
                isActive('/add-pet') ? 'bg-primary-a10' : 'hover:bg-primary-a20'
              }`}
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-5 w-5"
                viewBox="0 0 20 20"
                fill="currentColor"
              >
                <path
                  fillRule="evenodd"
                  d="M10 3a1 1 0 011 1v5h5a1 1 0 110 2h-5v5a1 1 0 11-2 0v-5H4a1 1 0 110-2h5V4a1 1 0 011-1z"
                  clipRule="evenodd"
                />
              </svg>
              <span>{t('AddNewPet')}</span>
            </button>
          </div>
        </div>
      </div>

      <div className="absolute bottom-0 left-0 w-full p-6 bg-surface-tonal-a20">
        <div className="text-sm text-primary-a20">
          <div className="flex items-center space-x-2">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-5 w-5"
              viewBox="0 0 20 20"
              fill="currentColor"
            >
              <path
                fillRule="evenodd"
                d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z"
                clipRule="evenodd"
              />
            </svg>
            <span>Pet Care Manager</span>
          </div>
          <p className="mt-1 text-primary-a20">Version 1.0.0</p>
        </div>
      </div>
    </nav>
  );
}

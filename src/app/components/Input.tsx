import { twMerge } from 'tailwind-merge';

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  error?: string;
}

export function Input({ error, className, ...props }: InputProps) {
  return (
    <>
      <input
        {...props}
        className={twMerge(
          `bg-surface-tonal-a10 p-1 mt-1 block w-full rounded-md shadow-sm focus:border-surface-tonal-a20 focus:ring-emerald-500 sm:text-sm ${error ? 'border-red-500' : ''}`,
          className
        )}
      />
      {error && <p className="mt-2 text-sm text-red-600">{error}</p>}
    </>
  );
}

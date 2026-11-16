import { ChevronRight } from 'lucide-react';
import { useStore } from '../context/StoreContext';

export interface BreadcrumbItem {
  label: string;
  path?: string;
}

export function Breadcrumbs({ items }: { items: BreadcrumbItem[] }) {
  const { navigate } = useStore();

  return (
    <nav aria-label="Breadcrumb" className="text-xs text-slate-500">
      <ol className="flex flex-wrap items-center gap-1.5">
        <li>
          <a
            href="/"
            onClick={(e) => {
              e.preventDefault();
              navigate('/');
            }}
            className="hover:text-[#DC2626] transition-colors"
          >
            Home
          </a>
        </li>
        {items.map((item, index) => {
          const isLast = index === items.length - 1;
          return (
            <li key={`${item.label}-${index}`} className="flex items-center gap-1.5">
              <ChevronRight className="w-3.5 h-3.5 text-slate-400" aria-hidden="true" />
              {item.path && !isLast ? (
                <a
                  href={item.path}
                  onClick={(e) => {
                    e.preventDefault();
                    navigate(item.path!);
                  }}
                  className="hover:text-[#DC2626] transition-colors"
                >
                  {item.label}
                </a>
              ) : (
                <span className="text-[#121A25] font-medium" aria-current="page">
                  {item.label}
                </span>
              )}
            </li>
          );
        })}
      </ol>
    </nav>
  );
}

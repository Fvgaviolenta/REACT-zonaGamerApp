// Skeleton simple para mejorar la UX mientras carga
export default function LoadingSkeleton() {
    return (
        <div className="animate-pulse rounded-lg border border-neutral-200 p-2 space-y-2">
            <div className="bg-neutral-200 h-32 w-full rounded" />
            <div className="bg-neutral-200 h-4 w-3/4 rounded" />
            <div className="bg-neutral-200 h-3 w-1/2 rounded" />
            <div className="bg-neutral-200 h-4 w-1/3 rounded" />
        </div>
    );
}
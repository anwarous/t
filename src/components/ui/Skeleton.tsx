import { cn } from '@/lib/utils'

interface SkeletonProps {
  className?: string
  width?: string | number
  height?: string | number
  rounded?: string
}

export function Skeleton({ className, width, height, rounded = 'rounded-lg' }: SkeletonProps) {
  return (
    <div
      className={cn(
        'bg-surface-800 animate-pulse',
        rounded,
        className
      )}
      style={{ width, height }}
    />
  )
}

export function DashboardSkeleton() {
  return (
    <div className="min-h-screen px-4 py-8">
      <div className="max-w-7xl mx-auto">
        <Skeleton className="w-48 h-8 mb-2" />
        <Skeleton className="w-72 h-5 mb-8" />
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          {[...Array(4)].map((_, i) => (
            <div key={i} className="p-5 rounded-2xl glass border border-white/8">
              <Skeleton className="w-10 h-10 rounded-xl mb-3" />
              <Skeleton className="w-24 h-7 mb-2" />
              <Skeleton className="w-20 h-4" />
            </div>
          ))}
        </div>
        <div className="grid lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2 space-y-4">
            {[...Array(3)].map((_, i) => (
              <div key={i} className="p-5 rounded-2xl glass border border-white/8">
                <div className="flex gap-4 mb-4">
                  <Skeleton className="w-11 h-11 rounded-xl" />
                  <div className="flex-1">
                    <Skeleton className="w-36 h-5 mb-2" />
                    <Skeleton className="w-24 h-4" />
                  </div>
                </div>
                <Skeleton className="w-full h-1.5 rounded-full" />
              </div>
            ))}
          </div>
          <div className="space-y-4">
            {[...Array(2)].map((_, i) => (
              <div key={i} className="p-5 rounded-2xl glass border border-white/8">
                <Skeleton className="w-32 h-5 mb-4" />
                <div className="space-y-3">
                  {[...Array(4)].map((_, j) => (
                    <Skeleton key={j} className="w-full h-8 rounded-xl" />
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}

export function CourseSkeleton() {
  return (
    <div className="p-6 rounded-2xl glass border border-white/8">
      <div className="flex gap-4 mb-4">
        <Skeleton className="w-12 h-12 rounded-xl" />
        <div>
          <Skeleton className="w-40 h-6 mb-2" />
          <Skeleton className="w-24 h-4" />
        </div>
      </div>
      <Skeleton className="w-full h-12 rounded-lg mb-4" />
      <div className="flex gap-2 mb-4">
        {[...Array(3)].map((_, i) => (
          <Skeleton key={i} className="w-16 h-6 rounded-full" />
        ))}
      </div>
      <Skeleton className="w-full h-1.5 rounded-full" />
    </div>
  )
}

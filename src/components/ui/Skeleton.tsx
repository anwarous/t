import { cn } from '@/lib/utils'

interface SkeletonProps {
  className?: string
  width?: string | number
  height?: string | number
  rounded?: string
}

export function Skeleton({ className, width, height, rounded = 'rounded' }: SkeletonProps) {
  return (
    <div
      className={cn('shimmer', rounded, className)}
      style={{ width, height, background: 'rgba(255,255,255,0.04)', minHeight: height ?? '1rem' }}
      aria-hidden="true"
    />
  )
}

export function DashboardSkeleton() {
  return (
    <div className="min-h-screen px-6 py-8">
      <div className="max-w-7xl mx-auto">
        <Skeleton className="w-48 h-7 mb-2 rounded" />
        <Skeleton className="w-72 h-4 mb-10 rounded" />
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          {[...Array(4)].map((_, i) => (
            <div
              key={i}
              className="p-5 rounded-lg"
              style={{ background: 'rgba(255,255,255,0.025)', border: '1px solid rgba(255,255,255,0.06)' }}
            >
              <Skeleton className="w-9 h-9 rounded mb-3" />
              <Skeleton className="w-24 h-6 mb-2 rounded" />
              <Skeleton className="w-20 h-3 rounded" />
            </div>
          ))}
        </div>
        <div className="grid lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2 space-y-4">
            {[...Array(3)].map((_, i) => (
              <div
                key={i}
                className="p-5 rounded-lg"
                style={{ background: 'rgba(255,255,255,0.025)', border: '1px solid rgba(255,255,255,0.06)' }}
              >
                <div className="flex gap-4 mb-4">
                  <Skeleton className="w-10 h-10 rounded" />
                  <div className="flex-1">
                    <Skeleton className="w-36 h-4 mb-2 rounded" />
                    <Skeleton className="w-24 h-3 rounded" />
                  </div>
                </div>
                <Skeleton className="w-full h-1.5 rounded-full" />
              </div>
            ))}
          </div>
          <div className="space-y-4">
            {[...Array(2)].map((_, i) => (
              <div
                key={i}
                className="p-5 rounded-lg"
                style={{ background: 'rgba(255,255,255,0.025)', border: '1px solid rgba(255,255,255,0.06)' }}
              >
                <Skeleton className="w-28 h-4 mb-4 rounded" />
                <div className="space-y-2.5">
                  {[...Array(4)].map((_, j) => (
                    <Skeleton key={j} className="w-full h-8 rounded" />
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
    <div
      className="p-6 rounded-lg"
      style={{ background: 'rgba(255,255,255,0.025)', border: '1px solid rgba(255,255,255,0.06)' }}
    >
      <div className="flex gap-4 mb-4">
        <Skeleton className="w-11 h-11 rounded" />
        <div>
          <Skeleton className="w-40 h-5 mb-2 rounded" />
          <Skeleton className="w-24 h-3 rounded" />
        </div>
      </div>
      <Skeleton className="w-full h-10 rounded mb-4" />
      <div className="flex gap-2 mb-4">
        {[...Array(3)].map((_, i) => (
          <Skeleton key={i} className="w-14 h-5 rounded-full" />
        ))}
      </div>
      <Skeleton className="w-full h-1.5 rounded-full" />
    </div>
  )
}

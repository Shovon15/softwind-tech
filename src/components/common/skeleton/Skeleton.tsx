import { cn } from "@/utils/helpers/cn";

type SkeletonProps = {
  className?: string;
};

/**
 * Base skeleton block with a "beating" (heartbeat) pulse animation.
 * Compose several of these to mock out a real layout while content loads.
 */
export const Skeleton = ({ className }: SkeletonProps) => {
  return (
    <div
      aria-hidden="true"
      className={cn("animate-beat rounded-md bg-[#E5E5E5]", className)}
    />
  );
};

/**
 * Placeholder shaped like a Book-Now step (heading + fields + content + actions).
 * Shown briefly while a step transitions in.
 */
export const StepSkeleton = () => {
  return (
    <div className="space-y-6" role="status" aria-label="Loading step">
      <Skeleton className="h-8 w-1/2" />

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <Skeleton className="h-14 w-full" />
        <Skeleton className="h-14 w-full" />
        <Skeleton className="h-14 w-full" />
        <Skeleton className="h-14 w-full" />
      </div>

      <Skeleton className="h-40 w-full" />

      <div className="flex gap-4 justify-around">
        <Skeleton className="h-12 w-32" />
        <Skeleton className="h-12 w-32" />
      </div>
    </div>
  );
};

export default Skeleton;

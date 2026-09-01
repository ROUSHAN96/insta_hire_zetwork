import { Skeleton } from '@/components/ui/skeleton';
import { Separator } from '@/components/ui/separator';

export default function ProductLoading() {
  return (
    <div className="container mx-auto px-4 py-8">
      <Skeleton className="h-10 w-32 mb-6" />

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 lg:gap-12">
        <Skeleton className="aspect-square w-full rounded-lg" />

        <div className="flex flex-col space-y-4">
          <div className="flex items-center space-x-2">
            <Skeleton className="h-6 w-20" />
            <Skeleton className="h-4 w-24" />
          </div>
          
          <Skeleton className="h-10 sm:h-12 w-3/4" />
          <Skeleton className="h-8 w-1/3 mb-4" />
          
          <div className="space-y-2 mb-4">
            <Skeleton className="h-4 w-full" />
            <Skeleton className="h-4 w-full" />
            <Skeleton className="h-4 w-4/5" />
            <Skeleton className="h-4 w-5/6" />
          </div>

          <Skeleton className="h-5 w-24 mb-4" />

          <Separator className="my-2" />

          <Skeleton className="h-12 w-full sm:w-48 mt-4" />
        </div>
      </div>
    </div>
  );
}

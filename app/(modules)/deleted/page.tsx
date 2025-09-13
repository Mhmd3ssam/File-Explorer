import { AnimatedEmptyState } from '@/components/shared/AnimatedEmptyState';

export default function DeletedPage() {
  return (
    <div className="w-full">
      <AnimatedEmptyState
        type="deleted"
        title="No deleted files yet"
        description="Files you delete will appear here. You can restore them or permanently remove them."
      />
    </div>
  );
}

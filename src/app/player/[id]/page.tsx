import PlayerProfilePage from '@/app/roster/[id]/page';

export const revalidate = 10; // ISR cache with automatic edge revalidation

export default PlayerProfilePage;

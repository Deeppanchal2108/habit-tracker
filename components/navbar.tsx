
import { cookies } from 'next/headers';
import { getUserIdFromToken } from '@/lib/token';
import NavClient from './navclient';
export default async function Nav() {
    const cookieStore = await cookies();
    const token = cookieStore.get("token")?.value;

    const userId = token ? await getUserIdFromToken(token) : null;
    const isLoggedIn = !!userId;
    return <NavClient isLoggedIn={isLoggedIn} userId={userId} />;
}
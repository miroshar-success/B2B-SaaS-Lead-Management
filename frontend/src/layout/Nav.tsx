// pages/index.js
import Link from 'next/link';

const NavBar = () => {
  return (
    <div className='flex right-0 py-2 px-4 border-b-2 w-full items-end justify-end'>
        <div className='flex gap-8'>
            <Link href="/">
                <button>Login / Register</button>
            </Link>
            <Link href="/admin">
                <button>Admin</button>
            </Link>
        </div>
    </div>
  );
};

export default NavBar;
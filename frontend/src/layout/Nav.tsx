// pages/index.js
import Link from 'next/link';

const NavBar = () => {
  return (
    <div className='flex right-0 fixed z-10 bg-white py-2 pr-10 border-b-2 border-violet-200 w-full items-end justify-end text-violet-800'>
        <div className='flex gap-8'>
            <Link href="/" className=' hover:scale-110'>
                <button>Login / Register</button>
            </Link>
            <Link href="/admin" className=' hover:scale-110'>
                <button>Admin</button>
            </Link>
        </div>
    </div>
  );
};

export default NavBar;
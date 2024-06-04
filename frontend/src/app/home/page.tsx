// pages/index.js
import Link from 'next/link';

const HomePage = () => {
  return (
    <div>
      <h1>Welcome to the B2B SaaS Lead Management Platform</h1>
      <p>Manage and enrich your leads with reliable data.</p>
      <Link href="/">
        <button>Login / Register</button>
      </Link>
    </div>
  );
};

export default HomePage;
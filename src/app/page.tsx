'use client';
import Memory from './components/Memory';
import Navbar from './components/Navbar';
import ParticlesComponent from './config/particles-config';

export default function Home() {
  return (
    <>
    <main style={{ position: 'relative', width: '100%', height: '100vh' }}>
      <Navbar />
      <ParticlesComponent />
      <Memory />
      <div className="z-10 relative text-white text-center text-[12px] p-2 ">
        Designed and built by <a href='https://github.com/Shah1011' target='_blank' className='hover:text-primary1'>Shah</a> - 2024
      </div>
    </main>
    </>
  );
}

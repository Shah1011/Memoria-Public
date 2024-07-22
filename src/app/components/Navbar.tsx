'use client';
import { signOut, useSession } from "next-auth/react";
import { redirect } from "next/navigation";

export default function Navbar() {
  
  const { data: session } = useSession({
    required: true,
    onUnauthenticated: () => {
      redirect('/auth/signin');
    }
  });

  const placeholderProfileImage = "https://i.ibb.co/CQsxv4r/placeholder-profile.png";
  const profileImage = session?.user?.image || placeholderProfileImage;
  console.log("session", session);
  return (
    <nav className="z-10 relative">
      <div className="flex justify-between items-center p-5 text-white">
        <div className="flex items-center gap-4">
          <img
            src={profileImage}
            alt="profile_image"
            className="w-10 h-10 rounded-full"
          />
          <h1>{session?.user?.name}</h1>
        </div>
        <button
          className="flex items-center bg-primary1 p-2 rounded-md hover:bg-violet-800"
          onClick={() => signOut()}
        >
          Logout
        </button>
      </div>
    </nav>
  );
}
'use client';

import { useState } from 'react';

export default function IGProfileViewer() {
  const [username, setUsername] = useState('');
  const [imagePath, setImagePath] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    const apiUrl = `/api/proxy?username=${username}`;
  
    try {
      const res = await fetch(apiUrl);
  
      if (res.ok) {
        const data = await res.json();
        const savedImagePath = data?.imagePath; // Local path
        const hdProfilePic = data?.hdProfilePic; // External URL
  
        console.log('External HD URL:', hdProfilePic);
  
        if (hdProfilePic) {
          // Use either the external URL or local saved path
          setImagePath(savedImagePath); // Use external URL
          setError('');
        } else {
          setImagePath('');
          setError('Profile picture not found!');
        }
      } else {
        setImagePath('');
        setError('User not found!');
      }
    } catch (err) {
      console.error('Error:', err);
      setImagePath('');
      setError('An error occurred while fetching the profile picture.');
    }
  };
  

  return (
    <div className="min-h-screen bg-[#5183d8] flex flex-col items-center justify-center p-4">
      <h1 className="text-2xl font-bold mb-4">Instagram Profile Picture Viewer</h1>
      <form onSubmit={handleSubmit} className="flex flex-col items-center">
        <input
          type="text"
          placeholder="Enter Instagram username"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          className="p-2 border border-gray-300 rounded mb-2 w-64"
        />
        <button
          type="submit"
          className="bg-red-300 text-white px-4 py-2 font-bold rounded hover:bg-red-600"
        >
          Search
        </button>
      </form>
      {error && <p className="text-red-500 mt-4">{error}</p>}
      {imagePath && (
        <div className="mt-6">
          <img
            src={imagePath}
            alt={`${username}'s Profile Picture`}
            width="300"
            className="border-[15px] border-[#9aa1c8] rounded-[40px] mb-[800px]"
          />
        </div>
      )}
    </div>
  );
}

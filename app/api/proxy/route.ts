import fs from 'fs/promises';
import path from 'path';

// pages/api/proxy.js
export async function GET(req) {
  const { searchParams } = new URL(req.url);
  const username = searchParams.get('username');
  const apiUrl = `https://anonyig.com/api/ig/userInfoByUsername/${username}`;

  try {
    const response = await fetch(apiUrl);
    const data = await response.json();
    const hdProfilePic = data?.result?.user?.hd_profile_pic_url_info?.url;

    if (hdProfilePic) {
      // Fetch the image from the URL
      const imageResponse = await fetch(hdProfilePic);
      const imageBuffer = await imageResponse.arrayBuffer();

      // Define path to save the image in the public/images folder
      const imageName = `${username}.jpg`;
      const imagePath = path.join(process.cwd(), 'public', 'images', imageName);

      // Save the image to the public folder asynchronously
      await fs.writeFile(imagePath, Buffer.from(imageBuffer));

      // Return success and the path to the saved image
      return new Response(JSON.stringify({ imagePath: `/images/${imageName}`, hdProfilePic, }), {
        status: 200,
        headers: { 'Content-Type': 'application/json' },
      });
    }

    return new Response(
      JSON.stringify({ error: 'Profile picture not found!' }),
      { status: 404, headers: { 'Content-Type': 'application/json' } }
    );
  } catch (error) {
    console.error('Error fetching or saving the image:', error);
    return new Response(
      JSON.stringify({ error: 'An error occurred while processing the request.' }),
      { status: 500, headers: { 'Content-Type': 'application/json' } }
    );
  }
}
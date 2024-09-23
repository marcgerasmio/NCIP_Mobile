import React, { useState } from 'react';

const Bucket = () => {
  const [file, setFile] = useState(null);
  const [uploading, setUploading] = useState(false);
  const [message, setMessage] = useState('');
  const [imageUrl, setImageUrl] = useState('');  // State to hold the image URL
  
  const bucketName = 'Profile';
  const supabaseUrl = 'https://zhwtnngjyjrbjfxdfrin.supabase.co';  // Replace with your Supabase project URL
  const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Inpod3RubmdqeWpyYmpmeGRmcmluIiwicm9sZSI6ImFub24iLCJpYXQiOjE3MjY2MjUzOTAsImV4cCI6MjA0MjIwMTM5MH0.ltxHtpq1f9sJ-wZwrSGKXfZbxn9TW6u-1QBBuOtMjBk';  // Replace with your Supabase anon key

  const uploadImageToSupabase = async () => {
    if (!file) {
      setMessage('Please select a file first.');
      return;
    }
    
    const fileName = `${Date.now()}-${file.name}`;  
    const filePath = `${fileName}`;
    const url = `${supabaseUrl}/storage/v1/object/${bucketName}/${filePath}`;

    setUploading(true);

    try {
      const response = await fetch(url, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${supabaseAnonKey}`,
          'Content-Type': file.type,  
        },
        body: file,  
      });

      if (response.ok) {
        const publicUrl = `${supabaseUrl}/storage/v1/object/public/${bucketName}/${filePath}`;
        setImageUrl(publicUrl);  
        setMessage('File uploaded successfully.');
      } else {
        const error = await response.json();
        setMessage(`Upload failed: ${error.message}`);
      }
    } catch (error) {
      setMessage(`Error: ${error.message}`);
    } finally {
      setUploading(false);
    }
  };

  const handleFileChange = (e) => {
    setFile(e.target.files[0]);
    setMessage(''); 
  };

  return (
    <div className="image-upload">
      <h2>Upload an Image</h2>
      <input 
        type="file" 
        accept="image/*" 
        onChange={handleFileChange} 
        disabled={uploading}
      />
      <button onClick={uploadImageToSupabase} disabled={uploading || !file}>
        {uploading ? 'Uploading...' : 'Upload'}
      </button>
      {message && <p>{message}</p>}
      
      {imageUrl && (
        <div>
          <h3>Uploaded Image:</h3>
          <img src={imageUrl} alt="Uploaded" style={{ width: '200px', height: 'auto' }} />
          <p>Image URL: <a href={imageUrl} target="_blank" rel="noopener noreferrer">{imageUrl}</a></p>
        </div>
      )}
    </div>
  );
};

export default Bucket;

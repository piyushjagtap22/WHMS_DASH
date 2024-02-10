import React, { useEffect, useState } from 'react';
import axios from 'axios';

const ImageTesting = () => {
  console.log('image testing');
  const [imageUrl, setImageUrl] = useState('');

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.post(
          'https://whms-isro-sxur.vercel.app/api/superadmin/getDocById',
          {
            _id: '3rZHRorWjVOFShwBSf1Zi8N7hpC3',
          }
        );

        const base64Image = response.data.base64Image;
        const imageUrl = `data:image/png;base64,${base64Image}`;
        setImageUrl(imageUrl);
      } catch (error) {
        console.error('Error fetching image:', error);
      }
    };

    fetchData();
  }, []);

  return (
    <div>
      <h2>Image Testing</h2>
      {imageUrl ? (
        <img src={imageUrl} alt='User Document' />
      ) : (
        <p>Loading image...</p>
      )}
    </div>
  );
};

export default ImageTesting;

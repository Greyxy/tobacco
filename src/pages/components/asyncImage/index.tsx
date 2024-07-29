import React, { useState, useEffect } from 'react';
import { Image } from 'antd';

interface AsyncImageProps {
  src: string;
  width?: number;
  height?: number;
}

const AsyncImage: React.FC<AsyncImageProps> = ({ src, width = 50, height = 50 }) => {
  const [loadedSrc, setLoadedSrc] = useState<string | null>(null);

  useEffect(() => {
    const loadImage = async () => {
      // 模拟异步加载图片
      await new Promise(resolve => setTimeout(resolve, 1000));
      setLoadedSrc(src);
    };

    loadImage();
  }, [src]);

  if (!loadedSrc) {
    return <span>Loading...</span>;
  }

  if (Array.isArray(loadedSrc)) {
    return (
      <Image.PreviewGroup>
        {loadedSrc.map((url, index) => (
          <Image key={index} src={url} width={width} height={height} />
        ))}
      </Image.PreviewGroup>
    );
  } else {
    return <Image src={loadedSrc} width={width} height={height} />;
  }
};

export default AsyncImage;

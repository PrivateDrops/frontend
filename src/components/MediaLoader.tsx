import { AspectRatio, Image, Skeleton } from '@chakra-ui/react';
import { useState } from 'react';

export const MediaLoader = ({
  media,
  maxW,
  ratio,
}: {
  media: any;
  maxW: string;
  ratio: number;
}) => {
  const [loading, setLoading] = useState<boolean>(false);

  return (
    <AspectRatio maxW={maxW} ratio={ratio}>
      <Skeleton isLoaded={!loading} borderRadius="md">
        {media.mime.includes('image') ? (
          <Image
            src={media.url}
            alt="Dynamic Image"
            objectFit="cover"
            width="100%"
            height="100%"
            borderRadius="md"
            onLoad={() => setLoading(false)}
          />
        ) : (
          <iframe
            title="media"
            src={media.url}
            onLoad={() => setLoading(false)}
            allowFullScreen
          />
        )}
      </Skeleton>
    </AspectRatio>
  );
};

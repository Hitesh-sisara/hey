import { STATIC_IMAGES_URL } from '@hey/data/constants';
import type {
  DetailedHTMLProps,
  ImgHTMLAttributes,
  Ref,
  SyntheticEvent
} from 'react';
import { forwardRef, useCallback, useEffect, useState } from 'react';

export const Image = forwardRef(function Image(
  {
    onError,
    lowQualitySrc,
    ...props
  }: DetailedHTMLProps<
    ImgHTMLAttributes<HTMLImageElement>,
    HTMLImageElement
  > & {
    lowQualitySrc: string;
  },
  ref: Ref<HTMLImageElement>
) {
  const [src, setSrc] = useState(lowQualitySrc);
  const [isLoaded, setIsLoaded] = useState(false);
  const [imageLoadFailed, setImageLoadFailed] = useState(false);
  const placeHolderImage = `${STATIC_IMAGES_URL}/placeholder.webp`;

  const handleLoad = useCallback(() => {
    setIsLoaded(true);
    setSrc(props.src || placeHolderImage);
  }, [props.src]);

  const handleError = useCallback(
    (e: SyntheticEvent<HTMLImageElement, Event>) => {
      if (imageLoadFailed) {
        return;
      }
      setImageLoadFailed(true);
      if (onError) {
        onError(e);
      }
    },
    [imageLoadFailed, setImageLoadFailed, onError]
  );

  useEffect(() => {
    const GlobalImage = window.Image;
    const img = new GlobalImage();
    img.src = props.src || placeHolderImage;
    img.onload = handleLoad;
    return () => {
      img.onload = null;
    };
  }, [props.src, handleLoad]);

  return (
    <img
      {...props}
      src={imageLoadFailed ? `${STATIC_IMAGES_URL}/placeholder.webp` : src}
      style={{
        filter: isLoaded ? 'none' : 'blur(20px)',
        transition: isLoaded ? 'filter 0.5s ease-out' : 'none'
      }}
      onError={handleError}
      alt={props.alt || ''}
      ref={ref}
    />
  );
});

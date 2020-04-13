/**
 * @license
 * MIT License
 *
 * Copyright (c) 2020 Alexis Munsayac
 * Permission is hereby granted, free of charge, to any person obtaining a copy
 * of this software and associated documentation files (the "Software"), to deal
 * in the Software without restriction, including without limitation the rights
 * to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
 * copies of the Software, and to permit persons to whom the Software is
 * furnished to do so, subject to the following conditions:
 *
 * The above copyright notice and this permission notice shall be included in all
 * copies or substantial portions of the Software.
 *
 * THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
 * IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
 * FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
 * AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
 * LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
 * OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
 * SOFTWARE.
 *
 *
 * @author Alexis Munsayac <alexis.munsayac@gmail.com>
 * @copyright Alexis Munsayac 2020
 */
import React, { Suspense } from 'react';
import PropTypes from 'prop-types';
import { useIsomorphicEffect, useIntersectionObserver, useConstantCallback } from './utils/hooks';
import matchMedia, { matchesNothing, matchesQuery } from './utils/match-media';
import SuspendedImage, { CustomImageProps } from './SuspendedImage';

interface Source {
  source?: string | null;
  media: string;
}

export interface ImgProps extends CustomImageProps {
  containerRef: React.MutableRefObject<HTMLElement | null | undefined>;
  sources?: Source[];
  fallback: React.ReactNode;
  src?: string | null;
  alt: string;
}

const Img = React.forwardRef<HTMLImageElement, ImgProps>((
  {
    containerRef, sources, src, fallback, ...props
  },
  ref,
) => {
  /**
   * State for handling image source
   */
  const [imageSource, setImageSource] = React.useState(src);
  /**
   * State for handling image visibility
   */
  const [visible, setVisibility] = React.useState(false);

  /**
   * When the container hits the viewport,
   * make sure that the image becomes visible.
   */
  const onObserve = useConstantCallback(() => {
    setVisibility(true);
    return true;
  });

  useIntersectionObserver(containerRef, onObserve);

  /**
   * If the image is visible, start watching the media
   */
  useIsomorphicEffect(() => {
    if (visible && sources) {
      const callbacks: (() => void)[] = [];

      const medias = sources.map(({ media }) => media);

      sources.forEach(({ source, media }) => {
        callbacks.push(matchMedia(media, (matches) => {
          if (matches) {
            setImageSource(source);
          } else if (matchesNothing(medias)) {
            setImageSource(src);
          }
        }));

        if (matchesQuery(media)) {
          setImageSource(source);
        }
      });

      return (): void => {
        callbacks.forEach((cb) => cb());
      };
    }
    return undefined;
  }, [src, visible, sources]);

  if (!(visible && imageSource)) {
    return (
      <>
        { fallback }
      </>
    );
  }

  return (
    <Suspense fallback={<>{ fallback }</>}>
      <SuspendedImage ref={ref} src={imageSource} {...props} />
    </Suspense>
  );
});

Img.displayName = 'Img';

Img.propTypes = {
  containerRef: PropTypes.shape({
    current: PropTypes.oneOfType([
      PropTypes.instanceOf(HTMLElement),
    ]).isRequired,
  }).isRequired,
  sources: PropTypes.arrayOf(
    PropTypes.exact({
      source: PropTypes.string.isRequired,
      media: PropTypes.string.isRequired,
    }).isRequired,
  ),
  fallback: PropTypes.node.isRequired,
  src: PropTypes.string.isRequired,
  alt: PropTypes.string.isRequired,
};

Img.defaultProps = {
  sources: undefined,
};


export default Img;

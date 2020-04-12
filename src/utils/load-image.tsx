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
export class BadImageError extends Error {
  constructor(source: string) {
    super(`Cannot load image from source '${source}'`);
  }
}

interface ResourcePending {
  state: 'pending';
  promise: Promise<void>;
}

interface ResourceSuccess {
  state: 'success';
}

interface ResourceFailure {
  state: 'failure';
  error: Error;
}

type Resource = ResourcePending | ResourceSuccess | ResourceFailure;

const RESOURCES = new Map<string, Resource>();

function getResource(source: string): Resource {
  const cachedResource = RESOURCES.get(source);

  if (cachedResource) {
    return cachedResource;
  }

  const resource: Resource = {
    state: 'pending',
    promise: new Promise((res, rej) => {
      const image = new Image();

      image.addEventListener('load', () => {
        res(true);
      });

      image.addEventListener('error', () => {
        rej(new BadImageError(source));
      });

      image.src = source;
    }).then(
      () => {
        RESOURCES.set(source, { state: 'success' });
      },
      (error) => {
        RESOURCES.set(source, {
          error,
          state: 'failure',
        });
      },
    ),
  };

  RESOURCES.set(source, resource);

  return resource;
}

export function loadImage(source: string): void {
  const resource = getResource(source);

  switch (resource.state) {
    case 'failure':
      throw resource.error;
    case 'pending':
      throw resource.promise;
    case 'success':
      break;
    default:
      break;
  }
}

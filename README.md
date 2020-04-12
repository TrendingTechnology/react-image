# @lxsmnsyc/react-image

> Responsive, Suspenseful, Lazy-loading Image component in React

[![NPM](https://img.shields.io/npm/v/@lxsmnsyc/react-image.svg)](https://www.npmjs.com/package/@lxsmnsyc/react-image) 

## Install

Yarn
```bash
yarn add @lxsmnsyc/react-image
```

NPM
```bash
npm -i @lxsmnsyc/react-image
```

## Features

### Lazy-loading
The component employs the lazy-loading mechanism for loading the image only when necessary, in which case, if the image is visible in the client's viewport. This is achieved through the use of `IntersectionObserver` API.

### Suspenseful
The component uses React's `Suspense` API to await the image's loading process, so that the image won't feel "snappy" when being rendered in the browser. While being loaded, the provided fallback is rendered.

### Responsive
The component not only can receive an image source, it can receive a list of sources, coupled with a media query, which allows the component to present the correct image source when it matches the given media query.

### Compatibility
Although the native image element supports these kinds of mechanisms, not all browsers supports those features. This component allows the users to achieve the same kind of functionality but with bonuses.

## Usage

### Example

```tsx
import Img from '@lxsmnsyc/react-image';

// Your code

<Img
  src="default.jpg"
  fallback={<LoadingFallback />}
  containerRef={containerRef}
  sources={[
    {
      source: 'portrait.jpg',
      media: '(orientation: portrait)',
    },
    {
      source: 'landscape.jpg',
      media: '(orientation: landscape)',
    },
  ]}
/>
```

The `<Img>` is semantically the same with the `<img>` component, with some properties removed (i.e. srcSet, sizes, referrerPolicy, crossOrigin, etc.). This component has some extra properties:

* `fallback` - a ReactNode; used to display as a fallback to the component while the image is being loaded or while the image is out of the view (won't shift back after the image has been loaded).
* `containerRef` - The container of the `<Img>`, in which case, the DOM parent. This is used to detect if the image has intersected the viewport visibility.
* `sources` - an array of objects with properties `source` and `media`.
  * `source` - the source of the image to be selected.
  * `media` - the media query used for selecting the image. If similar media occurs in other objects, only the last occuring media that matches will be allowed to select the image to be presented.


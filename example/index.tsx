import React from 'react';
import ReactDOM from 'react-dom';
import Img from '@lxsmnsyc/react-image';

import DesktopImg from './images/photo_mw_2000px_800.jpg';
import Img16x9 from './images/photo_mw_1200px_800.jpg';
import Img4x3 from './images/photo_mw_991px_800.jpg';
import Img1x1 from './images/photo_mw_534px_800.jpg';

const SOURCE_SET = [
  {
    source: DesktopImg,
    media: '(min-width: 1200px)',
  },
  {
    source: Img16x9,
    media: '(min-width: 992px) and (max-width: 1199px)',
  },
  {
    source: Img4x3,
    media: '(min-width: 768px) and (max-width: 991px)',
  },
  {
    source: Img1x1,
    media: '(min-width: 480px) and (max-width: 767px)',
  },
  {
    media: '(max-width: 479px)',
  },
];

const Headline = () => (
  <p>
    This is a demo of the library <a href="https://github.com/lxsmnsyc/react-image">@lxsmnsyc/react-image</a> which compares the native responsive image mechanism to the custom React component.

    Try resizing the browser.
  </p>
);

const NativeImage = () => (
  <div className="container">
    <picture>
      <source media={SOURCE_SET[0].media} srcSet={SOURCE_SET[0].source} />
      <source media={SOURCE_SET[1].media} srcSet={SOURCE_SET[1].source} />
      <source media={SOURCE_SET[2].media} srcSet={SOURCE_SET[2].source} />
      <source media={SOURCE_SET[3].media} srcSet={SOURCE_SET[3].source} />
      <source media={SOURCE_SET[4].media} srcSet={SOURCE_SET[4].source} />
      <img src={SOURCE_SET[3].source} loading="lazy" />
    </picture>
  </div>
);

const Loader = () => (
  <div className="loader-container">
    <div className="loader">
      <div className="cube"></div>
      <div className="cube"></div>
      <div className="cube"></div>
      <div className="cube"></div>
      <div className="cube"></div>
      <div className="cube"></div>
      <div className="cube"></div>
      <div className="cube"></div>
      <div className="cube"></div>
      <div className="cube"></div>
    </div>
  </div>
);

const CustomImage = () => {
  const ref = React.useRef<HTMLDivElement | null>(null);
  return (
    <>
      <div className="container" ref={ref}>
        <Img
          src={SOURCE_SET[0].source}
          fallback={<Loader />}
          containerRef={ref}
          sources={SOURCE_SET}
        />
      </div>
      <p>at <b>less-than 480px</b> viewport, the fallback should render.</p>
    </>
  );
};

const App = () => (
  <>
    <Headline />
    <h1>Native Responsive Imaging</h1>
    <NativeImage />
    <h1>Img Component</h1>
    <CustomImage />
  </>
);

ReactDOM.render(<App />, document.getElementById('root'));

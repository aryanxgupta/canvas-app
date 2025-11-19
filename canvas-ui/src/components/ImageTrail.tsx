import React, { useRef, useEffect } from 'react';
import { gsap } from 'gsap';

// Helper functions
const MathUtils = {
  lerp: (a: number, b: number, n: number) => (1 - n) * a + n * b,
  distance: (x1: number, y1: number, x2: number, y2: number) =>
    Math.hypot(x2 - x1, y2 - y1),
};

// Array of image URLs
const imageSources = [
  'https://res.cloudinary.com/dbpwbtkis/image/upload/v1649185574/01_compressed_dlglp7.jpg',
  'https://res.cloudinary.com/dbpwbtkis/image/upload/v1649185571/02_compressed_vl2zfa.jpg',
  'https://res.cloudinary.com/dbpwbtkis/image/upload/v1649185570/03_compressed_zke5uv.jpg',
  'https://res.cloudinary.com/dbpwbtkis/image/upload/v1649185569/04_compressed_powoby.jpg',
  'https://res.cloudinary.com/dbpwbtkis/image/upload/v1649185570/05_compressed_zthlxd.jpg',
  'https://res.cloudinary.com/dbpwbtkis/image/upload/v1649185570/06_compressed_w6o2vk.jpg',
  'https://res.cloudinary.com/dbpwbtkis/image/upload/v1649185572/07_compressed_linhww.jpg',
  'https://res.cloudinary.com/dbpwbtkis/image/upload/v1649185572/08_compressed_wo1ylq.jpg',
  'https://res.cloudinary.com/dbpwbtkis/image/upload/v1649185573/09_compressed_penohm.jpg',
  'https://res.cloudinary.com/dbpwbtkis/image/upload/v1649185573/10_compressed_x4ifst.jpg',
  'https://res.cloudinary.com/dbpwbtkis/image/upload/v1649185573/11_compressed_zztgvu.jpg',
  'https://res.cloudinary.com/dbpwbtkis/image/upload/v1649185574/12_compressed_vfinpv.jpg',
];

const ImageTrail: React.FC = () => {
  const imageRefs = useRef<(HTMLImageElement | null)[]>([]);
  const mousePos = useRef({ x: 0, y: 0 });
  const lastMousePos = useRef({ x: 0, y: 0 });
  const cacheMousePos = useRef({ x: 0, y: 0 });
  const zIndexVal = useRef(1);
  const imgPosition = useRef(0);
  const animationFrameId = useRef<number | null>(null);
  const threshold = 100;

  useEffect(() => {
    const getMousePos = (ev: MouseEvent) => {
      let posx = 0;
      let posy = 0;
      if (ev.pageX || ev.pageY) {
        posx = ev.pageX;
        posy = ev.pageY;
      } else if (ev.clientX || ev.clientY) {
        posx = ev.clientX + document.body.scrollLeft + document.documentElement.scrollLeft;
        posy = ev.clientY + document.body.scrollTop + document.documentElement.scrollTop;
      }
      return { x: posx, y: posy };
    };

    const handleMouseMove = (ev: MouseEvent) => {
      mousePos.current = getMousePos(ev);
    };

    window.addEventListener('mousemove', handleMouseMove);

    const getMouseDistance = () =>
      MathUtils.distance(
        mousePos.current.x,
        mousePos.current.y,
        lastMousePos.current.x,
        lastMousePos.current.y
      );

    const showNextImage = () => {
      const img = imageRefs.current[imgPosition.current];
      if (!img) return;

      const rect = img.getBoundingClientRect();
      gsap.killTweensOf(img);

      gsap
        .timeline()
        .set(img, {
          opacity: 1,
          scale: 1,
          zIndex: zIndexVal.current,
          x: cacheMousePos.current.x - rect.width / 2,
          y: cacheMousePos.current.y - rect.height / 2,
        })
        .to(img, {
          duration: 0.9,
          ease: 'expo.out',
          x: mousePos.current.x - rect.width / 2,
          y: mousePos.current.y - rect.height / 2,
        })
        .to(img, { duration: 1, ease: 'power1.out', opacity: 0 }, 0.4)
        .to(img, { duration: 1, ease: 'quint.out', scale: 0.2 }, 0.4);
    };

    const renderLoop = () => {
      const distance = getMouseDistance();
      cacheMousePos.current.x = MathUtils.lerp(
        cacheMousePos.current.x,
        mousePos.current.x,
        0.1
      );
      cacheMousePos.current.y = MathUtils.lerp(
        cacheMousePos.current.y,
        mousePos.current.y,
        0.1
      );

      if (distance > threshold) {
        showNextImage();
        zIndexVal.current++;
        imgPosition.current =
          imgPosition.current < imageSources.length - 1 ? imgPosition.current + 1 : 0;
        lastMousePos.current = mousePos.current;
      }

      let isIdle = true;
      for (const img of imageRefs.current) {
        if (img && (gsap.isTweening(img) || img.style.opacity !== '0')) {
          isIdle = false;
          break;
        }
      }
      
      if (isIdle && zIndexVal.current !== 1) {
        zIndexVal.current = 1;
      }

      animationFrameId.current = requestAnimationFrame(renderLoop);
    };

    animationFrameId.current = requestAnimationFrame(renderLoop);

    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      if (animationFrameId.current) {
        cancelAnimationFrame(animationFrameId.current);
      }
      gsap.killTweensOf(imageRefs.current);
    };
  }, []);

  // Render *only* the images. They will be positioned absolutely
  // based on the CSS class `.content__img`.
  return (
    <>
      {imageSources.map((src, index) => (
        <img
          key={src}
          className="content__img"
          src={src}
          ref={(el) => (imageRefs.current[index] = el)}
          alt=""
        />
      ))}
    </>
  );
};

export default ImageTrail;
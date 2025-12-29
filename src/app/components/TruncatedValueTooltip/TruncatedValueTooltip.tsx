import { FC, useLayoutEffect, useRef, useState } from 'react';
import Tooltip from '@/app/components/Tooltip';

type WrapperComponent = React.ForwardRefExoticComponent<
  React.HTMLAttributes<HTMLDivElement> & React.RefAttributes<HTMLDivElement>
>;

type TruncatedValueTooltipProps = {
  text: string;
  Wrapper: WrapperComponent;
};

const TruncatedValueTooltip: FC<TruncatedValueTooltipProps> = ({ text, Wrapper }) => {
  const [showTooltip, setShowTooltip] = useState(false);
  const [isTruncated, setIsTruncated] = useState(false);
  const textRef = useRef<HTMLDivElement>(null);

  useLayoutEffect(() => {
    const checkTruncation = () => {
      const el = textRef.current;
      if (!el) return;
      setIsTruncated(el.scrollWidth > el.clientWidth + 1);
    };

    const animationFrameId = requestAnimationFrame(checkTruncation);

    let resizeObserver: ResizeObserver | undefined;
    if (typeof ResizeObserver !== 'undefined' && textRef.current) {
      resizeObserver = new ResizeObserver(checkTruncation);
      resizeObserver.observe(textRef.current);
    } else {
      const onResize = () => checkTruncation();
      window.addEventListener('resize', onResize);
      return () => {
        cancelAnimationFrame(animationFrameId);
        window.removeEventListener('resize', onResize);
      };
    }

    return () => {
      cancelAnimationFrame(animationFrameId);
      resizeObserver?.disconnect();
    };
  }, [text]);

  const onEnter = () => {
    if (isTruncated && text && text !== '-') setShowTooltip(true);
  };
  const onLeave = () => setShowTooltip(false);

  return (
    <>
      <Wrapper ref={textRef} onMouseEnter={onEnter} onMouseLeave={onLeave}>
        {text}
      </Wrapper>
      {isTruncated && text !== '-' && (
        <Tooltip showTooltip={showTooltip} tooltipMessage={text} targetRef={textRef} />
      )}
    </>
  );
};

export default TruncatedValueTooltip;

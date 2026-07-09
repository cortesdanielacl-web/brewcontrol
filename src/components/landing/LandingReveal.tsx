import React, { useEffect, useRef, useState } from 'react';

interface LandingRevealProps {
  children: React.ReactNode;
  className?: string;
  delay?: number;
  immediate?: boolean;
  as?: 'div' | 'section' | 'article';
}

export const LandingReveal: React.FC<LandingRevealProps> = ({
  children,
  className = '',
  delay = 0,
  immediate = false,
  as: Tag = 'div',
}) => {
  const ref = useRef<HTMLElement>(null);
  const [visible, setVisible] = useState(immediate);

  useEffect(() => {
    if (immediate) return;

    const node = ref.current;
    if (!node) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setVisible(true);
          observer.disconnect();
        }
      },
      { threshold: 0.08, rootMargin: '0px 0px -24px 0px' },
    );

    observer.observe(node);
    return () => observer.disconnect();
  }, [immediate]);

  const stateClass = immediate
    ? 'landing-reveal--immediate'
    : visible
      ? 'landing-reveal--visible'
      : '';

  return (
    <Tag
      ref={ref as React.RefObject<HTMLDivElement>}
      className={`landing-reveal ${stateClass} ${className}`}
      style={{ animationDelay: immediate ? `${delay}ms` : undefined, transitionDelay: immediate ? undefined : `${delay}ms` }}
    >
      {children}
    </Tag>
  );
};

import './ContainerComponent.scss';
import React, { CSSProperties } from 'react';

export type ContainerProps = {
  className?: string | undefined;
  children: React.ReactNode;
  style?: CSSProperties;
};

export default function ContainerComponent(props: ContainerProps) {
  return <div style={{ ...props.style }}>{props.children}</div>;
}

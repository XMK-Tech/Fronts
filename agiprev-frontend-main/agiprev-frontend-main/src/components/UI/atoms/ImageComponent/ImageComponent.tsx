import './ImageComponent.scss';
import { Image } from 'react-bootstrap';
import { CSSProperties } from 'react';

export type ImageProps = {
  src: string;
  width?: string;
  height?: string;
  className?: string;
  style?: CSSProperties;
};

export default function ImageComponent(props: ImageProps) {
  return <Image {...props} />;
}

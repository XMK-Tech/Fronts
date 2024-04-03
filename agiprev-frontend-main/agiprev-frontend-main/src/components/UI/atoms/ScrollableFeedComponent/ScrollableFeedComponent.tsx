import React from 'react';
import ScrollableFeed, { ScrollableFeedProps } from 'react-scrollable-feed';

type ScrollableFeedComponentProps = Readonly<{
  children?: React.ReactNode;
}> &
  Readonly<ScrollableFeedProps>;

export default function ScrollableFeedComponent(
  props?: ScrollableFeedComponentProps
) {
  return <ScrollableFeed {...props}>{props?.children}</ScrollableFeed>;
}

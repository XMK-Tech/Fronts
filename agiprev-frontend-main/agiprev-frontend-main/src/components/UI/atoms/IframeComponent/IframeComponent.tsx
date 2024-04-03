export type IframeComponentProps = {
  src?: string;
};

export default function IframeComponent(props: IframeComponentProps) {
  return (
    <iframe title="document" src={props.src} width={'100%'} height={'500px'} />
  );
}

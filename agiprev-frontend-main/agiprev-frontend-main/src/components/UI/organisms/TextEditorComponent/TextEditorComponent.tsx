import JoditEditor from 'jodit-react';
import { useRef } from 'react';

type TextEditorComponentProps = {
  value: string;
  setValue: (text: string) => void;
};
export default function TextEditorComponent(props: TextEditorComponentProps) {
  const ref = useRef(null);
  const config = {
    readonly: false,
    height: 500,
    placeholder: 'Digite os termos aqui',
    containerStyle: { borderRadius: 12 },
  };

  return (
    <JoditEditor
      ref={ref}
      value={props.value}
      onBlur={props.setValue}
      config={config as any}
      onChange={(newContent) => {}}
    />
  );
}

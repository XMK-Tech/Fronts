import { Flex } from '@chakra-ui/react';
import { Historymessage } from '../../atoms/HistoryMessage/HistoryMessage';
import ScrollableFeedComponent from '../../atoms/ScrollableFeedComponent/ScrollableFeedComponent';
import { MessageComponent } from '../../molecules/MessageComponent/MessageComponent';

type TalkComponentProps = {
  items: {
    person: string;
    message: string;
    time: string;
    systemGenerated: boolean;
    fromRequester: boolean;
  }[];
};

export function TalkComponent(props: TalkComponentProps) {
  return (
    <Flex marginY={8} direction={'column'} height={458}>
      <ScrollableFeedComponent>
        {props.items.map((e, index) =>
          e.systemGenerated ? (
            <Historymessage key={index} message={e.message} />
          ) : (
            <MessageComponent key={index} {...e} />
          )
        )}
      </ScrollableFeedComponent>
    </Flex>
  );
}

import { useAppSelector } from "~hooks/redux";
import type { Emote } from "~types";

type MessageProps = {
  message: string;
};

const parse = (msg: string, emotes: Record<string, Emote>) => {
  const msgArr = msg.split(new RegExp("\\s+"));

  const parsedMsg = msgArr.map((word, index) => {
    const emote = emotes[word];
    if (emote) {
      return (
        <img
          src={emote.url}
          alt={word}
          title={word}
          className="inline mr-2 hover:scale-125 transition-transform duration-200"
          key={index}
        />
      );
    }

    return (
      <span className="mr-2" key={index}>
        {word}
      </span>
    );
  });

  return parsedMsg;
};

function Message({ message }: MessageProps) {
  const emotes = useAppSelector((state) => state.log.emotes);

  return <span>{parse(message, emotes)}</span>;
}

export default Message;

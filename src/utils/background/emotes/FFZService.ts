import type { Emote } from "~types";
import type { IThirdPartyEmoteService } from "./ThirdPartyEmoteService";

type FFZEmote = {
  id: number;
  name: string;
  urls: { [key: string]: string };
  status: number;
  usage_count: number;
};

class FFZService implements IThirdPartyEmoteService {
  private readonly baseAPIURL = "https://api.frankerfacez.com/v1";

  public async getChannelEmotes(channelID: string): Promise<Emote[]> {
    const res = await fetch(`${this.baseAPIURL}/room/id/${channelID}`, {
      signal: AbortSignal.timeout(5000)
    });
    const data = await res.json();

    const emotes: FFZEmote[] = data.sets[data.room.set].emoticons;

    return emotes.map((emote) => ({
      name: emote.name,
      url: emote.urls["1"],
      type: "ffz"
    }));
  }

  public async getGlobalEmotes(): Promise<Emote[]> {
    const res = await fetch(`${this.baseAPIURL}/set/global`, {
      signal: AbortSignal.timeout(5000)
    });
    const data = await res.json();

    const emotes: FFZEmote[] = data.sets[data.default_sets[0]].emoticons;

    return emotes.map((emote) => ({
      name: emote.name,
      url: emote.urls["1"],
      type: "ffz"
    }));
  }
}

export default FFZService;

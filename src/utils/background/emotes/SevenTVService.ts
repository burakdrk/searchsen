import type { Emote } from "~types";
import type { IThirdPartyEmoteService } from "./ThirdPartyEmoteService";

type SevenTVEmote = {
  id: string;
  name: string;
  data: Data;
};

type Data = {
  id: string;
  name: string;
  host: Host;
};

type Host = {
  url: string;
};

class SevenTVService implements IThirdPartyEmoteService {
  private readonly baseAPIURL = "https://7tv.io/v3";
  private readonly cdnExt = "1x.webp";

  public async getChannelEmotes(channelID: string): Promise<Emote[]> {
    const res = await fetch(`${this.baseAPIURL}/users/twitch/${channelID}`, {
      signal: AbortSignal.timeout(5000)
    });
    const data = await res.json();

    const emotes: SevenTVEmote[] = data.emote_set.emotes;

    return emotes.map((emote) => ({
      name: emote.name,
      url: `${emote.data.host.url}/${this.cdnExt}`,
      type: "7tv"
    }));
  }

  public async getGlobalEmotes(): Promise<Emote[]> {
    const res = await fetch(`${this.baseAPIURL}/emote-sets/global`, {
      signal: AbortSignal.timeout(5000)
    });
    const data = await res.json();

    const emotes: SevenTVEmote[] = data.emotes;

    return emotes.map((emote) => ({
      name: emote.name,
      url: `${emote.data.host.url}/${this.cdnExt}`,
      type: "7tv"
    }));
  }
}

export default SevenTVService;

import type { Emote } from "~types";
import type { IThirdPartyEmoteService } from "./ThirdPartyEmoteService";

type BTTVEmote = {
  id: string;
  code: string;
  imageType: string;
  animated: boolean;
  userId: string;
};

class BTTVService implements IThirdPartyEmoteService {
  private readonly baseAPIURL = "https://api.betterttv.net/3";
  private readonly baseCDNURL = "https://cdn.betterttv.net/emote";

  public async getChannelEmotes(channelID: string): Promise<Emote[]> {
    const res = await fetch(
      `${this.baseAPIURL}/cached/users/twitch/${channelID}`,
      { signal: AbortSignal.timeout(5000) }
    );
    const data = await res.json();

    const sharedEmotes: BTTVEmote[] = data.sharedEmotes;
    const channelEmotes: BTTVEmote[] = data.channelEmotes;

    const emotes = new Map<string, string>();

    // Channel emotes overwrite shared emotes
    [...sharedEmotes, ...channelEmotes].forEach((emote) => {
      emotes.set(emote.code, `${this.baseCDNURL}/${emote.id}/1x`);
    });

    return Array.from(emotes).map(([name, url]) => ({
      name,
      url,
      type: "bttv"
    }));
  }

  public async getGlobalEmotes(): Promise<Emote[]> {
    const res = await fetch(`${this.baseAPIURL}/cached/emotes/global`, {
      signal: AbortSignal.timeout(5000)
    });
    const data: BTTVEmote[] = await res.json();

    return data.map((emote) => ({
      name: emote.code,
      url: `${this.baseCDNURL}/${emote.id}/1x`,
      type: "bttv"
    }));
  }
}

export default BTTVService;

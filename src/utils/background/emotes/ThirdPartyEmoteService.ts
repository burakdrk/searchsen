import type { Emote } from "~types";

export interface IThirdPartyEmoteService {
  getChannelEmotes(channelID: string): Promise<Emote[]>;
  getGlobalEmotes(): Promise<Emote[]>;
}

class ThirdPartyEmoteService {
  private readonly channelID: string;
  private readonly services: IThirdPartyEmoteService[];

  /**
   * Creates an instance of ThirdPartyEmoteService.
   *
   * @param channelID - The ID of the channel for which the emote services are being initialized.
   * @param services - An array of services that provide emotes. Order matters. The last service in the array will have the highest priority.
   *
   * @remarks
   * The order of the services in the array matters. The last service in the array will overwrite the first.
   */
  constructor(channelID: string, services: IThirdPartyEmoteService[]) {
    this.channelID = channelID;
    this.services = services;
  }

  /**
   * Retrieves a map of unique emotes from multiple services.
   * Mapped by the emote name.
   *
   * This method fetches both channel-specific and global emotes from the configured services.
   * Channel emotes will overwrite global emotes if there are duplicates.
   *
   * @returns {Promise<Emote[]>} A promise that resolves to a map of unique emotes.
   */
  public async getEmotes(): Promise<Map<string, Emote>> {
    // Map the name of the emote to the Object
    const uniqueEmotes = new Map<string, Emote>();

    const channelEmotes = await Promise.all(
      this.services.map((service) =>
        service.getChannelEmotes(this.channelID).catch(() => [])
      )
    ).then((emotes) => emotes.flat());

    const globalEmotes = await Promise.all(
      this.services.map((service) => service.getGlobalEmotes().catch(() => []))
    ).then((emotes) => emotes.flat());

    // globalEmotes are added first so that channel emotes can overwrite them
    [...globalEmotes, ...channelEmotes].forEach((emote) => {
      uniqueEmotes.set(emote.name, emote);
    });

    return uniqueEmotes;
  }
}

export default ThirdPartyEmoteService;

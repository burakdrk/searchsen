import { MaxPriorityQueue } from "@datastructures-js/priority-queue";
import type { Emote, Logs } from "~types";

interface RankedItem {
  name: string;
  count: number;
}

interface EmoteRankingItem extends RankedItem {
  url: string;
}

function calculateTopItems<T extends RankedItem>(
  items: Map<string, number>,
  limit: number,
  transformFn: (item: RankedItem) => T
): T[] {
  if (limit < 1) throw new Error("Limit must be positive");

  const queue = new MaxPriorityQueue<RankedItem>((e) => e.count);

  items.forEach((count, name) => {
    queue.enqueue({ name, count });
  });

  const results: T[] = [];

  for (let i = 0; i < limit; i++) {
    const node = queue.dequeue();
    if (!node) break;
    results.push(transformFn(node));
  }

  return results;
}

export function calculateTopEmotes(
  emotes: Record<string, Emote>,
  logs: Logs[],
  top: number = 10
): EmoteRankingItem[] {
  const emoteMap = new Map<string, number>();

  logs.forEach((log) => {
    const msgArr = log.m.split(new RegExp("\\s+"));
    msgArr.forEach((word) => {
      const emote = emotes[word];
      if (!emote) return;

      emoteMap.set(emote.name, (emoteMap.get(emote.name) || 0) + 1);
    });
  });

  return calculateTopItems(emoteMap, top, (item) => ({
    ...item,
    url: emotes[item.name].url
  }));
}

export function calculateTopChatters(
  logs: Logs[],
  top: number = 10
): RankedItem[] {
  const userMap = new Map<string, number>();

  logs.forEach((log) => {
    userMap.set(log.u, (userMap.get(log.u) || 0) + 1);
  });

  return calculateTopItems(userMap, top, (item) => item);
}

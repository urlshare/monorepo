import nock from "nock";
import { afterEach, beforeEach, describe, it } from "vitest";

import { generateToken, getTweetId, TWITTER_METADATA_URL } from "./fetch-adapters/twitter";
import { tweetExampleMetadata } from "./fetch-adapters/twitter/fixtures/tweet-example-metadata";
import { fetchMetadata } from "./fetch-metadata";

describe("fetchMetadata", () => {
  beforeEach(() => {
    nock.disableNetConnect();
  });

  afterEach(() => {
    nock.cleanAll();
    nock.enableNetConnect();
  });

  describe("when the url is a Twitter Tweet / X Xeet (?)", () => {
    const tweetUrl = "https://twitter.com/ValaAfshar/status/1684664268547837952";
    const token = generateToken(getTweetId(tweetUrl)!);

    it("should use twitter fetch adapter", async () => {
      const url = new URL(TWITTER_METADATA_URL);
      const scope = nock(url.origin)
        .get(url.pathname)
        .query({ id: getTweetId(tweetUrl), token })
        .reply(200, tweetExampleMetadata);

      await fetchMetadata(tweetUrl);

      scope.done();
    });
  });

  describe("when the url is pointing to anything else", () => {
    const otherUrl = "https://urlshare.app/whatever";

    it("should use default fetch adapter", async () => {
      const url = new URL(otherUrl);
      const scope = nock(url.origin).head(url.pathname).reply(200);

      await fetchMetadata(otherUrl);

      scope.done();
    });
  });
});


interface ScheduledPost {
    postDateTime: string;
    imageUrl: string;
    twitter: {
      text: string
    };
    reddit: {
      title: string,
      subreddit: string,
      nsfw: boolean
    };
}

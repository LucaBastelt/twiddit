
import schedule from 'node-schedule';
import { getConnection } from './model/databaseConnection';
import { morphToScheduledPosts } from './model/toModelTransformation';
import { getRedditToken } from './redditConnection';

export class Scheduler {

    public initialize(): void {

        // Each minute check posts to post
        var rule = new schedule.RecurrenceRule();
        rule.minute = new schedule.Range(0, 59);
        schedule.scheduleJob('posting', rule, this.run);
    }

    private async run(): Promise<void> {
        const token = await getRedditToken('atlantkogm@gmail.com');
        const db = await getConnection();
        try {
            const queryResult = await db.pool.query('SELECT * FROM twiddit.scheduledposts WHERE postdatetime::timestamptz < NOW();');
            const toPost = morphToScheduledPosts(queryResult.rows);

            for (const post of toPost) {
                if (post.twitter && post.twitter.text){
                    // TODO Post to twitter
                }
                if (post.reddit && post.reddit.title  && post.reddit.subreddit){
                    const token = await getRedditToken(post.userMail);
                    // TODO Post to reddit
                }
            }

        } catch (error) {
            console.error(error);
        }
    }
}
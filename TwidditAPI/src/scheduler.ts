
import schedule from 'node-schedule';
import { getConnection } from './model/databaseConnection';
import { morphToScheduledPosts } from './model/toModelTransformation';

export class Scheduler {

    public initialize(): void {

        // Each minute check posts to post
        schedule.scheduleJob({ minute: 1 }, this.run);
    }

    private async run(): Promise<void> {
        const db = await getConnection();
        try {
            const queryResult = await db.pool.query('SELECT * FROM twiddit.scheduledposts WHERE postdatetime::timestamptz < NOW();');
            const toPost = morphToScheduledPosts(queryResult.rows);

            for (const post of toPost) {
                if (post.twitter && post.twitter.text){
                    // TODO Post to twitter
                }
                if (post.reddit && post.reddit.title  && post.reddit.subreddit){
                    // TODO Post to reddit
                }
            }

        } catch (error) {
            console.error(error);
        }
    }
}
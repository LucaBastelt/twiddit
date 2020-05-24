import _ from 'lodash';
import { getConnection } from './model/databaseConnection';
import { morphToScheduledPosts, ScheduledPost } from './model/toModelTransformation';
import { RedditConnection } from './redditConnection';
import { Token } from 'simple-oauth2';
import Snoowrap from 'snoowrap';

export class Scheduler {

    public keepRunning: boolean = true;

    public async run(): Promise<void> {

        if (this.keepRunning) {
            // Each minute check posts to post
            setInterval(() => this.run(), 1000 * 1 * 60);
        }

        console.log('running');

        // const token = await getRedditToken('atlantkogm@gmail.com');
        const db = await getConnection();
        try {
            const queryResult = await db.pool.query('SELECT * FROM twiddit.scheduledposts WHERE postdatetime::timestamptz < NOW();');
            const toPost = morphToScheduledPosts(queryResult.rows);
            const toPostByUser = _.groupBy(toPost, p => p.userMail);

            for (const userMail of _.keys(toPostByUser)) {
                const posts = toPostByUser[userMail];

                const postedRedditPosts = await this.postPostsToReddit(posts, userMail);
                db.pool.query("UPDATE twiddit.scheduledposts SET reddittitle='', subreddit='' WHERE id = any($1)", [postedRedditPosts]);

                const postedTwitterPosts = await this.postPostsToTwitter(posts, userMail);
                db.pool.query("UPDATE twiddit.scheduledposts SET twittertext='' WHERE id = any($1)", [postedTwitterPosts]);
            }

            db.pool.query("DELETE FROM twiddit.scheduledposts WHERE (reddittitle = '' OR subreddit = '' OR reddittitle IS NULL OR subreddit IS NULL) AND (twittertext = '' OR twittertext IS NULL)");

        } catch (error) {
            console.error(error);
        }
    }

    private async postPostsToReddit(posts: ScheduledPost[], userMail: string): Promise<number[]> {
        const redditConnection = await RedditConnection.construct(userMail);
        var postedPosts: number[] = [];

        if (!redditConnection && posts.some(p => !!p.reddit)) {
            console.log(`Tried to post to reddit for user ${userMail} but no reddit token was found`);
            return postedPosts;
            // TODO Notifications table
        }

        for (const post of posts.filter(p => !!p.reddit && !!p.reddit.subreddit && !!p.reddit.title)) {
            const postId = await this.postPostToReddit(post, redditConnection as RedditConnection);
            postedPosts.push(postId);
        }
        return postedPosts;
    }

    private async postPostToReddit(post: ScheduledPost, redditConnection: RedditConnection): Promise<number> {
        try {
            const reddit = redditConnection.createRedditWrapperInstance();
            const subreddit = this.checkSubredditName(post.reddit.subreddit, reddit);
            if (post.reddit?.title && post.reddit?.subreddit) {
                reddit.submitLink({
                    subredditName: subreddit,
                    title: post.reddit.title,
                    url: post.imageUrl
                }).then(submission => {
                    if (post.reddit.nsfw) {
                        submission.markNsfw();
                    }
                    return submission;
                }).catch(e => {
                    console.log('An error occured while posting to reddit', e);
                });
            }
            return post.id;
        } catch (error) {
            console.log('An error occured while posting to reddit', error);
        }
        return -1;
    }

    private async postPostsToTwitter(posts: ScheduledPost[], userMail: string): Promise<number[]> {
        // TODO get twitter token
        const twitterToken = <Token><unknown>undefined; //await getTwitterToken(userMail);
        var postedPosts: number[] = [];

        if (!twitterToken && posts.some(p => !!p.twitter)) {
            console.log(`Tried to post to twitter for user ${userMail} but no twitter token was found`);
            return postedPosts;
            // TODO Notifications table
        }

        for (const post of posts.filter(p => !!p.twitter)) {
            const postId = await this.postPostToTwitter(post, twitterToken);
            postedPosts.push(postId);
        }
        return postedPosts;
    }

    private async postPostToTwitter(post: ScheduledPost, token: Token): Promise<number> {
        if (post.twitter?.text) {
            // TODO Post to twitter
        }
        return post.id;
    }

    private checkSubredditName(subreddit: string, reddit: Snoowrap): string {
        if (subreddit.startsWith('/u/')) {
            subreddit = '/r/u_' + subreddit.substring(3);
        } if (subreddit.startsWith('u/')) {
            subreddit = '/r/u_' + subreddit.substring(2);
        } else if (!subreddit.startsWith('/r/') && !subreddit.startsWith('r/')) {
            subreddit = '/r/' + subreddit;
        }

        try {
            if (reddit.getSubreddit(subreddit).created_utc > 0) {
                return subreddit;
            } else {
                throw new Error('An error occured while posting to reddit, the subreddit was not available');
            }
        } catch (error) {
            throw new Error('An error occured while posting to reddit, the subreddit was not available: ' + JSON.stringify(error));
        }
    }
}
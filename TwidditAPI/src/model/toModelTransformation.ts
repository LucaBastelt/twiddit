import { morphism, StrictSchema } from 'morphism';

// What we have
export interface DatabaseScheduledPost {
    id: number;
    reddittitle: string;
    subreddit: string;
    nsfw: boolean;
    twittertext: string;
    imageurl: string;
    postdatetime: string;
}

export interface ScheduledPost {
    id: number;
    postDateTime: string;
    imageUrl: string;
    twitter?: {
        text: string,
    };
    reddit?: {
        title: string,
        subreddit: string,
        nsfw: boolean,
    };
}

export const ScheduledPostSchema = {
    id: 'id',
    postDateTime: 'postdatetime',
    imageUrl: 'imageurl',
    twitter: (it: DatabaseScheduledPost) => {
        return it.twittertext !== '' ? {
            text: it.twittertext,
        } : undefined;
    },
    reddit: (it: DatabaseScheduledPost) => {
        return it.reddittitle !== '' ? {
            title: it.reddittitle,
            subreddit: it.subreddit,
            nsfw: it.nsfw,
        } : undefined;
    },
};

export const DatabaseScheduledPostSchema = {
    id: 'id',
    postdatetime: 'postDateTime',
    imageurl: 'imageUrl',
    twittertext: (it: ScheduledPost) => {
        return it.twitter ? it.twitter.text : '';
    },
    reddittitle: (it: ScheduledPost) => {
        return it.reddit ? it.reddit.title : '';
    },
    subreddit: (it: ScheduledPost) => {
        return it.reddit ? it.reddit.subreddit : '';
    },
    nsfw: (it: ScheduledPost) => {
        return it.reddit ? it.reddit.nsfw : false;
    },
};

export function morphToScheduledPost(source: DatabaseScheduledPost): ScheduledPost {
    return morphism<StrictSchema<ScheduledPost, DatabaseScheduledPost>>(ScheduledPostSchema, source);
}

export function morphToScheduledPosts(source: DatabaseScheduledPost[]): ScheduledPost[] {
    return morphism<StrictSchema<ScheduledPost, DatabaseScheduledPost>>(ScheduledPostSchema, source);
}

export function morphToDatabaseScheduledPost(source: ScheduledPost): DatabaseScheduledPost {
    return morphism<StrictSchema<DatabaseScheduledPost, ScheduledPost>>(DatabaseScheduledPostSchema, source);
}

/* export function test() {

    const real: ScheduledPost = {
        id: 'id',
        postDateTime: 'postdatetime',
        imageUrl: 'imageurl',
        twitter: {
            text: 'string',
        },
        reddit: {
            title: 'string',
            subreddit: 'string',
            nsfw: true,
        },
    };
    const real2: ScheduledPost = {
        id: 'id',
        postDateTime: 'postdatetime',
        imageUrl: 'imageurl',
        reddit: {
            title: 'string',
            subreddit: 'string',
            nsfw: true,
        },
    };
    const real3: ScheduledPost = {
        id: 'id',
        postDateTime: 'postdatetime',
        imageUrl: 'imageurl',
        twitter: {
            text: 'string',
        },
    };

    const source: DatabaseScheduledPost = {
        id: 'id',
        reddittitle: 'posty mcpostboi',
        subreddit: '/r/stuff',
        nsfw: false,
        twittertext: 'Posti to twitter boi',
        imageurl: 'http://imgur.com/sdgf',
        postdatetime: '2019-10-10T09:30',
    };
    const source2: DatabaseScheduledPost = {
        id: 'id',
        reddittitle: '',
        subreddit: '/r/stuff',
        nsfw: false,
        twittertext: 'Posti to twitter boi',
        imageurl: 'http://imgur.com/sdgf',
        postdatetime: '2019-10-10T09:30',
    };
    const source3: DatabaseScheduledPost = {
        id: 'id',
        reddittitle: 'posty mcpostboi',
        subreddit: '/r/stuff',
        nsfw: false,
        twittertext: '',
        imageurl: 'http://imgur.com/sdgf',
        postdatetime: '2019-10-10T09:30',
    };
    const morphed = morphToScheduledPost(source);
    const reverse = morphToDatabaseScheduledPost(real);
    const morphed2 = morphToScheduledPost(source2);
    const reverse2 = morphToDatabaseScheduledPost(real2);
    const morphed3 = morphToScheduledPost(source3);
    const reverse3 = morphToDatabaseScheduledPost(real3);
} */

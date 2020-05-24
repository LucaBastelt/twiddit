import 'snoowrap';
import { Submission, SubmitSelfPostOptions } from 'snoowrap';

declare module 'snoowrap' {
    export interface SubmitLinkOptions extends SubmitSelfPostOptions {
        url: string;
        resubmit?: boolean;
        nsfw?: boolean;
    }
}
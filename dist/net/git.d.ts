import { DirectoryPath, Url } from '@dataplug/tasenor-common';
import { SimpleGit } from 'simple-git';
/**
 * A git repo storage.
 */
export declare class GitRepo {
    url: Url;
    path: DirectoryPath;
    git: SimpleGit;
    constructor(url: Url, dir: DirectoryPath);
    /**
     * Initialize path and instantiate Simple Git if path exists.
     */
    setDir(dir: DirectoryPath): void;
    /**
     * Delete all if repo exists.
     */
    clean(): Promise<void>;
    /**
     * Clone the repo if it is not yet there.
     */
    fetch(): Promise<void>;
    /**
     * List files from repo returning local relative paths.
     */
    glob(pattern: string): string[];
    /**
     * Gather all repos found from the directory.
     */
    static all(dir: DirectoryPath): Promise<GitRepo[]>;
    /**
     * Extract default dir name for repo URL.
     */
    static defaultDir(repo: Url): string;
    /**
     * Ensure repo is downloaded and return repo instance.
     */
    static get(repoUrl: Url, parentDir: DirectoryPath): Promise<GitRepo>;
}

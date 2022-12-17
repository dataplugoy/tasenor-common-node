import { DirectoryPath, Email, FilePath, Url } from '@dataplug/tasenor-common';
import { SimpleGit } from 'simple-git';
/**
 * A git repo storage.
 */
export declare class GitRepo {
    url: Url;
    rootDir: DirectoryPath;
    name: string;
    git: SimpleGit;
    constructor(url: Url, rootDir: DirectoryPath);
    get fullPath(): FilePath;
    /**
     * Set the git configuration.
     */
    configure(name: string, email: Email): void;
    /**
     * Initialize root path and instantiate Simple Git if path exists.
     */
    setDir(rootDir: DirectoryPath): void;
    /**
     * Delete all if repo exists.
     */
    clean(): Promise<void>;
    /**
     * Clone the repo if it is not yet there. Return true if the repo is available.
     */
    fetch(): Promise<boolean>;
    /**
     * List files from repo returning local relative paths.
     */
    glob(pattern: string): string[];
    /**
     * Add, commit and push the given files and/or directories.
     */
    put(message: string, ...subPaths: (FilePath | DirectoryPath)[]): Promise<void>;
    /**
     * Gather all repos found from the directory.
     */
    static all(dir: DirectoryPath): Promise<GitRepo[]>;
    /**
     * Extract default name from repo URL.
     */
    static defaultName(repo: Url): string;
    /**
     * Ensure repo is downloaded and return repo instance.
     */
    static get(repoUrl: Url, parentDir: DirectoryPath, runYarnInstall?: boolean): Promise<GitRepo | undefined>;
}

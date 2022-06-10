import { BookkeeperConfig, DirectoryPath, ParsedTsvFileData, TarFilePath, Url } from '@dataplug/tasenor-common';
import { KnexDatabase } from '../database';
import { Exporter } from './Exporter';
/**
 * Export Tasenor database.
 */
export declare class TasenorExporter extends Exporter {
    /**
     * Read configuration information from database and construct compiled configuration.
     * @param db Knex connection to use.
     * @returns
     */
    getConfig(db: KnexDatabase): Promise<BookkeeperConfig>;
    /**
     * Read all accounts from the database and generate TSV-data.
     * @param db Knex connection to use.
     * @returns
     */
    getAccounts(db: KnexDatabase): Promise<ParsedTsvFileData>;
    /**
     * Read all periods from the database and generate TSV-data.
     * @param db Knex connection to use.
     * @returns
     */
    getPeriods(db: KnexDatabase): Promise<ParsedTsvFileData>;
    /**
     * Read all entries and documents from the database and generate TSV-data.
     * @param db Knex connection to use.
     * @returns
     */
    getEntries(db: KnexDatabase): Promise<ParsedTsvFileData>;
    /**
     * Read all tags from the database and generate TSV-data.
     * @param db Knex connection to use.
     * @param out Directory to write image files.
     * @returns
     */
    getTags(db: KnexDatabase, out: DirectoryPath): Promise<ParsedTsvFileData>;
    /**
     * Run the full backup for the given database.
     * @param dbUrl Database URL.
     * @param out Directory to save backup.
     * @param destPath Destionation file name if given.
     * @returns Path to the tar-package.
     */
    run(dbUrl: Url, out: DirectoryPath, destPath?: DirectoryPath | undefined): Promise<TarFilePath>;
    /**
     * Run the full backup for the given database.
     * @param db Knex database.
     * @param out Directory to save backup.
     * @param destPath Destionation file name if given.
     * @returns Path to the tar-package.
     */
    runDb(db: KnexDatabase, out: DirectoryPath, destPath?: DirectoryPath | undefined): Promise<TarFilePath>;
}

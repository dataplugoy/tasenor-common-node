import { KnexDatabase } from '..';
import { ParsedTsvFileData, BookkeeperConfig, DirectoryPath, ReportFormat, TarFilePath, SqliteDbPath } from '@dataplug/tasenor-common';
import { Exporter } from './Exporter';
/**
 * A class implementing conversion from old legacy Tilitin Sqlite-format to Tasenor format.
 */
export declare class TilitinExporter extends Exporter {
    /**
     * Construct Knex configuration for the given file.
     * @param path Path to the Sqlite-file.
     * @returns Instantiated Knex database connection.
     */
    database(path: any): KnexDatabase;
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
     * Check if the given table exist.
     * @param db
     */
    hasTable(db: KnexDatabase, table: string): Promise<boolean>;
    /**
     * Read configuration information from database and construct compiled configuration.
     * @param db Knex connection to use.
     * @returns
     */
    getConfig(db: KnexDatabase): Promise<BookkeeperConfig>;
    /**
     * Read all tags from the database and generate TSV-data.
     * @param db Knex connection to use.
     * @param out Directory to write image files.
     * @returns
     */
    getTags(db: KnexDatabase, out: DirectoryPath): Promise<ParsedTsvFileData>;
    /**
     * Read all report formats from the database and generate mapping from report IDs to report format.
     * @param db Knex connection to use.
     * @returns
     */
    getReports(db: KnexDatabase): Promise<{
        [key: string]: ReportFormat;
    }>;
    /**
     * Convert old report format to new.
     * @param report
     */
    convertReport(report: ReportFormat): ParsedTsvFileData;
    /**
     * Run the full backup for the given legacy database.
     * @param sqlite Path to the Sqlite database to create backup for.
     * @param out Directory to save backup.
     * @param destPath Destionation file name if given.
     * @returns Path to the tar-package.
     */
    run(sqlite: SqliteDbPath, out: DirectoryPath, destPath: DirectoryPath | undefined): Promise<TarFilePath>;
}

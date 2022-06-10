import { KnexDatabase } from '..';
import { ParsedTsvFileData, BookkeeperConfig, DirectoryPath, TsvFilePath, JsonFilePath, Json, TarFilePath } from '@dataplug/tasenor-common';
/**
 * Common functionality for exporters.
 */
export declare class Exporter {
    /**
     * Version number of the file format produced by this exporter.
     */
    VERSION: number;
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
    * Write prepared data to TSV file.
    * @param path Output file path.
    * @param lines Data content.
    */
    writeTsv(path: TsvFilePath, lines: ParsedTsvFileData): void;
    /**
    * Write prepared data to JSON file.
    * @param path Output file path.
    * @param lines Data content.
    */
    writeJson(path: JsonFilePath, data: Json): void;
    /**
    * Save complete backup of the Sqlite database to the given directory.
    * @param db Database connection.
    * @param out Directory to store all files.
    * @returns Configuration constructed from the database.
    */
    dump(db: KnexDatabase, out: DirectoryPath): Promise<BookkeeperConfig>;
    /**
    * Construct a tar-package for the given configuration from the source directory.
    * @param conf Configuration found from the database.
    * @param out Directory containing files extracted as a backup.
    * @param destPath Destionation file name if given.
    * @returns Path to the tar-package.
    */
    makeTar(conf: BookkeeperConfig, out: DirectoryPath, destPath: DirectoryPath | undefined): Promise<TarFilePath>;
}

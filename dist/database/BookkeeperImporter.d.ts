import { BookkeeperConfig, DirectoryPath, Hostname, ProcessedTsvFileData, TarFilePath, TextFilePath, TsvFilePath } from '@dataplug/tasenor-common';
import { KnexDatabase } from './DB';
/**
 * Implementation of the database backup file reading.
 */
export declare class BookkeeperImporter {
    VERSION: number | null;
    /**
     * Read in a TSV-file and construct list of objects.
     * @param file Path to the TSV-file.
     * @returns List of objects using texts in header line as keys.
     */
    readTsv(file: TsvFilePath): Promise<ProcessedTsvFileData>;
    /**
     * Read the version number from the file.
     * @param file Path to the version file.
     */
    setVersion(file: TextFilePath): void;
    /**
     * Read the account information from the tsv file.
     * @param file A tsv file to read.
     */
    readAccountTsv(file: TsvFilePath): Promise<any[]>;
    /**
     * Read the account information in to the database.
     * @param db Database connection.
     * @param files A list of files to read.
     */
    setAccounts(db: KnexDatabase, files: TsvFilePath[]): Promise<void>;
    /**
     * Read the period information in to the database.
     * @param db Database connection.
     * @param file Path to the period file.
     */
    setPeriods(db: any, file: TsvFilePath): Promise<void>;
    /**
     * Read and store all documents and entries found from the TSV-file.
     * @param db Database connection.
     * @param file Path to the transaction file.
     * @param conf Database configuration.
     */
    setEntries(db: KnexDatabase, file: TsvFilePath, conf: BookkeeperConfig): Promise<void>;
    /**
     * Set the configuration for database.
     * @param db Database connection.
     * @param name Name of the database to update.
     * @param conf Database configuration.
     */
    setConfig(db: KnexDatabase, config: BookkeeperConfig): Promise<void>;
    /**
     * Read in tag data and files from the backup.
     * @param db Database connection.
     * @param file Path to the tag file. Also its directory is assumed where images can be found.
     */
    setTags(db: KnexDatabase, file: TsvFilePath): Promise<void>;
    /**
     * Remove all data from all tables.
     * @param db Database connection.
     */
    clearEverything(db: KnexDatabase): Promise<void>;
    /**
     * Clear the given database and restore everything from the directory.
     * @param masterDb Master DB connection.
     * @param dbName Name of the database to use.
     * @param out The directory containing unpacked backup.
     * @param hostOverride If set, use this hostname instead of the one in database, when connecting to target DB.
     */
    restore(masterDb: KnexDatabase, dbName: string, out: DirectoryPath, hostOverride?: Hostname | null): Promise<void>;
    /**
     * Clear the given database and restore everything from the directory.
     * @param masterDb Master DB connection.
     * @param dbName Name of the database to use.
     * @param out The directory containing unpacked backup.
     * @param hostOverride If set, use this hostname instead of the one in database, when connecting to target DB.
     */
    run(masterDb: KnexDatabase, dbName: string, tarPath: TarFilePath, out: DirectoryPath, hostOverride?: Hostname | null): Promise<void>;
}

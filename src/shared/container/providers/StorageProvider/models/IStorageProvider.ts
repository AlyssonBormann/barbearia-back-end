export default interface IStorageProvider {
    save(file: string): Promise<string>;
    deleteFile(file: string): Promise<void>;
}

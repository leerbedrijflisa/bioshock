interface IStorageItem {
    id: string;
    name: string;
    path: string;
    fullPath: string;
    type: StorageItemType;

    folderProps: {
        items: IStorageItem[];
    };

    fileProps: {
        contentType: string;
        contents: string;
    }
}

interface AjaxFileResult extends IStorageItem {
    result: boolean;
    errorMessage?: string;
}

enum StorageItemType {
    FOLDER = 1,
    FILE = 2
}
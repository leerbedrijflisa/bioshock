interface StorageItem {
    id: string;
    name: string;
    path: string;
    fullPath: string;
    type: StorageItemType;

    folderProps: {
        items: StorageItem[];
    };

    fileProps: {
        contentType: string;
        contents: string;
    }
}

enum StorageItemType {
    FOLDER = 1,
    FILE = 2
}
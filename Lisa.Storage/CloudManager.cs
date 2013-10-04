using Microsoft.WindowsAzure;
using Microsoft.WindowsAzure.StorageClient;
using System;
using System.Collections.Generic;
using System.IO;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Lisa.Storage
{
    public class CloudManager
    {
        public CloudStorageAccount Account { get { return account; } }
        public CloudBlobClient Client { get { return client; } }
        public string ContainerAddress
        {
            get
            {
                return containerAddress;
            }
            set
            {
                if (string.IsNullOrEmpty(value))
                    throw new NullReferenceException();

                containerAddress = value;
            }

        }

        CloudStorageAccount account;
        CloudBlobClient client;
        string containerAddress;
        CloudBlobContainer currentContainer;

        //public CloudManager(string connectionString)
        //{
        //    account = CloudStorageAccount.Parse(connectionString);
        //    client = account.CreateCloudBlobClient();

        //}

        //public CloudManager(string connectionString, string containerAddress) 
        //    : this(connectionString)
        //{
        //    ContainerAddress = containerAddress;
        //    currentContainer = client.GetContainerReference(containerAddress);
        //}

        public CloudManager(string connectionString, string containerAddress, bool privateContainer)
        //: this(connectionString, containerAddress)
        {

            account = CloudStorageAccount.Parse(connectionString);
            client = account.CreateCloudBlobClient();
            currentContainer = client.GetContainerReference(containerAddress);

            currentContainer.CreateIfNotExist();

            if (privateContainer && currentContainer != null)
            {
                var perms = currentContainer.GetPermissions();
                perms.PublicAccess = BlobContainerPublicAccessType.Off;
                currentContainer.SetPermissions(perms);
            }
        }

        public Guid CreateBlob()
        {
            return CreateBlob(Guid.NewGuid());
        }

        public Guid CreateBlob(Guid guid)
        {
            currentContainer.GetBlockBlobReference(guid.ToString()).UploadText(string.Empty);
            return guid;
        }

        public Guid UploadStream(Stream stream)
        {
            return UploadStream(Guid.NewGuid(), stream);
        }

        public Guid UploadStream(Guid guid, Stream stream)
        {
            currentContainer.GetBlockBlobReference(guid.ToString()).UploadFromStream(stream);
            return guid;
        }

        public void DeleteBlob(Guid guid)
        {
            currentContainer.GetBlockBlobReference(guid.ToString()).DeleteIfExists();
        }
    }
}
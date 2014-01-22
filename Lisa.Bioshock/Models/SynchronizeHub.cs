using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using Microsoft.AspNet.SignalR;
using Lisa.Bioshock.Data;
using Lisa.Storage;
using Lisa.Storage.Data;
using Lisa.Bioshock.Extensions;
using Lisa.Bioshock.Helpers;
using System.Threading.Tasks;

namespace Lisa.Bioshock.Models
{
    public struct FileDescriptor
    {
        public string ID { get; set; }
        public string Name { get; set; }
        public int ProjectID { get; set; }
    }

    public class SynchronizeHub : Hub
    {
        public void ProcessChanges(FileDescriptor file, string contents)
        {
            //Task.Run(() =>
            //{
            //    WriteFile(file, contents);
            //    Console.WriteLine("Task.Run(WriteFile)");
            //});
            Clients.All.Update(file, contents);
        }

        private void WriteFile(FileDescriptor file, string contents)
        {
            using (var db = new BioshockContext())
            {
                var project = db.Projects.Find(file.ProjectID);
                if (project != null)
                {
                    var fileSystem = FileSystemHelper.GetFileSystem(project.RootID);
                    var currentFile = fileSystem.Root.FindItemByID(file.ID) as File;

                    if (currentFile != null)
                    {
                        try
                        {
                            currentFile.WriteContents(contents);
                        }
                        catch (Exception ex)
                        {
                            Console.WriteLine(ex.StackTrace);
                        }
                    }
                }
            }
        }

        private FileSystem CreateFileSystem(Guid rootID)
        {
            LocalStorageProvider provider = new LocalStorageProvider("/Storage/" + rootID);
            FileSystem fileSystem = new FileSystem(provider);

            return fileSystem;
        }
    }
}
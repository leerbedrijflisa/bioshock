using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using Lisa.Storage;

namespace Lisa.Bioshock.Extensions
{
    public static class FileExtensions
    {
        public static string ReadContents(this File file)
        {
            using (var reader = new System.IO.StreamReader(file.InputStream))
            {
                return reader.ReadToEnd();
            }
        }

        public static void WriteContents(this File file, string newContents)
        {
            using (var writer = new System.IO.StreamWriter(file.OutputStream))
            {
                writer.Write(newContents);

                if (writer.BaseStream.CanSeek) 
                {
                    writer.BaseStream.SetLength(newContents.Length);
                }
                
                writer.Flush();
            }
        }
    }
}
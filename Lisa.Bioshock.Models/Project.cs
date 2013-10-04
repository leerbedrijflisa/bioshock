using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations.Schema;
using System.Linq;
using System.Web;

namespace Lisa.Bioshock.Models
{
    public class Project
    {
        public int ID { get; set; }
        public string Name { get; set; }

        public virtual Folder Root { get; set; }
        public bool IsPrivate { get; set; }

        private BioshockContext db = new BioshockContext();

        public Project()
        {
            Root = new Folder(this, Name);
        }

        

    }
}
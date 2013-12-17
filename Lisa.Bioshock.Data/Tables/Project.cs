using System;
using System.Collections.Generic;
using System.ComponentModel;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Lisa.Bioshock.Data.Tables
{
    public class Project
    {
        public Project()
        {
            Created = DateTime.UtcNow;
        }

        [Key, DatabaseGenerated(DatabaseGeneratedOption.Identity)]
        public int ID
        {
            get;
            set;
        }

        public string Name
        {
            get;
            set;
        }

        [DatabaseGenerated(DatabaseGeneratedOption.Identity)]
        public Guid RootID
        {
            get;
            set;
        }

        public Guid LastOpenedFile
        {
            get;
            set;
        }

        public virtual User Owner
        {
            get;
            set;
        }

        public int OwnerID
        {
            get;
            set;
        }

        public DateTime Created
        {
            get;
            set;
        }

        public bool IsDeleted
        {
            get;
            set;
        }
    }
}

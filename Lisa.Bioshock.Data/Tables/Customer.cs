using System.Collections.Generic;
using System.ComponentModel.DataAnnotations.Schema;
using System.Linq;
namespace Lisa.Bioshock.Data.Tables
{
    public class Customer
    {
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

        public string Applications
        {
            get
            {
                string data = string.Empty;
                foreach (var app in RegisteredApplications)
                {
                    data += app + ',';
                }

                if (!string.IsNullOrEmpty(data)) 
                {
                    return data.Trim(',');
                }

                return null;
            }
            set
            {
                if (!string.IsNullOrEmpty(value))
                {
                    RegisteredApplications = value.Split(',').ToList();
                }
            }
        }

        [NotMapped]
        public List<string> RegisteredApplications
        {
            get;
            set;
        }

        public virtual ICollection<User> Users
        {
            get;
            set;
        }

        public Customer()
        {
            RegisteredApplications = new List<string>();
        }
    }
}

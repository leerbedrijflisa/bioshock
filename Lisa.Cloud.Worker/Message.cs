using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Lisa.Cloud.Worker
{
    public class Message
    {
        public string ID { get; set; }
        public int RootID { get; set; }
        public DateTime Time { get; set; }
        public string Action { get; set; }

        public int ProjectID { get; set; }
        public string ProjectName { get; set; }
        
    }
}

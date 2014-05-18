using Lisa.Bioshock.Models;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Net;
using System.Net.Http;
using System.Web.Http;

namespace Lisa.Bioshock.WebApi.Controllers
{
    public class CheatSheetController : ApiController
    {

        // GET api/cheatsheet
        public IHttpActionResult Get()
        {
            return Ok(shortKeys);
        }

        // GET api/cheatsheet/5
        public IHttpActionResult Get(int id)
        {
            var shortKey = shortKeys.FirstOrDefault(s => s.Id == id);
            if (shortKey == null)
            {
                return NotFound();
            }
            return Ok(shortKey);
        }

        // POST api/cheatsheet
        public IHttpActionResult Post([FromBody] ShortKeys shortKey)
        {
            if(shortKey.Key1 != null)
                shortKey.Key1 = shortKey.Key1.ToUpper();
            if(shortKey.Key2 != null)
                shortKey.Key2 = shortKey.Key2.ToUpper();
            if(shortKey.Key3 != null)
                shortKey.Key3 = shortKey.Key3.ToUpper();

            try
            {
                AddShortKey(shortKey);
            } catch(Exception e) 
            {
                return BadRequest();
            }
            
            return CreatedAtRoute("DefaultApi", new { id = shortKey.Id }, shortKey);
        }

        // PUT api/cheatsheet/5
        public IHttpActionResult Put(int id, [FromBody] ShortKeys newShortKey)
        {
            if (CompareShortKey(newShortKey))
            {
                var shortKey = shortKeys.FirstOrDefault(sk => sk.Id == id);
                if (shortKey != null)
                {
                    shortKey = newShortKey;
                    shortKeys.RemoveAll(sk => sk.Id == id);
                    shortKeys.Add(shortKey);
                }
                else
                {
                    return BadRequest();
                }
                return Content(HttpStatusCode.OK, new { shortKey });
            }
            else
            {
                return Ok();
            }
        }

        // DELETE api/cheatsheet/5
        public IHttpActionResult Delete(int id)
        {
            var shortKey = shortKeys.FirstOrDefault(sk => sk.Id == id);
            if (shortKey == null)
            {
                return NotFound();
            }

            shortKeys.Remove(shortKey);
            return Ok();
        }

        private static List<ShortKeys> shortKeys = new List<ShortKeys>() {
            new ShortKeys { Id = 1, Name = "Project beveiligen", Key1 = "Alt", Key2 = "L" },
            new ShortKeys { Id = 2, Name = "Open een file", Key1 = "Alt", Key2 = "O" },
            new ShortKeys { Id = 3, Name = "Upload een bestand", Key1 = "Alt", Key2 = "U" },
            new ShortKeys { Id = 4, Name = "Nieuw bestand aanmaken", Key1 = "Alt", Key2 = "N" },
            new ShortKeys { Id = 5, Name = "Bestanden bewerken", Key1 = "Alt", Key2 = "H" },
            new ShortKeys { Id = 6, Name = "Foutmelding 1", Key1 = "Alt", Key2 = "1" },
            new ShortKeys { Id = 7, Name = "Foutmelding 2", Key1 = "Alt", Key2 = "2" },
            new ShortKeys { Id = 8, Name = "Code scherm, Foutmelding", Key1 = "Alt", Key2 = "3" },
            new ShortKeys { Id = 9, Name = "scherm Code, Waarschuwing", Key1 = "Alt", Key2 = "4" },
            new ShortKeys { Id = 10, Name = "Editor openen/sluiten", Key1 = "Ctrl" },
            new ShortKeys { Id = 11, Name = "Stop huidige actie", Key1 = "Esc" },
            new ShortKeys { Id = 12, Name = "Help", Key1 = "F1" },
        };

        private bool CompareShortKey(ShortKeys shortkey)
        {
            var key = shortKeys.FirstOrDefault(sk => sk.Id == shortkey.Id);
            if(key != null)
            {
                if (key.Name != shortkey.Name)
                    return true;
                if (key.Key1 != shortkey.Key1)
                    return true;
                if (key.Key2 != shortkey.Key2)
                    return true;
                if (key.Key3 != shortkey.Key3)
                    return true;
            }
            return false;
        }

        private void AddShortKey(ShortKeys shortKey)
        {
            var highestShortKey = shortKeys
                .OrderByDescending(sk => sk.Id)
                .ElementAt(0);

            shortKey.Id = highestShortKey.Id + 1;
            shortKeys.Add(shortKey);
        }
    }
}

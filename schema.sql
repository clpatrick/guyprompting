-- Visit log for guyprompting.com. No IP addresses are stored, by design.
CREATE TABLE IF NOT EXISTS hits (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  ts TEXT NOT NULL,            -- ISO-8601 UTC
  path TEXT NOT NULL,          -- e.g. /gatech/
  campaign TEXT,               -- first path segment: gatech, usc, root
  country TEXT, region TEXT, city TEXT,
  asn INTEGER, as_org TEXT,    -- visitor's network (Georgia Tech = AS2637)
  referer_host TEXT,
  ua_class TEXT                -- bot / mobile / desktop
);
CREATE INDEX IF NOT EXISTS hits_ts ON hits(ts);
CREATE INDEX IF NOT EXISTS hits_campaign ON hits(campaign, ts);

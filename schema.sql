CREATE TABLE IF NOT EXISTS pageviews (
    _id INTEGER PRIMARY KEY,
    domain VARCHAR(255),
    path VARCHAR(255),
    count INTEGER,
    UNIQUE(domain, path)
);


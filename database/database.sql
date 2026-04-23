CREATE TABLE pantheon (
    article_id INT PRIMARY KEY,
    full_name TEXT,
    sex TEXT,
    birth_year TEXT,
    city TEXT,
    state TEXT,
    country TEXT,
    continent TEXT,
    latitude TEXT,
    longitude TEXT,
    occupation TEXT,
    industry TEXT,
    domain TEXT,
    article_languages TEXT,
    page_views TEXT,
    average_views TEXT,
    historical_popularity_index TEXT
);

copy pantheon FROM '/database/database.csv' WITH (FORMAT csv, HEADER true, ENCODING 'UTF8');
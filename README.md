# Pantheon Project
Cloud system's project

### Database
1. Pobrać i zainstalować PostgreSQL z oficjalnej strony.
2. Postępować zgodnie z instrukcją instalacji.
3. Następnie stworzyć tabelę za pomocą polecenia SQL
```sql
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
```
4. Skopiować dane z pliku CSV do tabeli wpisując poniższe polecenie w terminalu postgresql odpowiednio podając ścieżkę do pliku csv.
```psql
\copy pantheon FROM 'ścieżka do pliku csv' WITH (FORMAT csv, HEADER true, ENCODING 'UTF8');
```

### Backend

```bash
    cd backend
    node server.js
```

### Frontend
Open file index.html: click twice on the file or live server in VSCode.

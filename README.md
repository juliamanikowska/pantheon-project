# Pantheon Project
Cloud system's project

### Database
1. Download and install PostgreSQL from the official website.
2. Follow the installation instructions.
3. Then create a table using an SQL command:
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
4. Copy the data from the CSV file into the table by entering the following command in the PostgreSQL terminal, making sure to provide the correct path to the CSV file.
```psql
\copy pantheon FROM 'ścieżka do pliku csv' WITH (FORMAT csv, HEADER true, ENCODING 'UTF8');
```
5. In the ```backend/db.js``` file, in the field ```password: 'password' ```, enter the password for your PostgreSQL database.

### Backend

```bash
    cd backend
    npm install
    node server.js
```

### Frontend
Open file index.html: click twice on the file or live server in VSCode.

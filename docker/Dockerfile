FROM postgres:18

RUN apt-get update && apt-get install -y \
    postgresql-18-postgis-3 \
    postgresql-18-pgvector \
    && apt-get clean \
    && rm -rf /var/lib/apt/lists/*

COPY init.sql /docker-entrypoint-initdb.d/

WORKDIR /var/lib/postgresql/data

EXPOSE 5432

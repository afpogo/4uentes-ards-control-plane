-- CR-SST-0134 read-only inventory. SELECT statements only.
SELECT
  count(*) AS total_articles,
  count(p.article_id) AS with_payload,
  count(*) - count(p.article_id) AS without_payload,
  count(f.articulo_id) AS with_filter,
  count(*) - count(f.articulo_id) AS without_filter
FROM articulos a
LEFT JOIN article_payloads p ON p.article_id = a.id
LEFT JOIN filter_articulos f ON f.articulo_id = a.id;

SELECT kind, payload_kind, count(*) AS rows
FROM article_payloads
GROUP BY kind, payload_kind
ORDER BY kind, payload_kind;

SELECT
  (a.url IS NOT NULL AND btrim(a.url) <> '') AS has_url,
  COALESCE(f.type, '<null>') AS filter_type,
  count(*) AS rows
FROM articulos a
LEFT JOIN article_payloads p ON p.article_id = a.id
LEFT JOIN filter_articulos f ON f.articulo_id = a.id
WHERE p.article_id IS NULL
GROUP BY 1, 2
ORDER BY 1, 2;

SELECT
  COALESCE(d.type, '<none>') AS document_type,
  count(DISTINCT a.id) AS articles
FROM articulos a
LEFT JOIN article_payloads p ON p.article_id = a.id
LEFT JOIN article_documents d ON d.article_id = a.id
WHERE p.article_id IS NULL
GROUP BY 1
ORDER BY 2 DESC;


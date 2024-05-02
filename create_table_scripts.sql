CREATE TABLE IF NOT EXISTS public."Contact"
(
    "contactId" character varying COLLATE pg_catalog."default",
    "user" character varying(100) COLLATE pg_catalog."default",
    phone character varying(100) COLLATE pg_catalog."default",
    email character varying(100) COLLATE pg_catalog."default",
    status character varying(100) COLLATE pg_catalog."default",
    organization character varying(100) COLLATE pg_catalog."default",
    role character varying(100) COLLATE pg_catalog."default"
)

TABLESPACE pg_default;

ALTER TABLE IF EXISTS public."Contact"
    OWNER to postgres;
	

-- Table: public.chat

-- DROP TABLE IF EXISTS public.chat;

CREATE TABLE IF NOT EXISTS public.chat
(
    room_name character varying(100) COLLATE pg_catalog."default",
    room_id character varying(100) COLLATE pg_catalog."default",
    "userId" character varying(100) COLLATE pg_catalog."default",
    "userName" character varying(100) COLLATE pg_catalog."default"
)

TABLESPACE pg_default;

ALTER TABLE IF EXISTS public.chat
    OWNER to postgres;
	


-- Table: public.chat_history

-- DROP TABLE IF EXISTS public.chat_history;

CREATE TABLE IF NOT EXISTS public.chat_history
(
    room_id character varying(100) COLLATE pg_catalog."default",
    "userID" character varying(100) COLLATE pg_catalog."default",
    message character varying(1000) COLLATE pg_catalog."default",
    "timestamp" timestamp without time zone
)

TABLESPACE pg_default;

ALTER TABLE IF EXISTS public.chat_history
    OWNER to postgres;

-- Table: public.client_service_request

-- DROP TABLE IF EXISTS public.client_service_request;

CREATE TABLE IF NOT EXISTS public.client_service_request
(
    "requestId" character varying(100) COLLATE pg_catalog."default",
    issue_type character varying(100) COLLATE pg_catalog."default",
    product character varying(100) COLLATE pg_catalog."default",
    subject character varying(100) COLLATE pg_catalog."default",
    description character varying(100) COLLATE pg_catalog."default"
)

TABLESPACE pg_default;

ALTER TABLE IF EXISTS public.client_service_request
    OWNER to postgres;
	
-- Table: public.document

-- DROP TABLE IF EXISTS public.document;

CREATE TABLE IF NOT EXISTS public.document
(
    doc_hash_code character varying(500) COLLATE pg_catalog."default",
    "RequestId" character varying(100) COLLATE pg_catalog."default",
    doc_name character varying(100) COLLATE pg_catalog."default",
    doc_type character varying(100) COLLATE pg_catalog."default",
    "timestamp" timestamp without time zone
)

TABLESPACE pg_default;

ALTER TABLE IF EXISTS public.document
    OWNER to postgres;


-- Table: public.request_details

-- DROP TABLE IF EXISTS public.request_details;

CREATE TABLE IF NOT EXISTS public.request_details
(
    "requestId" character varying(100) COLLATE pg_catalog."default",
    request_name character varying(100) COLLATE pg_catalog."default",
    "Organisation" character varying(100) COLLATE pg_catalog."default",
    status character varying(100) COLLATE pg_catalog."default",
    request_type character varying(100) COLLATE pg_catalog."default",
    "CreatedByUserId" character varying(100) COLLATE pg_catalog."default",
    "timestamp" timestamp without time zone
)

TABLESPACE pg_default;

ALTER TABLE IF EXISTS public.request_details
    OWNER to postgres;

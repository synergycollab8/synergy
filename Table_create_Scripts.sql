-- Table: public.chat

-- DROP TABLE IF EXISTS public.chat;

CREATE TABLE IF NOT EXISTS public.chat
(
    room_name character varying(100) COLLATE pg_catalog."default",
    room_id character varying(100) COLLATE pg_catalog."default",
    "userId" character varying(100) COLLATE pg_catalog."default",
    "userName" character varying(100) COLLATE pg_catalog."default",
    message character varying(100) COLLATE pg_catalog."default",
    messageid character varying(100) COLLATE pg_catalog."default",
    description character varying(1000) COLLATE pg_catalog."default",
    "timestamp" timestamp without time zone,
    CONSTRAINT roomid_unique_constraint UNIQUE (room_id)
)

TABLESPACE pg_default;

ALTER TABLE IF EXISTS public.chat
    OWNER to "pg-synergy";
	
---------

-- Table: public.chat_history

-- DROP TABLE IF EXISTS public.chat_history;

CREATE TABLE IF NOT EXISTS public.chat_history
(
    room_id character varying(100) COLLATE pg_catalog."default",
    "userID" character varying(100) COLLATE pg_catalog."default",
    message character varying(1000) COLLATE pg_catalog."default",
    messageid character varying(100) COLLATE pg_catalog."default",
    description character varying(1000) COLLATE pg_catalog."default",
    "timestamp" timestamp without time zone,
    room_name character varying(100) COLLATE pg_catalog."default",
    CONSTRAINT messageid_unique_constraint UNIQUE (messageid)
)

TABLESPACE pg_default;

ALTER TABLE IF EXISTS public.chat_history
    OWNER to "pg-synergy";
	
	
----------------

-- Table: public.client_service_req_extn

-- DROP TABLE IF EXISTS public.client_service_req_extn;

CREATE TABLE IF NOT EXISTS public.client_service_req_extn
(
    message character varying(1000) COLLATE pg_catalog."default",
    message_from character varying(1000) COLLATE pg_catalog."default",
    "requestId" character varying(100) COLLATE pg_catalog."default",
    date timestamp without time zone,
    messageid character varying(100) COLLATE pg_catalog."default",
    CONSTRAINT messageid_service_unique_constraint UNIQUE (messageid)
)

TABLESPACE pg_default;

ALTER TABLE IF EXISTS public.client_service_req_extn
    OWNER to "pg-synergy";
	
----------

-- Table: public.client_service_request

-- DROP TABLE IF EXISTS public.client_service_request;

CREATE TABLE IF NOT EXISTS public.client_service_request
(
    "requestId" character varying(100) COLLATE pg_catalog."default",
    issue_type character varying(100) COLLATE pg_catalog."default",
    product character varying(100) COLLATE pg_catalog."default",
    subject character varying(100) COLLATE pg_catalog."default",
    description character varying(1000) COLLATE pg_catalog."default",
    date timestamp without time zone,
    message character varying(1000) COLLATE pg_catalog."default",
    created_by character varying(1000) COLLATE pg_catalog."default",
    status character varying(1000) COLLATE pg_catalog."default",
    CONSTRAINT "requestId_unique_constraint" UNIQUE ("requestId")
)

TABLESPACE pg_default;

ALTER TABLE IF EXISTS public.client_service_request
    OWNER to "pg-synergy";

-----------------

-- Table: public.contact

-- DROP TABLE IF EXISTS public.contact;

CREATE TABLE IF NOT EXISTS public.contact
(
    "contactId" character varying(100) COLLATE pg_catalog."default" NOT NULL,
    "user" character varying(100) COLLATE pg_catalog."default",
    phone character varying(100) COLLATE pg_catalog."default",
    email character varying(100) COLLATE pg_catalog."default",
    status character varying(100) COLLATE pg_catalog."default",
    organization character varying(100) COLLATE pg_catalog."default",
    role character varying(100) COLLATE pg_catalog."default",
    CONSTRAINT "contactId_unique_constraint" PRIMARY KEY ("contactId")
)

TABLESPACE pg_default;

ALTER TABLE IF EXISTS public.contact
    OWNER to "pg-synergy";
	
---------------

-- Table: public.document

-- DROP TABLE IF EXISTS public.document;

CREATE TABLE IF NOT EXISTS public.document
(
    doc_hash_code character varying(100) COLLATE pg_catalog."default",
    "requestId" character varying(100) COLLATE pg_catalog."default",
    doc_name character varying(1000) COLLATE pg_catalog."default",
    doc_type character varying(1000) COLLATE pg_catalog."default",
    "timestamp" time without time zone,
    CONSTRAINT doc_hashcode_unique_constraint UNIQUE (doc_hash_code)
)

TABLESPACE pg_default;

ALTER TABLE IF EXISTS public.document
    OWNER to "pg-synergy";
	
-----------------------

-- Table: public.request_details

-- DROP TABLE IF EXISTS public.request_details;

CREATE TABLE IF NOT EXISTS public.request_details
(
    "requestId" character varying(100) COLLATE pg_catalog."default",
    request_name character varying(100) COLLATE pg_catalog."default",
    organisation character varying(100) COLLATE pg_catalog."default",
    status character varying(100) COLLATE pg_catalog."default",
    request_type character varying(100) COLLATE pg_catalog."default",
    "createdbyuserId" character varying(100) COLLATE pg_catalog."default",
    "timestamp" timestamp without time zone,
    CONSTRAINT "reqdetails_requestId_unique_constraint" UNIQUE ("requestId")
)

TABLESPACE pg_default;

ALTER TABLE IF EXISTS public.request_details
    OWNER to "pg-synergy";
-----------------------------



INSERT INTO public.contact(
	"contactId", "user", phone, email, status, organization, role)
	VALUES (?, ?, ?, ?, ?, ?, ?);
	

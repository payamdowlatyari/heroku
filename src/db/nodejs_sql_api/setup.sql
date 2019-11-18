DROP DATABASE IF EXISTS 4YOU;
CREATE DATABASE IF NOT EXISTS 4YOU;

USE 4YOU;

CREATE TABLE User(
  user_id VARCHAR(8) NOT NULL UNIQUE,
  display_name varchar(32) NOT NULL UNIQUE,
  email VARCHAR(320) NOT NULL UNIQUE,
  pswd VARCHAR(320) NOT NULL,
  PRIMARY KEY ( user_id )
);

CREATE TABLE Document(
  document_id VARCHAR(12) NOT NULL UNIQUE,
  delta_content JSON NOT NULL,
  delta_change JSON NOT NULL,
  PRIMARY KEY ( document_id )
);

CREATE TABLE DocumentMeta(
  documentmeta_id VARCHAR(12) NOT NULL UNIQUE,
  created TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  last_change TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  title VARCHAR(128) NOT NULL,
  fork_id VARCHAR(12) UNIQUE,
  creator_id VARCHaR(8) NOT NULL,
  document_id VARCHAR(12) NOT NULL UNIQUE,
  PRIMARY KEY ( documentmeta_id ),
  FOREIGN KEY ( creator_id )
      REFERENCES User( user_id ) 
      ON DELETE CASCADE,
  FOREIGN KEY ( document_id )
      REFERENCES Document( document_id )
      ON DELETE CASCADE
);

CREATE TABLE Fork(
  fork_id VARCHAR(12) NOT NULL UNIQUE,
  last_pull TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  original_doc_meta_id VARCHAR(12) NOT NULL,
  PRIMARY KEY ( fork_id ),
  FOREIGN KEY ( original_doc_meta_id )
      REFERENCES DocumentMeta( documentmeta_id )
      ON DELETE CASCADE
);

ALTER TABLE DocumentMeta ADD FOREIGN KEY ( fork_id )
    REFERENCES Fork( fork_id )
    ON DELETE SET NULL;

CREATE TABLE Pull(
  pull_id VARCHAR(12) NOT NULL UNIQUE,
  created TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  fork_id VARCHAR(12) NOT NULL,
  PRIMARY KEY ( pull_id ),
  FOREIGN KEY ( fork_id )
      REFERENCES Fork( fork_id )
      ON DELETE CASCADE
);

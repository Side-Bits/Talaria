-- TABLES
CREATE TABLE IF NOT EXISTS roles (
    id_role     BIGINT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
    name        VARCHAR(64) NOT NULL UNIQUE
);

CREATE TABLE IF NOT EXISTS statuses (
    id_status   BIGINT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
    name        VARCHAR(64) NOT NULL UNIQUE
);

CREATE TABLE IF NOT EXISTS users (
    id_user     BIGINT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
    id_role     BIGINT REFERENCES roles(id_role) ON DELETE SET NULL,
    username    VARCHAR(32) NOT NULL UNIQUE,
    email       VARCHAR(254) NOT NULL UNIQUE,
    password    VARCHAR(255) NOT NULL,
    created_at  TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    last_login  TIMESTAMPTZ,
    terms       BOOLEAN NOT NULL
);

CREATE TABLE IF NOT EXISTS session_token (
    id_user     BIGINT PRIMARY KEY REFERENCES users(id_user) ON DELETE CASCADE,
    token       VARCHAR(255) NOT NULL,
    created_at  TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    expires_at  TIMESTAMPTZ NOT NULL
);

CREATE TABLE IF NOT EXISTS clients (
    id_user     BIGINT PRIMARY KEY REFERENCES users(id_user) ON DELETE CASCADE,
    name        VARCHAR(64) NOT NULL,
    surname1    VARCHAR(64) NOT NULL,
    surname2    VARCHAR(64),
    photo       TEXT
);

CREATE TABLE IF NOT EXISTS travels (
    id_travel   BIGINT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
    name        VARCHAR(64) NOT NULL,
    start_date  DATE NOT NULL,
    end_date    DATE NOT NULL,
    id_status   BIGINT REFERENCES statuses(id_status) ON DELETE SET NULL,
    CONSTRAINT chk_travel_dates CHECK (end_date >= start_date)
);

CREATE TABLE IF NOT EXISTS activities (
    id_activity BIGINT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
    id_travel   BIGINT NOT NULL REFERENCES travels(id_travel) ON DELETE CASCADE,
    name        VARCHAR(64) NOT NULL,
    description TEXT,
    location    VARCHAR(128),
    start_date  TIMESTAMPTZ NOT NULL,
    end_date    TIMESTAMPTZ NOT NULL,
    price       NUMERIC(10,2) DEFAULT 0,
    id_status   BIGINT REFERENCES statuses(id_status) ON DELETE SET NULL,
    CONSTRAINT chk_activity_dates CHECK (end_date >= start_date)
);

CREATE TABLE IF NOT EXISTS clients_travels (
    id_user     BIGINT REFERENCES clients(id_user) ON DELETE CASCADE,
    id_travel   BIGINT NOT NULL REFERENCES travels(id_travel) ON DELETE CASCADE,
    PRIMARY KEY (id_user, id_travel)
);

CREATE TABLE IF NOT EXISTS clients_activities (
    id_user     BIGINT REFERENCES clients(id_user) ON DELETE CASCADE,
    id_activity BIGINT NOT NULL REFERENCES activities(id_activity) ON DELETE CASCADE,
    PRIMARY KEY (id_user, id_activity)
);

-- Indexes
CREATE INDEX IF NOT EXISTS idx_activities_travel             ON activities(id_travel);
CREATE INDEX IF NOT EXISTS idx_clients_travels_user          ON clients_travels(id_user);
CREATE INDEX IF NOT EXISTS idx_clients_travels_travel        ON clients_travels(id_travel);
CREATE INDEX IF NOT EXISTS idx_clients_activities_user       ON clients_activities(id_user);
CREATE INDEX IF NOT EXISTS idx_clients_activities_activity   ON clients_activities(id_activity);


-- INSERTS
INSERT INTO roles (name)
VALUES
    ('Admin'),
    ('Client');

INSERT INTO statuses (name)
VALUES
    ('Active'),
    ('Inactive'),
    ('Cancelled'),
    ('Finished');

INSERT INTO users (
    id_role,
    username,
    email,
    password,
    terms
)
VALUES (
    2,
    'jvenecia',
    'jvenecia@email.com',
    'hashed_password_example',
    TRUE
);

INSERT INTO clients (
    id_user,
    name,
    surname1,
    surname2,
    photo
)
VALUES (
    2,
    'Juan',
    'Pérez',
    'García',
    'venecia.jpg'
);

INSERT INTO travels (name, start_date, end_date, id_status) VALUES
('Viaje a Venecia','2026-05-01','2026-05-04',1),
('Viaje a Roma','2026-06-01','2026-06-05',1),
('Viaje a París','2026-07-10','2026-07-14',1),
('Viaje a Berlín','2026-08-01','2026-08-04',1),
('Viaje a Lisboa','2026-09-05','2026-09-08',1),
('Viaje a Praga','2026-10-01','2026-10-04',1),
('Viaje a Viena','2026-11-02','2026-11-05',1),
('Viaje a Ámsterdam','2026-12-01','2026-12-04',1),
('Viaje a Bruselas','2027-01-10','2027-01-13',1),
('Viaje a Londres','2027-02-01','2027-02-05',1),
('Viaje a Dublín','2027-03-01','2027-03-04',1),
('Viaje a Madrid','2027-04-01','2027-04-04',1),
('Viaje a Barcelona','2027-05-01','2027-05-04',1),
('Viaje a Sevilla','2027-06-01','2027-06-04',1),
('Viaje a Granada','2027-07-01','2027-07-04',1),
('Viaje a Atenas','2027-08-01','2027-08-04',1),
('Viaje a Estambul','2027-09-01','2027-09-05',1),
('Viaje a Budapest','2027-10-01','2027-10-04',1),
('Viaje a Cracovia','2027-11-01','2027-11-04',1),
('Viaje a Estocolmo','2027-12-01','2027-12-04',1);

INSERT INTO clients_travels
SELECT
    2,
    id_travel
FROM travels;

INSERT INTO activities (
    id_travel,
    name,
    description,
    location,
    start_date,
    end_date,
    price,
    id_status
) VALUES
(1,'Llegada a Venecia','Check-in y primer paseo','Venecia','2026-05-01 10:00','2026-05-01 11:30',0,1),
(1,'Plaza San Marcos','Visita guiada','Plaza San Marcos','2026-05-01 12:00','2026-05-01 13:30',20,1),
(1,'Basílica San Marcos','Visita cultural','Basílica','2026-05-01 14:30','2026-05-01 15:30',15,1),
(2,'Palacio Ducal','Museo','Palacio Ducal','2026-05-01 16:00','2026-05-01 18:00',25,1),
(2,'Cena típica','Restaurante local','Venecia','2026-05-01 20:00','2026-05-01 22:00',30,1),
(2,'Paseo en góndola','Canales','Gran Canal','2026-05-02 09:30','2026-05-02 10:30',40,1),
(2,'Murano','Cristalerías','Murano','2026-05-02 11:30','2026-05-02 13:30',18,1),
(2,'Burano','Casas de colores','Burano','2026-05-02 14:30','2026-05-02 17:00',18,1),
(2,'Fotografía urbana','Paseo libre','Venecia','2026-05-02 17:30','2026-05-02 18:30',0,1),
(2,'Cena junto al canal','Restaurante','Venecia','2026-05-02 20:00','2026-05-02 22:00',35,1),
(2,'Galería Accademia','Museo de arte','Accademia','2026-05-03 10:00','2026-05-03 12:00',16,1),
(2,'Mercado de Rialto','Visita gastronómica','Rialto','2026-05-03 12:30','2026-05-03 13:30',10,1),
(2,'Puente de Rialto','Visita libre','Rialto','2026-05-03 13:45','2026-05-03 14:30',0,1),
(2,'Cicchetti','Tapeo veneciano','Venecia','2026-05-03 18:00','2026-05-03 19:30',20,1),
(2,'Concierto clásico','Música en vivo','Venecia','2026-05-03 21:00','2026-05-03 22:30',30,1),
(2,'Desayuno','Café local','Venecia','2026-05-04 08:30','2026-05-04 09:30',12,1),
(2,'Compras','Souvenirs','Venecia','2026-05-04 10:00','2026-05-04 12:00',0,1),
(2,'Paseo final','Último recorrido','Venecia','2026-05-04 12:30','2026-05-04 13:30',0,1),
(2,'Check-out','Salida del hotel','Venecia','2026-05-04 14:00','2026-05-04 15:00',0,1),
(2,'Salida','Viaje de regreso','Aeropuerto','2026-05-04 17:00','2026-05-04 19:00',0,1);
-- TABLES

CREATE TABLE users (
    id_user VARCHAR(36) PRIMARY KEY,
    id_role VARCHAR(36),
    username VARCHAR(16) NOT NULL UNIQUE,
    email VARCHAR(32) NOT NULL UNIQUE,
    password VARCHAR(156) NOT NULL,
    created_at DATE NOT NULL DEFAULT CURRENT_DATE,
    last_login DATE,
    terms BOOLEAN NOT NULL
);

CREATE TABLE session_token (
    id_user VARCHAR(36) PRIMARY KEY,
    token CHAR(156) NOT NULL,
    created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    expires_at TIMESTAMPTZ NOT NULL,
    CONSTRAINT fk_session_user
        FOREIGN KEY (id_user)
        REFERENCES users(id_user)
        ON DELETE CASCADE
);

CREATE TABLE clients (
    id_user VARCHAR(36) PRIMARY KEY,
    name VARCHAR(16) NOT NULL,
    surname1 VARCHAR(32) NOT NULL,
    surname2 VARCHAR(32),
    photo VARCHAR(255),
    CONSTRAINT fk_client_user
        FOREIGN KEY (id_user)
        REFERENCES users(id_user)
        ON DELETE CASCADE
);

CREATE TABLE travels (
    id_travel VARCHAR(36) PRIMARY KEY,
    name VARCHAR(64) NOT NULL,
    start_date DATE NOT NULL,
    end_date DATE NOT NULL,
    id_status VARCHAR(36)
);

CREATE TABLE activities (
    id_activity VARCHAR(36) PRIMARY KEY,
    id_travel VARCHAR(36) NOT NULL,
    name VARCHAR(64) NOT NULL,
    description TEXT,
    location VARCHAR(128),
    start_date TIMESTAMP NOT NULL,
    end_date TIMESTAMP NOT NULL,
    price NUMERIC(10,2),
    id_status VARCHAR(36),
    CONSTRAINT fk_activity_travel
        FOREIGN KEY (id_travel)
        REFERENCES travels(id_travel)
        ON DELETE CASCADE
);

CREATE TABLE clients_travels (
    id_user VARCHAR(36),
    id_travel VARCHAR(36),
    PRIMARY KEY (id_user, id_travel),
    CONSTRAINT fk_ct_user
        FOREIGN KEY (id_user)
        REFERENCES clients(id_user)
        ON DELETE CASCADE,
    CONSTRAINT fk_ct_travel
        FOREIGN KEY (id_travel)
        REFERENCES travels(id_travel)
        ON DELETE CASCADE
);

CREATE TABLE clients_activities (
    id_user VARCHAR(36),
    id_activity VARCHAR(36),
    PRIMARY KEY (id_user, id_activity),
    CONSTRAINT fk_ca_user
        FOREIGN KEY (id_user)
        REFERENCES clients(id_user)
        ON DELETE CASCADE,
    CONSTRAINT fk_ca_activity
        FOREIGN KEY (id_activity)
        REFERENCES activities(id_activity)
        ON DELETE CASCADE
);


-- INSERTS


INSERT INTO users (
    id_user, id_role, username, email, password, created_at, terms
) VALUES (
    '550e8400-e29b-41d4-a716-446655440000',
    NULL,
    'jvenecia',
    'jvenecia@email.com',
    'hashed_password_example',
    CURRENT_DATE,
    TRUE
);

INSERT INTO clients (
    id_user, name, surname1, surname2, photo
) VALUES (
    '550e8400-e29b-41d4-a716-446655440000',
    'Juan',
    'Pérez',
    'García',
    'venecia.jpg'
);

INSERT INTO travels (
    id_travel, name, start_date, end_date, id_status
) VALUES (
    'c9bf9e57-1685-4c89-bafb-ff5af830be8a',
    'Viaje a Venecia',
    '2026-05-01',
    '2026-05-04',
    'ACTIVE'
);

INSERT INTO travels VALUES
('11111111-1111-1111-1111-111111111111','Viaje a Roma','2026-06-01','2026-06-05','ACTIVE'),
('22222222-2222-2222-2222-222222222222','Viaje a París','2026-07-10','2026-07-14','ACTIVE'),
('33333333-3333-3333-3333-333333333333','Viaje a Berlín','2026-08-01','2026-08-04','ACTIVE'),
('44444444-4444-4444-4444-444444444444','Viaje a Lisboa','2026-09-05','2026-09-08','ACTIVE'),
('55555555-5555-5555-5555-555555555555','Viaje a Praga','2026-10-01','2026-10-04','ACTIVE'),
('66666666-6666-6666-6666-666666666666','Viaje a Viena','2026-11-02','2026-11-05','ACTIVE'),
('77777777-7777-7777-7777-777777777777','Viaje a Ámsterdam','2026-12-01','2026-12-04','ACTIVE'),
('88888888-8888-8888-8888-888888888888','Viaje a Bruselas','2027-01-10','2027-01-13','ACTIVE'),
('99999999-9999-9999-9999-999999999999','Viaje a Londres','2027-02-01','2027-02-05','ACTIVE'),
('aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa','Viaje a Dublín','2027-03-01','2027-03-04','ACTIVE'),
('bbbbbbbb-bbbb-bbbb-bbbb-bbbbbbbbbbbb','Viaje a Madrid','2027-04-01','2027-04-04','ACTIVE'),
('cccccccc-cccc-cccc-cccc-cccccccccccc','Viaje a Barcelona','2027-05-01','2027-05-04','ACTIVE'),
('dddddddd-dddd-dddd-dddd-dddddddddddd','Viaje a Sevilla','2027-06-01','2027-06-04','ACTIVE'),
('eeeeeeee-eeee-eeee-eeee-eeeeeeeeeeee','Viaje a Granada','2027-07-01','2027-07-04','ACTIVE'),
('ffffffff-ffff-ffff-ffff-ffffffffffff','Viaje a Atenas','2027-08-01','2027-08-04','ACTIVE'),
('12121212-1212-1212-1212-121212121212','Viaje a Estambul','2027-09-01','2027-09-05','ACTIVE'),
('13131313-1313-1313-1313-131313131313','Viaje a Budapest','2027-10-01','2027-10-04','ACTIVE'),
('14141414-1414-1414-1414-141414141414','Viaje a Cracovia','2027-11-01','2027-11-04','ACTIVE'),
('15151515-1515-1515-1515-151515151515','Viaje a Estocolmo','2027-12-01','2027-12-04','ACTIVE');

INSERT INTO clients_travels
SELECT
    '550e8400-e29b-41d4-a716-446655440000',
    id_travel
FROM travels;

INSERT INTO activities (
    id_activity, id_travel, name, description, location,
    start_date, end_date, price, id_status
) VALUES
('a1','c9bf9e57-1685-4c89-bafb-ff5af830be8a','Llegada a Venecia','Check-in y primer paseo','Venecia','2026-05-01 10:00','2026-05-01 11:30',0,'ACTIVE'),
('a2','c9bf9e57-1685-4c89-bafb-ff5af830be8a','Plaza San Marcos','Visita guiada','Plaza San Marcos','2026-05-01 12:00','2026-05-01 13:30',20,'ACTIVE'),
('a3','c9bf9e57-1685-4c89-bafb-ff5af830be8a','Basílica San Marcos','Visita cultural','Basílica','2026-05-01 14:30','2026-05-01 15:30',15,'ACTIVE'),
('a4','c9bf9e57-1685-4c89-bafb-ff5af830be8a','Palacio Ducal','Museo','Palacio Ducal','2026-05-01 16:00','2026-05-01 18:00',25,'ACTIVE'),
('a5','c9bf9e57-1685-4c89-bafb-ff5af830be8a','Cena típica','Restaurante local','Venecia','2026-05-01 20:00','2026-05-01 22:00',30,'ACTIVE'),
('a6','c9bf9e57-1685-4c89-bafb-ff5af830be8a','Paseo en góndola','Canales','Gran Canal','2026-05-02 09:30','2026-05-02 10:30',40,'ACTIVE'),
('a7','c9bf9e57-1685-4c89-bafb-ff5af830be8a','Murano','Cristalerías','Murano','2026-05-02 11:30','2026-05-02 13:30',18,'ACTIVE'),
('a8','c9bf9e57-1685-4c89-bafb-ff5af830be8a','Burano','Casas de colores','Burano','2026-05-02 14:30','2026-05-02 17:00',18,'ACTIVE'),
('a9','c9bf9e57-1685-4c89-bafb-ff5af830be8a','Fotografía urbana','Paseo libre','Venecia','2026-05-02 17:30','2026-05-02 18:30',0,'ACTIVE'),
('a10','c9bf9e57-1685-4c89-bafb-ff5af830be8a','Cena junto al canal','Restaurante','Venecia','2026-05-02 20:00','2026-05-02 22:00',35,'ACTIVE'),
('a11','c9bf9e57-1685-4c89-bafb-ff5af830be8a','Galería Accademia','Museo de arte','Accademia','2026-05-03 10:00','2026-05-03 12:00',16,'ACTIVE'),
('a12','c9bf9e57-1685-4c89-bafb-ff5af830be8a','Mercado de Rialto','Visita gastronómica','Rialto','2026-05-03 12:30','2026-05-03 13:30',10,'ACTIVE'),
('a13','c9bf9e57-1685-4c89-bafb-ff5af830be8a','Puente de Rialto','Visita libre','Rialto','2026-05-03 13:45','2026-05-03 14:30',0,'ACTIVE'),
('a14','c9bf9e57-1685-4c89-bafb-ff5af830be8a','Cicchetti','Tapeo veneciano','Venecia','2026-05-03 18:00','2026-05-03 19:30',20,'ACTIVE'),
('a15','c9bf9e57-1685-4c89-bafb-ff5af830be8a','Concierto clásico','Música en vivo','Venecia','2026-05-03 21:00','2026-05-03 22:30',30,'ACTIVE'),
('a16','c9bf9e57-1685-4c89-bafb-ff5af830be8a','Desayuno','Café local','Venecia','2026-05-04 08:30','2026-05-04 09:30',12,'ACTIVE'),
('a17','c9bf9e57-1685-4c89-bafb-ff5af830be8a','Compras','Souvenirs','Venecia','2026-05-04 10:00','2026-05-04 12:00',0,'ACTIVE'),
('a18','c9bf9e57-1685-4c89-bafb-ff5af830be8a','Paseo final','Último recorrido','Venecia','2026-05-04 12:30','2026-05-04 13:30',0,'ACTIVE'),
('a19','c9bf9e57-1685-4c89-bafb-ff5af830be8a','Check-out','Salida del hotel','Venecia','2026-05-04 14:00','2026-05-04 15:00',0,'ACTIVE'),
('a20','c9bf9e57-1685-4c89-bafb-ff5af830be8a','Salida','Viaje de regreso','Aeropuerto','2026-05-04 17:00','2026-05-04 19:00',0,'ACTIVE');


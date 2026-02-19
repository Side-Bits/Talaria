-- TABLES
CREATE EXTENSION IF NOT EXISTS "pgcrypto";

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
    id_travel UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name VARCHAR(64) NOT NULL,
    start_date DATE NOT NULL,
    end_date DATE NOT NULL,
    id_status VARCHAR(36)
);

CREATE TABLE activities (
    id_activity UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    id_travel UUID NOT NULL,
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
    id_travel UUID NOT NULL,
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
    id_activity UUID NOT NULL,
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

INSERT INTO travels (id_travel, name, start_date, end_date, id_status) VALUES 
    ('16fc20c4-ad32-48f0-99c6-c2d866742810', 'Viaje a Roma', '2026-06-01', '2026-06-05', 'ACTIVE'),
    ('80a51d4f-d581-476e-bff9-e301ef5dc58d', 'Viaje a París', '2026-07-10', '2026-07-14', 'ACTIVE'),
    ('30bae467-4a20-49df-a65b-34b345658c18', 'Viaje a Berlín', '2026-08-01', '2026-08-04', 'ACTIVE'),
    ('b6d46a2e-7623-4fc4-93d4-d39b16c27061', 'Viaje a Lisboa', '2026-09-05', '2026-09-08', 'ACTIVE'),
    ('bea0f224-b384-4866-ab5f-4d39a754a545', 'Viaje a Praga', '2026-10-01', '2026-10-04', 'ACTIVE'),
    ('b11dad51-d293-4de3-9985-4f0d05d703cc', 'Viaje a Viena', '2026-11-02', '2026-11-05', 'ACTIVE'),
    ('2ffdd9c9-d1be-4f96-9865-164e37f2cab3', 'Viaje a Ámsterdam', '2026-12-01', '2026-12-04', 'ACTIVE'),
    ('f695e769-ac95-4c19-8668-909d20f4f5ad', 'Viaje a Bruselas', '2027-01-10', '2027-01-13', 'ACTIVE'),
    ('238d55c7-c069-4108-b24d-34ccb84554af', 'Viaje a Londres', '2027-02-01', '2027-02-05', 'ACTIVE'),
    ('d0848591-219b-4fcd-9bb9-eee439cca2ca', 'Viaje a Dublín', '2027-03-01', '2027-03-04', 'ACTIVE'),
    ('1159f9b7-225a-4e23-a92c-78c9d6d9385d', 'Viaje a Madrid', '2027-04-01', '2027-04-04', 'ACTIVE'),
    ('6652f361-4235-4c6e-9f70-96d21edcce80', 'Viaje a Barcelona', '2027-05-01', '2027-05-04', 'ACTIVE'),
    ('8247523e-893b-46df-b69f-b552794a9ead', 'Viaje a Sevilla', '2027-06-01', '2027-06-04', 'ACTIVE'),
    ('bd760ecd-1b0d-4d6b-9f93-8e9edfb8001f', 'Viaje a Granada', '2027-07-01', '2027-07-04', 'ACTIVE'),
    ('e13118cf-2289-43df-bcca-92449efee702', 'Viaje a Atenas', '2027-08-01', '2027-08-04', 'ACTIVE'),
    ('009ef2b8-36db-4152-b6fb-7c56f85493e2', 'Viaje a Estambul', '2027-09-01', '2027-09-05', 'ACTIVE'),
    ('59bb24e2-9fe2-46d0-bafd-2a811e1a95a3', 'Viaje a Budapest', '2027-10-01', '2027-10-04', 'ACTIVE'),
    ('da6166fd-9763-404a-ae68-c6b25cf09880', 'Viaje a Cracovia', '2027-11-01', '2027-11-04', 'ACTIVE'),
    ('e70852f1-23ae-4316-b05f-4486b868c1d8', 'Viaje a Estocolmo', '2027-12-01', '2027-12-04', 'ACTIVE');

INSERT INTO clients_travels
SELECT
    '16fc20c4-ad32-48f0-99c6-c2d866742810',
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


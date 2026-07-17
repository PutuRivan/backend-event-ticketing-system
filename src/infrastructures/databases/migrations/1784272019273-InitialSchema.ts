import { MigrationInterface, QueryRunner } from "typeorm";

export class InitialSchema1784272019273 implements MigrationInterface {
    name = 'InitialSchema1752820000000';

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`
            CREATE TYPE user_role AS ENUM (
            'ADMIN',
            'USER'
            );
        `);

        await queryRunner.query(`
            CREATE TYPE order_status AS ENUM (
            'PENDING',
            'PAID',
            'CANCELLED',
            'EXPIRED'
            );
        `);

        await queryRunner.query(`
            CREATE TABLE users (
            id UUID PRIMARY KEY,

            name VARCHAR(255),
            email VARCHAR(255) NOT NULL UNIQUE,
            password VARCHAR(255),

            role user_role NOT NULL DEFAULT 'USER',

            created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
            updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
            );
        `);

        await queryRunner.query(`
            CREATE TABLE event_categories (
            id UUID PRIMARY KEY,

            name VARCHAR(255) NOT NULL,
            description TEXT,

            created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
            updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
            );
        `);

        await queryRunner.query(`
            CREATE INDEX idx_event_categories_name
            ON event_categories (name);
        `);

        await queryRunner.query(`
            CREATE TABLE events (
            id UUID PRIMARY KEY,

            category_id UUID NOT NULL,

            title VARCHAR(255) NOT NULL,
            description TEXT,

            location VARCHAR(255),

            event_date TIMESTAMP NOT NULL,

            ticket_price DECIMAL(12,2) NOT NULL,
            quota INTEGER NOT NULL,

            published BOOLEAN NOT NULL DEFAULT FALSE,

            created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
            updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,

            CONSTRAINT fk_events_category
                FOREIGN KEY (category_id)
                REFERENCES event_categories(id)
                ON DELETE RESTRICT
                ON UPDATE CASCADE
            );
        `);

        await queryRunner.query(`
            CREATE INDEX idx_events_category
            ON events (category_id);
        `);

        await queryRunner.query(`
            CREATE INDEX idx_events_title
            ON events (title);
        `);

        await queryRunner.query(`
            CREATE INDEX idx_events_event_date
            ON events (event_date);
        `);

        await queryRunner.query(`
            CREATE INDEX idx_events_published
            ON events (published);
        `);

        await queryRunner.query(`
            CREATE TABLE orders (
            id UUID PRIMARY KEY,

            user_id UUID NOT NULL,
            event_id UUID NOT NULL,

            total_price DECIMAL(12,2) NOT NULL,

            status order_status NOT NULL DEFAULT 'PENDING',

            expired_at TIMESTAMP,
            paid_at TIMESTAMP,

            created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
            updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,

            CONSTRAINT fk_orders_user
                FOREIGN KEY (user_id)
                REFERENCES users(id)
                ON DELETE RESTRICT
                ON UPDATE CASCADE,

            CONSTRAINT fk_orders_event
                FOREIGN KEY (event_id)
                REFERENCES events(id)
                ON DELETE RESTRICT
                ON UPDATE CASCADE
            );
        `);

        await queryRunner.query(`
            CREATE INDEX idx_orders_user
            ON orders (user_id);
        `);

        await queryRunner.query(`
            CREATE INDEX idx_orders_event
            ON orders (event_id);
        `);

        await queryRunner.query(`
            CREATE INDEX idx_orders_status
            ON orders (status);
        `);

        await queryRunner.query(`
            CREATE INDEX idx_orders_expired_at
            ON orders (expired_at);
        `);

        await queryRunner.query(`
            CREATE INDEX idx_orders_created_at
            ON orders (created_at);
        `);

        await queryRunner.query(`
            CREATE TABLE tickets (
            id UUID PRIMARY KEY,

            order_id UUID NOT NULL,

            ticket_number VARCHAR(100) NOT NULL UNIQUE,

            qr_code_path VARCHAR(500),
            pdf_path VARCHAR(500),

            created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,

            CONSTRAINT fk_tickets_order
                FOREIGN KEY (order_id)
                REFERENCES orders(id)
                ON DELETE RESTRICT
                ON UPDATE CASCADE
            );
        `);

        await queryRunner.query(`
            CREATE INDEX idx_tickets_order
            ON tickets (order_id);
        `);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`DROP TABLE IF EXISTS tickets CASCADE;`);
        await queryRunner.query(`DROP TABLE IF EXISTS orders CASCADE;`);
        await queryRunner.query(`DROP TABLE IF EXISTS events CASCADE;`);
        await queryRunner.query(`DROP TABLE IF EXISTS event_categories CASCADE;`);
        await queryRunner.query(`DROP TABLE IF EXISTS users CASCADE;`);

        await queryRunner.query(`DROP TYPE IF EXISTS order_status CASCADE;`);
        await queryRunner.query(`DROP TYPE IF EXISTS user_role CASCADE;`);
    }

}

CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

CREATE TABLE accounts (
	id uuid DEFAULT uuid_generate_v4 (),
	email TEXT NOT NULL,
	password TEXT NOT NULL,
	full_name TEXT NOT NULL,
	tel_num TEXT NOT NULL,
	address TEXT,
	dob DATE,
	cart_qty INT DEFAULT 0,
	ava_url TEXT DEFAULT 'https://miro.medium.com/max/720/1*W35QUSvGpcLuxPo3SRTH4w.png',
	is_admin BOOLEAN DEFAULT false,
	created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
	CONSTRAINT accounts_pkey PRIMARY KEY (id)
);

CREATE TABLE products (
	id uuid DEFAULT uuid_generate_v4 (),
	prod_name TEXT NOT NULL,
	price INT NOT NULL,
	image_url TEXT[] DEFAULT '{}',
	created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
	description TEXT,
	views INT DEFAULT 0,
	stock INT DEFAULT 100,
	sold INT DEFAULT 0,
	tags TEXT,
	CONSTRAINT products_pkey PRIMARY KEY (id)
);

CREATE TABLE carts (
	id uuid DEFAULT uuid_generate_v4 (),
	acc_id uuid NOT NULL,
	created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
	CONSTRAINT carts_pkey PRIMARY KEY (id),
	CONSTRAINT carts_fk1 FOREIGN KEY (acc_id) REFERENCES accounts (id) ON DELETE CASCADE
);

CREATE TABLE cart_items (
	id uuid DEFAULT uuid_generate_v4 (),
	prod_id uuid NOT NULL,
	quantity INT NOT NULL DEFAULT 1,
	cart_id uuid NOT NULL,
	created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
	CONSTRAINT cart_items_pkey PRIMARY KEY (id),
	CONSTRAINT cart_items_fk1 FOREIGN KEY (prod_id) REFERENCES products (id) ON DELETE CASCADE,
	CONSTRAINT cart_items_fk2 FOREIGN KEY (cart_id) REFERENCES carts (id) ON DELETE CASCADE
);

CREATE TABLE orders (
	id uuid DEFAULT uuid_generate_v4 (),
	acc_id uuid NOT NULL,
	created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
	CONSTRAINT orders_pkey PRIMARY KEY (id),
	CONSTRAINT orders_fk1 FOREIGN KEY (acc_id) REFERENCES accounts (id) ON DELETE CASCADE
);

CREATE TABLE order_items (
	id uuid DEFAULT uuid_generate_v4 (),
	order_id uuid NOT NULL,
	prod_id uuid NOT NULL,
	quantity INT NOT NULL DEFAULT 1,
	created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
	CONSTRAINT order_items_pkey PRIMARY KEY (id),
	CONSTRAINT order_items_fk1 FOREIGN KEY (order_id) REFERENCES orders (id) ON DELETE CASCADE,
	CONSTRAINT order_items_fk2 FOREIGN KEY (prod_id) REFERENCES products (id) ON DELETE CASCADE
);

CREATE TABLE comments (
	id uuid DEFAULT uuid_generate_v4 (),
	acc_id uuid NOT NULL,
	prod_id uuid NOT NULL,
	content TEXT NOT NULL,
	created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
	CONSTRAINT comments_pkey PRIMARY KEY (id),
	CONSTRAINT comments_fk1 FOREIGN KEY (acc_id) REFERENCES accounts (id) ON DELETE CASCADE,
	CONSTRAINT comments_fk2 FOREIGN KEY (prod_id) REFERENCES products (id) ON DELETE CASCADE
);
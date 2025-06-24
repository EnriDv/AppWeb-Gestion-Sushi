-- 1. Insertar un Usuario Registrado
-- NOTA: En una aplicación real, la contraseña ('password123') debe ser hasheada (ej. usando bcrypt) antes de almacenarse.
INSERT INTO users (name, phone_number, email, password, address) VALUES
('Juan Perez', '70012345', 'juan.perez@example.com', 'hashed_password_example_123', 'Av. Beni #123, Santa Cruz de la Sierra');

-- 2. Insertar Platos en la Tabla 'dishes'

-- Categoría: MAKI
INSERT INTO dishes (name, description, price, image_url, category) VALUES
('SPICY TUNA MAKI', 'A tantalizing blend of spicy tuna, cucumber, and avocado, harmoniously rolled in nori and seasoned rice.', 5.00, 'url_to_spicy_tuna_maki_image.jpg', 'MAKI'),
('MANGO MAKI', 'Tempura-fried shrimp, cucumber, and cream cheese embrace a center of fresh avocado, delivering a satisfying contrast of textures.', 5.00, 'url_to_mango_maki_image.jpg', 'MAKI'),
('SALMON MAKI', 'Shiitake mushrooms, avocado, and pickled daikon radish nestle within a roll of seasoned rice, coated with nutty sesame seeds.', 5.00, 'url_to_salmon_maki_image.jpg', 'MAKI'),
('TUNA MAKI', 'A vibrant assortment of julienned carrots, bell peppers, and cucumber, tightly encased in a nori-wrapped rice roll.', 5.00, 'url_to_tuna_maki_image.jpg', 'MAKI');

-- Categoría: SPECIAL ROLLS
INSERT INTO dishes (name, description, price, image_url, category) VALUES
('SUNRISE BLISS', 'A delicate combination of fresh salmon, cream cheese, and asparagus, rolled in orange-hued tobiko for a burst of sunrise-inspired flavors.', 16.00, 'url_to_sunrise_bliss_image.jpg', 'SPECIAL ROLLS'),
('MANGO TANGO FUSION', 'Tempura shrimp, cucumber, and avocado dance alongside sweet mango slices, drizzled with a tangy mango sauce.', 16.00, 'url_to_mango_tango_fusion_image.jpg', 'SPECIAL ROLLS'),
('TRUFFLE INDULGENCE', 'Decadent slices of black truffle grace a roll of succulent wagyu beef, cucumber, and microgreens, culminating in an exquisite umami symphony.', 16.00, 'url_to_truffle_indulgence_image.jpg', 'SPECIAL ROLLS'),
('PACIFIC FIRECRACKER', 'Spicy crab salad, tempura shrimp, and jalapeño peppers combine in a fiery ensemble, accented with a chili-infused aioli.', 16.00, 'url_to_pacific_firecracker_image.jpg', 'SPECIAL ROLLS'),
('ETERNAL EEL ENCHANTMENT', 'An enchanting blend of eel tempura, foie gras, and cucumber, elegantly layered with truffle oil and gold leaf for a touch of opulence.', 16.00, 'url_to_eternal_eel_enchantment_image.jpg', 'SPECIAL ROLLS');

-- Categoría: URAMAKI
INSERT INTO dishes (name, description, price, image_url, category) VALUES
('VOLCANO DELIGHT', 'Creamy crab salad, avocado, and cucumber rolled inside, topped with spicy tuna and drizzled with fiery sriracha sauce.', 12.00, 'url_to_volcano_delight_image.jpg', 'URAMAKI'),
('RAINBOW FUSION', 'A colorful blend of fresh tuna, salmon, yellowtail, and avocado, enveloping a core of cucumber and crab stick.', 12.00, 'url_to_rainbow_fusion_image.jpg', 'URAMAKI'),
('DRAGON ELEGANCE', 'Grilled eel and avocado nestled within the roll, draped with slices of ripe avocado resembling dragon scales.', 12.00, 'url_to_dragon_elegance_image.jpg', 'URAMAKI'),
('SUNSET SERENITY', 'Tempura shrimp, cucumber, and spicy mayo embraced by a roll of soy paper, crowned with slices of creamy mango.', 12.00, 'url_to_sunset_serenity_image.jpg', 'URAMAKI'),
('MYSTIC GARDEN', 'Shiitake mushrooms, asparagus, and cucumber intermingle with crispy tempura bits, blanketed by a layer of sesame seeds.', 12.00, 'url_to_mystic_garden_image.jpg', 'URAMAKI'),
('OCEAN BREEZE', 'A medley of fresh shrimp, crab stick, and avocado, laced with a gentle touch of zesty yuzu-infused tobiko.', 12.00, 'url_to_ocean_breeze_image.jpg', 'URAMAKI'),
('TOKYO BLOSSOM', 'Delicate pink soy paper envelopes a blend of tuna, crab stick, and cucumber, embellished with edible flower petals.', 12.00, 'url_to_tokyo_blossom_image.jpg', 'URAMAKI');


-- 3. Insertar datos en la Tabla 'blogs'
INSERT INTO blogs (title, image_url, description, content, author, publication_date) VALUES
('El Arte del Sushi: Una Introducción', 'url_to_blog_image_1.jpg', 'Descubre los secretos de la tradición milenaria del sushi.', 'El sushi no es solo comida, es una forma de arte... [contenido completo del blog]', 'Chef Hiroshi', '2023-01-15'),
('Los Beneficios de Comer Pescado Crudo', 'url_to_blog_image_2.jpg', 'Explora las propiedades nutricionales de los ingredientes frescos en el sushi.', 'Más allá de su delicioso sabor, el pescado crudo ofrece... [contenido completo del blog]', 'Nutricionista Ana', '2023-03-20'),
('HOW QITCHEN REDEFINES FLAVOR HARMONY IN EVERY BITE', 'url_to_qitchen_flavor_image.jpg', 'Experience an orchestra of tastes as Qitchen''s sushi unveils a symphony of perfectly balanced flavors.', 'Este es el contenido por defecto para "HOW QITCHEN REDEFINES FLAVOR HARMONY IN EVERY BITE". Aquí se expandiría la descripción del blog.', 'Name', '2023-08-24'),
('UNVEILING THE MASTERY BEHIND OUR CULINARY CRAFTSMANSHIP', 'url_to_qitchen_mastery_image.jpg', 'Explore the meticulous artistry and dedication that create Qitchen''s renowned sushi perfection.', 'Este es el contenido por defecto para "UNVEILING THE MASTERY BEHIND OUR CULINARY CRAFTSMANSHIP". Aquí se detallaría el proceso y la pasión detrás de cada creación.', 'Name', '2023-08-24'),
('JOURNEY THROUGH FRESHNESS EXQUISITE SUSHI SELECTION', 'url_to_qitchen_freshness_image.jpg', 'Embark on a seafood adventure, guided by Qitchen''s fresh and exquisite sushi creations from the sea.', 'Este es el contenido por defecto para "JOURNEY THROUGH FRESHNESS EXQUISITE SUSHI SELECTION". Se hablaría sobre la selección de ingredientes y la experiencia culinaria.', 'Name', '2023-08-24'),
('PALATE WITH QITCHEN''S UNSURPASSED SUSHI DELICACIES', 'url_to_qitchen_palate_image.jpg', 'Discover the heights of gastronomic delight as Qitchen''s sushi transports you to a new culinary realm.', 'Este es el contenido por defecto para "PALATE WITH QITCHEN''S UNSURPASSED SUSHI DELICACIES". Se describirían las sensaciones y el impacto de los sabores.', 'Name', '2023-08-24'),
('THE QITCHEN EXPERIENCE BEYOND SUSHI', 'url_to_qitchen_experience_image.jpg', 'Immerse in Qitchen''s passion for culinary excellence, where sushi is more than a dish—it''s an experience.', 'Este es el contenido por defecto para "THE QITCHEN EXPERIENCE BEYOND SUSHI". Se ahondaría en la filosofía y el ambiente que complementan la comida.', 'Name', '2023-08-24');


-- 4. Insertar una Reserva (como si fuera de un usuario no registrado)
INSERT INTO reservations (name, phone_number, email, number_of_guests, reservation_date, reservation_time) VALUES
('Maria Gomez', '78965432', 'maria.gomez@example.com', 4, '2025-07-01', '20:00:00');


-- 5. Insertar una Orden para el Usuario Registrado (Juan Perez) y sus Ítems
-- Paso 5.1: Crear la Orden en la tabla 'orders' con el total calculado.
-- Se obtienen los IDs de usuario y el total calculado directamente dentro del INSERT.
-- (2 * 5.00) + (1 * 16.00) = $26.00
INSERT INTO orders (user_id, total_amount, status) VALUES
(
    (SELECT id FROM users WHERE email = 'juan.perez@example.com'), -- Obtiene user_id
    26.00, -- total_amount pre-calculado
    'completed'
);

-- Paso 5.2: Insertar los ítems de la orden
-- Aquí asumimos que la orden anterior fue la última insertada por el usuario Juan Perez
-- (lo cual es seguro para un script secuencial, no para concurrencia real).
INSERT INTO order_items (order_id, dish_id, quantity, unit_price) VALUES
(
    (SELECT id FROM orders WHERE user_id = (SELECT id FROM users WHERE email = 'juan.perez@example.com') ORDER BY order_date DESC LIMIT 1), -- Obtiene el order_id
    (SELECT id FROM dishes WHERE name = 'SPICY TUNA MAKI'), 2, 5.00
),
(
    (SELECT id FROM orders WHERE user_id = (SELECT id FROM users WHERE email = 'juan.perez@example.com') ORDER BY order_date DESC LIMIT 1), -- Obtiene el mismo order_id
    (SELECT id FROM dishes WHERE name = 'SUNRISE BLISS'), 1, 16.00
);


-- 6. Insertar un Blog Favorito para el Usuario Registrado
-- Se selecciona uno de los blogs recién agregados.
INSERT INTO user_favorite_blogs (user_id, blog_id) VALUES
(
    (SELECT id FROM users WHERE email = 'juan.perez@example.com'), -- Obtiene user_id
    (SELECT id FROM blogs WHERE title = 'HOW QITCHEN REDEFINES FLAVOR HARMONY IN EVERY BITE') -- Obtiene blog_id
);